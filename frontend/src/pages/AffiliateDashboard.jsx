import React, { useEffect, useState } from 'react';
import api from '../services/api';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const Icons = {
    Copy: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
    Chart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>,
    Wallet: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>,
    Clock: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    Mouse: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>,
    External: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>,
    Support: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
    Gear: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
};

const AffiliateDashboard = () => {
    const [stats, setStats] = useState(null);
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copyState, setCopyState] = useState('Copy Link');
    const [supportModalOpen, setSupportModalOpen] = useState(false);

    const user = authService.getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, commRes] = await Promise.all([
                    api.get('/affiliate/stats'),
                    api.get('/affiliate/commissions')
                ]);

                setStats(statsRes.data);
                setCommissions(commRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const copyLink = () => {
        const referralLink = `https://copperaa.com/?aff=${user?.affiliateCode}`;
        navigator.clipboard.writeText(referralLink);
        setCopyState('Copied!');
        setTimeout(() => setCopyState('Copy Link'), 2000);
    };

    if (loading) return <div className="p-4">Loading dashboard...</div>;

    const referralLink = `https://copperaa.com/?aff=${user?.affiliateCode}`;

    return (
        <div>
            {/* 1. KPI Stats Grid (4 Columns) */}
            <div className="stat-grid">
                <div className="card">
                    <div className="stat-label">
                        <span>Total Earnings</span>
                        <span style={{ color: '#B87333', background: 'rgba(184, 115, 51, 0.1)', padding: '6px', borderRadius: '8px' }}><Icons.Chart /></span>
                    </div>
                    <div className="stat-val" style={{ color: '#B87333' }}>${stats.totalEarnings}</div>
                </div>
                <div className="card">
                    <div className="stat-label">
                        <span>Paid Out</span>
                        <span style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px', borderRadius: '8px' }}><Icons.Wallet /></span>
                    </div>
                    <div className="stat-val" style={{ color: '#10B981' }}>${stats.paidEarnings}</div>
                </div>
                <div className="card">
                    <div className="stat-label">
                        <span>Pending</span>
                        <span style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', padding: '6px', borderRadius: '8px' }}><Icons.Clock /></span>
                    </div>
                    <div className="stat-val" style={{ color: '#F59E0B' }}>${stats.unpaidEarnings}</div>
                </div>
                <div className="card">
                    <div className="stat-label">
                        <span>Total Clicks</span>
                        <span style={{ color: '#6366F1', background: 'rgba(99, 102, 241, 0.1)', padding: '6px', borderRadius: '8px' }}><Icons.Mouse /></span>
                    </div>
                    <div className="stat-val">{stats.totalClicks}</div>
                </div>
            </div>

            {/* 2. Referral & Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Referral Card */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderColor: '#B87333', borderWidth: '1px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem' }}>Your Referral Link</h3>
                            <p style={{ color: '#B87333', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: 500 }}>
                                Earn 10% commission on every sale made through this link.
                            </p>
                        </div>
                        <div className="badge info" style={{ fontSize: '0.85rem' }}>Active Campaign</div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, background: '#F3F4F6', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #E5E7EB', fontFamily: 'monospace', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center' }}>
                            {referralLink}
                        </div>
                        <button onClick={copyLink} className="btn btn-primary" style={{ minWidth: '140px' }}>
                            <Icons.Copy /> {copyState}
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <a href="https://www.copperaa.com/collections/all" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '1rem', justifyContent: 'flex-start' }}>
                        <Icons.External /> <span style={{ marginLeft: '0.5rem' }}>View Store</span>
                    </a>
                    <button onClick={() => navigate('/affiliate/settings')} className="btn btn-secondary" style={{ padding: '1rem', justifyContent: 'flex-start' }}>
                        <Icons.Gear /> <span style={{ marginLeft: '0.5rem' }}>Payout Settings</span>
                    </button>
                    <button onClick={() => setSupportModalOpen(true)} className="btn btn-secondary" style={{ padding: '1rem', justifyContent: 'flex-start' }}>
                        <Icons.Support /> <span style={{ marginLeft: '0.5rem' }}>Contact Support</span>
                    </button>
                </div>
            </div>

            {/* 3. Recent Commissions Table */}
            <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 600, color: '#1F2937', fontSize: '1.25rem' }}>Recent Commissions</h3>
            <div className="table-container">
                <table className="data-table">
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
                                <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: '#9CA3AF' }}>
                                    <div style={{ marginBottom: '1rem', fontSize: '3rem', opacity: 0.2 }}>💸</div>
                                    <div style={{ fontWeight: 500, fontSize: '1.1rem' }}>No commissions yet</div>
                                    <div style={{ fontSize: '0.9rem' }}>Share your link to start earning!</div>
                                </td>
                            </tr>
                        ) : (
                            commissions.map(comm => (
                                <tr key={comm._id}>
                                    <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>#{comm.orderId}</td>
                                    <td>${comm.orderSubtotal}</td>
                                    <td style={{ fontWeight: 700, color: '#B87333' }}>${comm.commissionAmount}</td>
                                    <td>
                                        <span className={`badge ${comm.status === 'paid' ? 'success' :
                                            comm.status === 'approved' ? 'info' :
                                                comm.status === 'cancelled' ? 'error' : 'warning'
                                            }`}>
                                            {comm.status}
                                        </span>
                                    </td>
                                    <td style={{ color: '#6B7280' }}>{new Date(comm.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Support Modal */}
            {supportModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }} onClick={() => setSupportModalOpen(false)}>
                    <div className="card" style={{ width: '400px', maxWidth: '90%', animation: 'fadeIn 0.2s ease-out' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0 }}>Contact Support</h3>
                        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>Need help? Reach out to our partner support team.</p>

                        <a href="mailto:contact@copperaa.com" className="btn btn-secondary" style={{ display: 'flex', width: '100%', marginBottom: '1rem', justifyContent: 'center' }}>
                            📧 Email Support
                        </a>
                        <a href="https://wa.me/919214836314" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'flex', width: '100%', justifyContent: 'center', background: '#25D366', border: 'none', boxShadow: 'none' }}>
                            📱 Chat on WhatsApp
                        </a>

                        <button onClick={() => setSupportModalOpen(false)} style={{ marginTop: '1.5rem', width: '100%', padding: '0.5rem', background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '0.9rem' }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AffiliateDashboard;
