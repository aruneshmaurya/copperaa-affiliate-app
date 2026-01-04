import React, { useEffect, useState } from 'react';
import api from '../services/api';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const AffiliateDashboard = () => {
    const [stats, setStats] = useState(null);
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = authService.getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await api.get('/affiliate/stats');
                const commRes = await api.get('/affiliate/commissions');
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

    const handleLogout = () => {
        authService.logout();
        navigate('/login-affiliate');
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading Dashboard...</div>;

    const referralLink = `https://copperaa.com/?ref=${user?.affiliateCode}`;

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Link copied to clipboard!');
    };

    return (
        <div style={{ fontFamily: 'sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ background: '#fff', padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Copperaa Affiliate</h2>
                <div>
                    <span style={{ marginRight: '15px' }}>Hello, {user.name}</span>
                    <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #ccc', padding: '5px 10px' }}>Logout</button>
                </div>
            </div>

            <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div style={cardStyle}>
                        <h4 style={cardInternalTitle}>Total Earnings</h4>
                        <p style={cardValue}>INR {stats.totalEarnings}</p>
                    </div>
                    <div style={cardStyle}>
                        <h4 style={cardInternalTitle}>Paid Earnings</h4>
                        <p style={cardValue}>INR {stats.paidEarnings}</p>
                    </div>
                    <div style={cardStyle}>
                        <h4 style={cardInternalTitle}>Unpaid Earnings</h4>
                        <p style={{ ...cardValue, color: '#B87333' }}>INR {stats.unpaidEarnings}</p>
                    </div>
                    <div style={cardStyle}>
                        <h4 style={cardInternalTitle}>Clicks</h4>
                        <p style={cardValue}>{stats.totalClicks}</p>
                    </div>
                </div>

                {/* Referral Link Section */}
                <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px', textAlign: 'center' }}>
                    <h3 style={{ marginTop: 0 }}>Your Referral Link</h3>
                    <p style={{ color: '#666' }}>Share this link to earn 10% commission on every sale.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                        <input
                            readOnly
                            value={referralLink}
                            style={{ padding: '10px', width: '300px', border: '1px solid #ddd', borderRadius: '4px', background: '#fafafa' }}
                        />
                        <button onClick={copyLink} style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}>Copy Link</button>
                    </div>
                </div>

                {/* Commissions Table */}
                <h3 style={{ color: '#333' }}>Recent Commissions</h3>
                <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                                <th style={thStyle}>Order ID</th>
                                <th style={thStyle}>Subtotal</th>
                                <th style={thStyle}>Commission</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commissions.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No commissions yet.</td></tr>
                            ) : (
                                commissions.map(comm => (
                                    <tr key={comm._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={tdStyle}>{comm.orderId}</td>
                                        <td style={tdStyle}>INR {comm.orderSubtotal}</td>
                                        <td style={tdStyle}>INR {comm.commissionAmount}</td>
                                        <td style={{ ...tdStyle, color: comm.status === 'paid' ? 'green' : (comm.status === 'cancelled' ? 'red' : 'orange') }}>
                                            {comm.status.toUpperCase()}
                                        </td>
                                        <td style={tdStyle}>{new Date(comm.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

// Styles
const cardStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    textAlign: 'center'
};

const cardInternalTitle = {
    margin: '0 0 10px 0',
    color: '#888',
    fontSize: '14px',
    textTransform: 'uppercase'
};

const cardValue = {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333'
};

const thStyle = {
    padding: '15px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555'
};

const tdStyle = {
    padding: '15px',
    fontSize: '14px',
    color: '#333'
};

export default AffiliateDashboard;
