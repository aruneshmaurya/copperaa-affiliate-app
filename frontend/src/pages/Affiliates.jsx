import React, { useEffect, useState } from 'react';
import api from '../services/api';
// Icons from AdminLayout or inline
const Icons = {
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
};

const Affiliates = () => {
    const [affiliates, setAffiliates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAffiliate, setSelectedAffiliate] = useState(null); // For Modal

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

    if (loading) return <div className="p-4">Loading affiliates...</div>;

    return (
        <div>
            {/* Table Card */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '25%' }}>Affiliate</th>
                            <th style={{ width: '25%' }}>Email</th>
                            <th style={{ width: '10%' }}>Status</th>
                            <th style={{ width: '10%' }}>Rate</th>
                            <th style={{ width: '20%' }}>Payout Info</th>
                            <th style={{ width: '10%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {affiliates.map((aff) => (
                            <tr key={aff._id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{aff.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Code: {aff.affiliateCode}</div>
                                </td>
                                <td>{aff.email}</td>
                                <td>
                                    <span className={`badge ${aff.approved ? 'success' : 'warning'}`}>
                                        {aff.approved ? 'Active' : 'Pending'}
                                    </span>
                                </td>
                                <td>{aff.commissionRate}%</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.85rem' }}>
                                            {aff.payoutSettings?.method === 'paypal' ? 'PayPal' : (aff.payoutSettings?.method === 'bank' ? 'Bank' : '-')}
                                        </span>
                                        {aff.payoutSettings?.method && (
                                            <button className="btn-icon" onClick={() => setSelectedAffiliate(aff)} title="View Details">
                                                <Icons.Eye />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {!aff.approved && (
                                            <button className="btn btn-primary btn-sm" onClick={() => handleApprove(aff._id)} title="Approve">
                                                <Icons.Check />
                                            </button>
                                        )}
                                        {aff.approved && (
                                            <button className="btn-icon" style={{ color: '#EF4444' }} onClick={() => handleDisable(aff._id)} title="Disable">
                                                <Icons.X />
                                            </button>
                                        )}
                                        <button className="btn-icon" onClick={() => handleCommission(aff._id, aff.commissionRate)} title="Set Rate">
                                            <Icons.Edit />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payout Details Modal */}
            {selectedAffiliate && (
                <div className="modal-overlay" onClick={() => setSelectedAffiliate(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>Payout Details</h3>
                            <button className="btn-icon" onClick={() => setSelectedAffiliate(null)}><Icons.X /></button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>Affiliate Name</div>
                            <div style={{ fontWeight: 600 }}>{selectedAffiliate.name}</div>
                        </div>

                        {selectedAffiliate.payoutSettings?.method === 'paypal' && (
                            <div>
                                <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#B87333' }}>PayPal</h4>
                                <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Email Address</div>
                                    <div style={{ fontWeight: 500, fontSize: '1.1rem' }}>{selectedAffiliate.payoutSettings.paypalEmail}</div>
                                </div>
                            </div>
                        )}

                        {selectedAffiliate.payoutSettings?.method === 'bank' && (
                            <div>
                                <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#B87333' }}>Bank Transfer</h4>
                                <div style={{ display: 'grid', gap: '1rem', background: '#F9FAFB', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Account Holder</div>
                                        <div style={{ fontWeight: 500 }}>{selectedAffiliate.payoutSettings.bankDetails.accountHolderName}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Bank Name</div>
                                        <div style={{ fontWeight: 500 }}>{selectedAffiliate.payoutSettings.bankDetails.bankName}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Account Number</div>
                                        <div style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '1rem' }}>{selectedAffiliate.payoutSettings.bankDetails.accountNumber}</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>IFSC / Routing</div>
                                            <div style={{ fontWeight: 500 }}>{selectedAffiliate.payoutSettings.bankDetails.ifscOrRouting}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Country</div>
                                            <div style={{ fontWeight: 500 }}>{selectedAffiliate.payoutSettings.bankDetails.country}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                            <button className="btn btn-primary" onClick={() => setSelectedAffiliate(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Affiliates;
