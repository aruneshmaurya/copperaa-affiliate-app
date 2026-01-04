import React, { useEffect, useState } from 'react';
import api from '../services/api';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import DashboardStyles from '../components/DashboardStyles';

// Simple Icons (using SVG directly to avoid dependencies)
const Icons = {
    Wallet: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>,
    CheckCircle: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    Clock: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    MousePointer: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path d="M13 13l6 6" /></svg>,
    Copy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
    Logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
};

const AffiliateDashboard = () => {
    const [stats, setStats] = useState(null);
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Payment Settings State
    const [paymentMethod, setPaymentMethod] = useState('paypal');
    const [paymentEmail, setPaymentEmail] = useState('');
    const [paymentMsg, setPaymentMsg] = useState('');
    const [copyState, setCopyState] = useState('Copy Link');

    const user = authService.getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await api.get('/affiliate/stats');
                const commRes = await api.get('/affiliate/commissions');
                // Fetch fresh user profile for payment settings
                const meRes = await api.get('/auth/me');

                setStats(statsRes.data);
                setCommissions(commRes.data);

                if (meRes.data.paymentMethod) setPaymentMethod(meRes.data.paymentMethod);
                if (meRes.data.paymentEmail) setPaymentEmail(meRes.data.paymentEmail);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login-affiliate');
    };

    const handlePaymentSave = async (e) => {
        e.preventDefault();
        try {
            await api.put('/affiliate/payment', { paymentMethod, paymentEmail });
            setPaymentMsg('Payment settings saved successfully!');
            setTimeout(() => setPaymentMsg(''), 3000);
        } catch (err) {
            setPaymentMsg('Error saving settings');
            console.error(err);
        }
    };

    const copyLink = () => {
        const referralLink = `https://copperaa.com/?aff=${user?.affiliateCode}`;
        navigator.clipboard.writeText(referralLink);
        setCopyState('Copied!');
        setTimeout(() => setCopyState('Copy Link'), 2000);
    };

    if (loading) return (
        <>
            <DashboardStyles />
            <div className="loading-screen">Loading Dashboard...</div>
        </>
    );

    const referralLink = `https://copperaa.com/?aff=${user?.affiliateCode}`;

    return (
        <>
            <DashboardStyles />
            <div className="app-wrapper">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-brand">Copperaa Affiliate</div>
                    <div className="navbar-user">
                        <span className="user-greeting">Hi, {user.name}</span>
                        <button onClick={handleLogout} className="btn-logout" title="Logout">
                            <Icons.Logout /> Logout
                        </button>
                    </div>
                </nav>

                <div className="dashboard-container">

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-label">Total Earnings</div>
                            <div className="stat-value copper-text">USD {stats.totalEarnings}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Paid Out</div>
                            <div className="stat-value">USD {stats.paidEarnings}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Pending</div>
                            <div className="stat-value" style={{ color: '#F59E0B' }}>USD {stats.unpaidEarnings}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Total Clicks</div>
                            <div className="stat-value">{stats.totalClicks}</div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                        {/* Referral Link Card */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Promote & Earn</h3>
                                <p className="card-subtitle">Share this link to earn 10% commission on every sale.</p>
                            </div>
                            <div className="input-group">
                                <input
                                    className="form-control form-control-readonly"
                                    readOnly
                                    value={referralLink}
                                />
                                <button onClick={copyLink} className="btn btn-primary btn-copy">
                                    <Icons.Copy /> {copyState}
                                </button>
                            </div>
                        </div>

                        {/* Payout Settings Card */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Payout Settings</h3>
                                <p className="card-subtitle">Configure where you want to receive your payments.</p>
                            </div>

                            {paymentMsg && <div style={{ color: paymentMsg.includes('Error') ? 'red' : 'green', marginBottom: '1rem', fontWeight: 500 }}>{paymentMsg}</div>}

                            <form onSubmit={handlePaymentSave}>
                                <div className="form-group">
                                    <label className="form-label">Payment Method</label>
                                    <select
                                        className="form-control"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="paypal">PayPal</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        {paymentMethod === 'paypal' ? 'PayPal Email Address' : 'Bank Account Details'}
                                    </label>
                                    {paymentMethod === 'paypal' ? (
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={paymentEmail}
                                            onChange={(e) => setPaymentEmail(e.target.value)}
                                            placeholder="Enter your PayPal email"
                                            required
                                        />
                                    ) : (
                                        <textarea
                                            className="form-control"
                                            value={paymentEmail}
                                            onChange={(e) => setPaymentEmail(e.target.value)}
                                            placeholder="Bank Name, Account Number, SWIFT/IBAN, Beneficiary Name"
                                            required
                                            rows="3"
                                        />
                                    )}
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Save Settings
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Commissions Table */}
                    <h3 style={{ margin: '2rem 0 1rem 0', fontWeight: 600, color: '#1F2937' }}>Recent Commissions</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Subtotal</th>
                                    <th>Commission</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commissions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                                            No commissions found yet. Start promoting!
                                        </td>
                                    </tr>
                                ) : (
                                    commissions.map(comm => (
                                        <tr key={comm._id}>
                                            <td style={{ fontWeight: 500 }}>{comm.orderId}</td>
                                            <td>USD {comm.orderSubtotal}</td>
                                            <td style={{ fontWeight: 600, color: '#1F2937' }}>USD {comm.commissionAmount}</td>
                                            <td>
                                                <span className={`badge badge-${comm.status === 'approved' ? 'approved' : comm.status}`}>
                                                    {comm.status}
                                                </span>
                                            </td>
                                            <td>{new Date(comm.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
};

export default AffiliateDashboard;
