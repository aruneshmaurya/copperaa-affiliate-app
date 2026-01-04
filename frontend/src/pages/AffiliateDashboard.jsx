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
                d.setDate(d.getDate() - i);
                const dateStr = d.toLocaleDateString();

                // Sum commissions for this day
                const dayTotal = commRes.data.reduce((acc, c) => {
                    const cDate = new Date(c.createdAt).toLocaleDateString();
                    if (cDate === dateStr && c.status !== 'cancelled') {
                        return acc + Number(c.commissionAmount);
                    }
                    return acc;
                }, 0);

                chartData.push({ date: dateStr.slice(0, 5), amount: dayTotal }); // format: MM/DD
            }
                setDailyData(chartData);
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

// Helper for max value in chart to scale height
const maxChartVal = Math.max(...dailyData.map(d => d.amount), 10);

return (
    <div>
        {/* Top Stat Cards */}
        <div className="stat-grid">
            <div className="card">
                <div className="stat-label">Total Earnings</div>
                <div className="stat-val" style={{ color: '#B87333' }}>${stats.totalEarnings}</div>
            </div>
            <div className="card">
                <div className="stat-label">Paid Out</div>
                <div className="stat-val" style={{ color: '#10B981' }}>${stats.paidEarnings}</div>
            </div>
            <div className="card">
                <div className="stat-label">Pending Payout</div>
                <div className="stat-val" style={{ color: '#F59E0B' }}>${stats.unpaidEarnings}</div>
            </div>
            <div className="card">
                <div className="stat-label">Total Clicks</div>
                <div className="stat-val">${stats.totalClicks}</div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>

            {/* Visual Chart (Manual CSS Bar Chart) */}
            <div className="card">
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontWeight: 600 }}>Earnings - Last 7 Days</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px' }}>
                    {dailyData.map((d, i) => (
                        <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{
                                height: `${(d.amount / maxChartVal) * 150}px`,
                                background: d.amount > 0 ? '#B87333' : '#E5E7EB',
                                width: '30%',
                                margin: '0 auto',
                                borderRadius: '4px 4px 0 0',
                                minHeight: '4px',
                                transition: 'height 0.5s ease'
                            }}></div>
                            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#6B7280' }}>{d.date}</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>${d.amount}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Referral Link Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ marginTop: 0, fontWeight: 600 }}>Promote & Earn</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Share your link to earn 10% on every sale.</p>

                <div style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '1rem', wordBreak: 'break-all', fontFamily: 'monospace', fontWeight: 500 }}>
                    {referralLink}
                </div>

                <button onClick={copyLink} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
                    <Icons.Copy /> {copyState}
                </button>
            </div>
        </div>

        {/* Commissions Table */}
        <div className="table-container">
            <h3 style={{ padding: '1.5rem 1.5rem 0', marginTop: 0, fontWeight: 600 }}>Recent Commissions</h3>
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
                            <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>No commissions yet.</td>
                        </tr>
                    ) : (
                        commissions.map(comm => (
                            <tr key={comm._id}>
                                <td style={{ fontWeight: 500, fontFamily: 'monospace' }}>{comm.orderId}</td>
                                <td>${comm.orderSubtotal}</td>
                                <td style={{ fontWeight: 600, color: '#111827' }}>${comm.commissionAmount}</td>
                                <td>
                                    <span className={`badge ${comm.status === 'paid' ? 'success' :
                                        comm.status === 'approved' ? 'info' :
                                            comm.status === 'cancelled' ? 'error' : 'warning'
                                        }`}>
                                        {comm.status}
                                    </span>
                                </td>
                                <td style={{ color: '#6B7280' }}>{new Date(comm.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);
};

export default AffiliateDashboard;
