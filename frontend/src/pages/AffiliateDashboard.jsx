import React, { useEffect, useState } from 'react';
import api from '../services/api';
import authService from '../services/auth.service';

const Icons = {
    Copy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
};

const AffiliateDashboard = () => {
    const [stats, setStats] = useState(null);
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copyState, setCopyState] = useState('Copy Link');
    const [dailyData, setDailyData] = useState([]);

    const user = authService.getCurrentUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, commRes] = await Promise.all([
                    api.get('/affiliate/stats'),
                    api.get('/affiliate/commissions')
                ]);

                setStats(statsRes.data);
                setCommissions(commRes.data);

                // Process Daily Earnings for Chart (simple 7 days)
                const days = 7;
                const chartData = [];
                for (let i = days - 1; i >= 0; i--) {
                    const d = new Date();
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
