import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Affiliates from './pages/Affiliates';
import Commissions from './pages/Commissions';
// import Sidebar from './components/Sidebar'; // Legacy
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AffiliateLogin from './pages/AffiliateLogin';
import AffiliateDashboard from './pages/AffiliateDashboard';
import Register from './pages/Register';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login-affiliate" element={<AffiliateLogin />} />
                <Route path="/register" element={<Register />} />

                {/* Affiliate Routes */}
                <Route element={<ProtectedRoute role="affiliate" />}>
                    <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute role="admin" />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="affiliates" element={<Affiliates />} />
                        <Route path="commissions" element={<Commissions />} />
                        <Route index element={<Navigate to="dashboard" />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login-affiliate" />} />
            </Routes>
        </Router>
    );
}

export default App;
