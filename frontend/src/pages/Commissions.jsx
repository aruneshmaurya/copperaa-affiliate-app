import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Commissions = () => {
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, paid

    const fetchCommissions = async () => {
        try {
            const res = await api.get('/admin/commissions');
            setCommissions(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    const handleAction = async (id, action) => {
        const confirmMsg = action === 'approve'
            ? 'Approve this commission? Affiliate will see it as earnings.'
            : 'Mark as PAID? Ensure you have sent the money manually.';

        if (window.confirm(confirmMsg)) {
            try {
                await api.patch(`/admin/commissions/${id}/${action}`);
                fetchCommissions(); // Refresh
            } catch (err) {
                alert('Update failed');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid': return <span className="badge success">Paid</span>;
            case 'approved': return <span className="badge info">Approved</span>;
            case 'pending': return <span className="badge warning">Pending</span>;
            case 'cancelled': return <span className="badge error">Cancelled</span>;
            case 'reversed': return <span className="badge error">Reversed</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    const filteredCommissions = commissions.filter(c => {
        if (filter === 'all') return true;
        if (filter === 'pending') return c.status === 'pending';
        if (filter === 'approved') return c.status === 'approved';
        if (filter === 'paid') return c.status === 'paid';
        return true;
    });

    if (loading) return <div className="p-4">Loading commissions...</div>;

    return (
        <div>
            {/* Filter Tabs */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                {['all', 'pending', 'approved', 'paid'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`btn ${filter === f ? 'btn-primary' : ''}`}
                        style={{
                            background: filter === f ? undefined : 'white',
                            color: filter === f ? undefined : '#6B7280',
                            border: filter === f ? 'none' : '1px solid #E5E7EB',
                            textTransform: 'capitalize'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Table Card */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '15%' }}>Date</th>
                            <th style={{ width: '15%' }}>Order ID</th>
                            <th style={{ width: '30%' }}>Affiliate</th>
                            <th style={{ width: '15%' }}>Amount</th>
                            <th style={{ width: '15%' }}>Status</th>
                            <th style={{ width: '10%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCommissions.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                                    No commissions found.
                                </td>
                            </tr>
                        ) : (
                            filteredCommissions.map((comm) => (
                                <tr key={comm._id}>
                                    <td style={{ color: '#6B7280', fontSize: '0.85rem' }}>
                                        {new Date(comm.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ fontFamily: 'monospace' }}>{comm.orderId}</td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>
                                            {comm.affiliate ? comm.affiliate.name : 'Unknown User'}
                                        </div>
                                        {comm.affiliate && (
                                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                                {comm.affiliate.email}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: '#111827' }}>
                                            ${comm.commissionAmount}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                            Order: ${comm.orderSubtotal}
                                        </div>
                                    </td>
                                    <td>{getStatusBadge(comm.status)}</td>
                                    <td>
                                        {comm.status === 'pending' && (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleAction(comm._id, 'approve')}
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {comm.status === 'approved' && (
                                            <button
                                                className="btn btn-sm"
                                                style={{ background: '#10B981', color: 'white' }}
                                                onClick={() => handleAction(comm._id, 'pay')}
                                            >
                                                Pay
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Commissions;
