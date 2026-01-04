import React, { useState } from 'react';
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate('/login-affiliate');
    };

    return (
        <div className="admin-layout">
            <AdminStyles />

            {/* Mobile Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} style={{ background: 'linear-gradient(180deg, #2D3748 0%, #1A202C 100%)' }}>
                <div className="sb-brand-container">
                    <img src={Logo} alt="Copperaa" className="sb-logo" />
                </div>
                <nav className="sb-nav">
                    <li className="sb-item">
                        <NavLink
                            to="/affiliate/dashboard"
                            end
                            className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sb-icon"><Icons.Home /></span> Overview
                        </NavLink>
                    </li>
                    <li className="sb-item">
                        <NavLink
                            to="/affiliate/settings"
                            className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
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
                {/* Mobile Header */}
                <div className="admin-topbar" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                    <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    {/* Only show title on mobile since sidebar is hidden */}
                    <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>Affiliate Panel</h2>
                </div>
                <Outlet />
            </main>
        </div>
    );
};

export default AffiliateLayout;
