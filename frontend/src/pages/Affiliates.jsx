import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Affiliates = () => {
    const [affiliates, setAffiliates] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAffiliates = async () => {
        try {
            const res = await api.get('/admin/affiliates');
            setAffiliates(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAffiliates();
    }, []);

    const handleApprove = async (id) => {
        if (window.confirm('Approve this affiliate?')) {
            try {
                await api.patch(`/admin/affiliates/${id}/approve`);
                fetchAffiliates();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleDisable = async (id) => {
        if (window.confirm('Disable this affiliate?')) {
            try {
                await api.patch(`/admin/affiliates/${id}/disable`);
                fetchAffiliates();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleCommission = async (id, currentRate) => {
        const rate = prompt('Enter new commission rate (0-100):', currentRate);
        if (rate !== null) {
            try {
                await api.patch(`/admin/affiliates/${id}/commission`, { commissionRate: Number(rate) });
                fetchAffiliates();
            } catch (err) {
                alert('Failed update');
            }
        }
    };

    const toggleDetails = (id) => {
        // Simple toggle via alert for now, or expand row. Ideally a modal.
        // Let's use a simple alert for MVP as requested "View Payout Details"
        const affiliate = affiliates.find(a => a._id === id);
        if (!affiliate || !affiliate.payoutSettings) return;

        const { method, paypalEmail, bankDetails } = affiliate.payoutSettings;
        let info = `Method: ${method.toUpperCase()}\n`;

        if (method === 'paypal') {
            info += `Email: ${paypalEmail}`;
        } else if (method === 'bank' && bankDetails) {
            info += `Holder: ${bankDetails.accountHolderName}\n`;
            info += `Bank: ${bankDetails.bankName}\n`;
            info += `Account: ${bankDetails.accountNumber}\n`; // Show full for payout
            info += `IFSC: ${bankDetails.ifscOrRouting}\n`;
            info += `Country: ${bankDetails.country}`;
        }
        alert(info);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Affiliates Management</h2>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '14px' }}>
                <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Rate</th>
                        <th>Payout Info (Masked)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {affiliates.map((aff) => (
                        <tr key={aff._id}>
                            <td>{aff.name} <br /><small style={{ color: '#666' }}>{aff.affiliateCode}</small></td>
                            <td>{aff.email}</td>
                            <td>
                                <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: aff.approved ? '#d1fae5' : '#fee2e2',
                                    color: aff.approved ? '#065f46' : '#991b1b'
                                }}>
                                    {aff.approved ? 'Active' : 'Pending'}
                                </span>
                            </td>
                            <td>{aff.commissionRate}%</td>
                            <td style={{ maxWidth: '200px' }}>
                                {aff.payoutSettings ? (
                                    <>
                                        <strong>{aff.payoutSettings.method === 'paypal' ? 'PayPal' : 'Bank'}</strong>: <br />
                                        {aff.payoutSettings.method === 'paypal'
                                            ? aff.payoutSettings.paypalEmail
                                            : (aff.payoutSettings.bankDetails?.accountNumber
                                                ? `****${aff.payoutSettings.bankDetails.accountNumber.slice(-4)}`
                                                : 'N/A')}
                                        <br />
                                        <button
                                            onClick={() => toggleDetails(aff._id)}
                                            style={{ marginTop: '5px', fontSize: '11px', cursor: 'pointer' }}
                                        >
                                            View Full Details
                                        </button>
                                    </>
                                ) : <span style={{ color: '#aaa' }}>Not Set</span>}
                            </td>
                            <td>
                                {!aff.approved && (
                                    <button onClick={() => handleApprove(aff._id)}>Approve</button>
                                )}
                                {aff.approved && (
                                    <button onClick={() => handleDisable(aff._id)}>Disable</button>
                                )}
                                {' '}
                                <button onClick={() => handleCommission(aff._id, aff.commissionRate)}>Rate</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Affiliates;
