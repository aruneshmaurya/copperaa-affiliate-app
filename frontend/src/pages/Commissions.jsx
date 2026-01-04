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

    const handlePay = async (id) => {
        if (window.confirm('Mark this commission as PAID? This does not send money, only updates record.')) {
            try {
                await api.patch(`/admin/commissions/${id}/pay`);
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
                                {comm.status === 'unpaid' && (
                                    <button onClick={() => handlePay(comm._id)}>Mark Paid</button>
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
