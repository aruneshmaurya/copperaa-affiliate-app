import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <div style={{ width: '250px', background: '#333', color: '#fff', padding: '20px' }}>
                <h3>Copperaa Admin</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ margin: '15px 0' }}><Link to="/admin/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link></li>
                    <li style={{ margin: '15px 0' }}><Link to="/admin/affiliates" style={{ color: '#fff', textDecoration: 'none' }}>Affiliates</Link></li>
                    <li style={{ margin: '15px 0' }}><Link to="/admin/commissions" style={{ color: '#fff', textDecoration: 'none' }}>Commissions</Link></li>
                    <li style={{ margin: '15px 0', cursor: 'pointer', color: '#ffaaaa' }} onClick={handleLogout}>Logout</li>
                </ul>
            </div>
            <div style={{ flex: 1, padding: '20px', background: '#f4f4f4' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Sidebar;
