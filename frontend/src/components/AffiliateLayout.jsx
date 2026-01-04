import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import AdminStyles from './AdminStyles'; // Reuse premium styles
import Logo from '../assets/logo.png';

const Icons = {
    Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
};

const AffiliateLayout = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login-affiliate');
    };

    return (
        <div className="admin-layout">
            <AdminStyles />

            <aside className="admin-sidebar" style={{ background: 'linear-gradient(180deg, #111827 0%, #000000 100%)' }}>
                <div className="sb-brand-container">
                    <img src={Logo} alt="Copperaa" className="sb-logo" />
                </div>
                <nav className="sb-nav">
                    <li className="sb-item">
                        <NavLink to="/affiliate/dashboard" end className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
                            <span className="sb-icon"><Icons.Home /></span> Overview
                        </NavLink>
                    </li>
                    <li className="sb-item">
                        <NavLink to="/affiliate/settings" className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
                            <span className="sb-icon"><Icons.Settings /></span> Settings
                        </NavLink>
                    </li>
                    <li className="sb-item" style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                        <button onClick={handleLogout} className="sb-link" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                            <span className="sb-icon"><Icons.Logout /></span> Logout
                        </button>
                    </li>
                </nav>
            </aside>
            <main className="admin-main">
                {/* Desktop Header */}
                <div className="admin-topbar">
                    <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700, color: '#111827' }}>Affiliate Dashboard</h2>

                    {/* User Profile Dropdown / Area */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '50px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1F2937' }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Code: {user.affiliateCode}</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #B87333 0%, #A8652A 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
                <Outlet />
            </main>
        </div>
    );
};

export default AffiliateLayout;
