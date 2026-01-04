import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Commissions = () => {
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);

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
                fetchCommissions();
            } catch (err) {
                alert('Update failed');
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Commissions</h2>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Affiliate</th>
                        <th>Subtotal</th>
                        <th>Commission</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {commissions.map((comm) => (
                        <tr key={comm._id}>
                            <td>{comm.orderId}</td>
                            <td>{comm.affiliate ? comm.affiliate.name : 'Unknown'} ({comm.affiliate?.affiliateCode})</td>
                            <td>{comm.orderSubtotal}</td>
                            <td>{comm.commissionAmount}</td>
                            <td style={{
                                color: comm.status === 'paid' ? 'green' :
                                    comm.status === 'cancelled' ? 'red' : 'orange'
                            }}>
                                {comm.status.toUpperCase()}
                            </td>
                            <td>
                                {comm.status === 'pending' && (
                                    <button
                                        onClick={() => handleAction(comm._id, 'approve')}
                                        style={{ marginRight: '5px', background: '#3B82F6', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                    >
                                        Approve
                                    </button>
                                )}
                                {comm.status === 'approved' && (
                                    <button
                                        onClick={() => handleAction(comm._id, 'pay')}
                                        style={{ background: '#10B981', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                    >
                                        Mark Paid
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Commissions;
