import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AffiliateSettings = () => {
    const [payoutSettings, setPayoutSettings] = useState({
        method: 'paypal',
        paypalEmail: '',
        bankDetails: {
            accountHolderName: '',
            bankName: '',
            accountNumber: '',
            ifscOrRouting: '',
            swiftOrIban: '',
            country: ''
        }
    });
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/auth/me');
                if (res.data.payoutSettings) {
                    setPayoutSettings({
                        method: res.data.payoutSettings.method || 'paypal',
                        paypalEmail: res.data.payoutSettings.paypalEmail || '',
                        bankDetails: {
                            accountHolderName: res.data.payoutSettings.bankDetails?.accountHolderName || '',
                            bankName: res.data.payoutSettings.bankDetails?.bankName || '',
                            accountNumber: res.data.payoutSettings.bankDetails?.accountNumber || '',
                            ifscOrRouting: res.data.payoutSettings.bankDetails?.ifscOrRouting || '',
                            swiftOrIban: res.data.payoutSettings.bankDetails?.swiftOrIban || '',
                            country: res.data.payoutSettings.bankDetails?.country || ''
                        }
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setMsg({ text: '', type: '' });
        try {
            await api.put('/affiliate/payment', payoutSettings);
            setMsg({ text: 'Settings saved successfully!', type: 'success' });
            setTimeout(() => setMsg({ text: '', type: '' }), 3000);
        } catch (err) {
            setMsg({ text: err.response?.data?.message || 'Failed to save settings', type: 'error' });
        }
    };

    if (loading) return <div className="p-4">Loading settings...</div>;

    return (
        <div style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Payout Configuration</h2>

            <div className="card">
                <div style={{ marginBottom: '2rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Payment Preferences</h3>
                    <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Choose how you would like to receive your commissions.</p>
                </div>

                {msg.text && (
                    <div className={`badge ${msg.type}`} style={{ display: 'block', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center', borderRadius: '12px' }}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label className="form-label">Payment Method</label>
                        <select
                            value={payoutSettings.method}
                            onChange={(e) => setPayoutSettings({ ...payoutSettings, method: e.target.value })}
                            className="form-control"
                        >
                            <option value="paypal">PayPal</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>

                    {payoutSettings.method === 'paypal' ? (
                        <div className="form-group">
                            <label className="form-label">PayPal Email Address</label>
                            <input
                                type="email"
                                value={payoutSettings.paypalEmail}
                                onChange={(e) => setPayoutSettings({ ...payoutSettings, paypalEmail: e.target.value })}
                                placeholder="example@email.com"
                                required
                                className="form-control"
                            />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Account Holder Name *</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.accountHolderName}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, accountHolderName: e.target.value } })}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Bank Name *</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.bankName}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, bankName: e.target.value } })}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Account Number *</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.accountNumber}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, accountNumber: e.target.value } })}
                                    required
                                    className="form-control"
                                    style={{ fontFamily: 'monospace' }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">IFSC / Routing *</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.ifscOrRouting}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, ifscOrRouting: e.target.value } })}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Country *</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.country}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, country: e.target.value } })}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">SWIFT / IBAN (Optional)</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.swiftOrIban}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, swiftOrIban: e.target.value } })}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
                            Save Configuration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AffiliateSettings;
