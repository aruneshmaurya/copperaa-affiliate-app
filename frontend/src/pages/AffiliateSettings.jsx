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
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Payment Method</h3>
                    <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Choose how you want to receive your commissions.</p>
                </div>

                {msg.text && (
                    <div className={`badge ${msg.type}`} style={{ display: 'block', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleSave}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Method</label>
                        <select
                            value={payoutSettings.method}
                            onChange={(e) => setPayoutSettings({ ...payoutSettings, method: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                        >
                            <option value="paypal">PayPal</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>

                    {payoutSettings.method === 'paypal' ? (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>PayPal Email Address</label>
                            <input
                                type="email"
                                value={payoutSettings.paypalEmail}
                                onChange={(e) => setPayoutSettings({ ...payoutSettings, paypalEmail: e.target.value })}
                                placeholder="example@email.com"
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                            />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Account Holder Name *</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.accountHolderName}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, accountHolderName: e.target.value } })}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Bank Name *</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.bankName}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, bankName: e.target.value } })}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Account Number *</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.accountNumber}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, accountNumber: e.target.value } })}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: 'monospace' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>IFSC / Routing *</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.ifscOrRouting}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, ifscOrRouting: e.target.value } })}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Country *</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.country}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, country: e.target.value } })}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>SWIFT / IBAN (Optional)</label>
                                <input
                                    type="text"
                                    value={payoutSettings.bankDetails.swiftOrIban}
                                    onChange={(e) => setPayoutSettings({ ...payoutSettings, bankDetails: { ...payoutSettings.bankDetails, swiftOrIban: e.target.value } })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                            Save Configuration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AffiliateSettings;
