import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Commissions = () => {
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, paid
    const [selectedCommission, setSelectedCommission] = useState(null);
    const [showPayModal, setShowPayModal] = useState(false);

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
        if (action === 'pay') {
            // Find commission and open modal
            const comm = commissions.find(c => c._id === id);
            if (comm) {
                setSelectedCommission(comm);
                setShowPayModal(true);
            }
            return;
        }

        const confirmMsg = 'Approve this commission? Affiliate will see it as earnings.';

        if (window.confirm(confirmMsg)) {
            try {
                await api.patch(`/admin/commissions/${id}/${action}`);
                fetchCommissions(); // Refresh
            } catch (err) {
                console.error(err);
                alert('Update failed');
            }
        }
    };

    const confirmPayment = async () => {
        if (!selectedCommission) return;
        try {
            await api.patch(`/admin/commissions/${selectedCommission._id}/pay`);
            setShowPayModal(false);
            setSelectedCommission(null);
            fetchCommissions();
            alert('Payment status updated to PAID');
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
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
                                    <td style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#111827' }}>{comm.orderId}</td>
                                    <td>
                                        <div style={{ fontWeight: 500, color: '#111827' }}>
                                            {comm.affiliate ? comm.affiliate.name : 'Unknown User'}
                                        </div>
                                        {comm.affiliate && (
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                                {comm.affiliate.email}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: '#111827' }}>
                                            ${comm.commissionAmount}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
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


            {/* Payment Modal */}
            {
                showPayModal && selectedCommission && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                    }}>
                        <div style={{
                            background: 'white', padding: '2rem', borderRadius: '12px',
                            width: '500px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h3 style={{ marginTop: 0, fontSize: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                Payout Details
                            </h3>

                            <div style={{ margin: '1.5rem 0' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#6B7280' }}>Affiliate</label>
                                        <div style={{ fontWeight: 600 }}>{selectedCommission.affiliate?.name}</div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#6B7280' }}>Amount to Pay</label>
                                        <div style={{ fontWeight: 700, color: '#059669', fontSize: '1.25rem' }}>
                                            ${selectedCommission.commissionAmount}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: '#F9FAFB', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                                    <label style={{ fontSize: '0.85rem', color: '#6B7280', display: 'block', marginBottom: '0.5rem' }}>
                                        Payment Method: <span style={{ textTransform: 'uppercase', fontWeight: 600, color: '#111827' }}>
                                            {selectedCommission.affiliate?.payoutSettings?.method || 'Not Set'}
                                        </span>
                                    </label>

                                    {selectedCommission.affiliate?.payoutSettings?.method === 'paypal' ? (
                                        <div>
                                            <div style={{ fontSize: '0.9rem' }}>PayPal Email:</div>
                                            <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1.1rem' }}>
                                                {selectedCommission.affiliate?.payoutSettings?.paypalEmail || 'N/A'}
                                            </div>
                                        </div>
                                    ) : (selectedCommission.affiliate?.payoutSettings?.method === 'bank' ? (
                                        <div style={{ fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div><strong>Bank:</strong> {selectedCommission.affiliate?.payoutSettings?.bankDetails?.bankName}</div>
                                            <div><strong>A/C Num:</strong> {selectedCommission.affiliate?.payoutSettings?.bankDetails?.accountNumber}</div>
                                            <div><strong>Holder:</strong> {selectedCommission.affiliate?.payoutSettings?.bankDetails?.accountHolderName}</div>
                                            <div><strong>IFSC/Routing:</strong> {selectedCommission.affiliate?.payoutSettings?.bankDetails?.ifscOrRouting}</div>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#DC2626' }}>No payout details configured by affiliate.</div>
                                    ))}
                                </div>

                                <p style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '1.5rem', fontStyle: 'italic' }}>
                                    * Please ensure you have manually transferred the funds before confirming.
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button
                                    onClick={() => setShowPayModal(false)}
                                    style={{
                                        padding: '0.75rem 1.5rem', border: '1px solid #D1D5DB',
                                        borderRadius: '6px', background: 'white', cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmPayment}
                                    className="btn btn-primary"
                                    style={{ background: '#059669', border: 'none' }}
                                >
                                    Confirm Payment Sent
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Commissions;
