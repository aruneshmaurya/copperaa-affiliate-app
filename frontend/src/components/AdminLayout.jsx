import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth.service';
import AdminStyles from './AdminStyles';
import Logo from '../assets/logo.png'; // Import Logo

// Simple Icons
const Icons = {
    Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Dollar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
    Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
};

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        authService.logout();
        navigate('/login-affiliate');
    };

    const getPageTitle = () => {
        if (location.pathname.includes('affiliates')) return 'Affiliate Management';
        if (location.pathname.includes('commissions')) return 'Commission & Payouts';
        return 'Dashboard Overview';
    };

    return (
        <div className="admin-layout">
            <AdminStyles />

            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sb-brand-container">
                    <img src={Logo} alt="Copperaa" className="sb-logo" />
                </div>
                <nav className="sb-nav">
                    <li className="sb-item">
                        <NavLink to="/admin/dashboard" className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
                            <span className="sb-icon"><Icons.Dashboard /></span> Dashboard
                        </NavLink>
                    </li>
                    <li className="sb-item">
                        <NavLink to="/admin/affiliates" className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
                            <span className="sb-icon"><Icons.Users /></span> Affiliates
                        </NavLink>
                    </li>
                    <li className="sb-item">
                        <NavLink to="/admin/commissions" className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
                            <span className="sb-icon"><Icons.Dollar /></span> Commissions
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
                {/* Topbar */}
                <div className="admin-topbar">
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>{getPageTitle()}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '50px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1F2937' }}>Administrator</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', background: '#374151', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            AD
                        </div>
                    </div>
                </div>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
