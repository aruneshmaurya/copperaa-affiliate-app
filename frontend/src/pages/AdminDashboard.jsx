import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalAffiliates: 0,
        activeAffiliates: 0,
        pendingPayoutAffiliates: 0,
        totalSales: 0,
        totalCommission: 0,
        pendingCommission: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data
                const [affRes, commRes] = await Promise.all([
                    api.get('/admin/affiliates'),
                    api.get('/admin/commissions')
                ]);

                const affiliates = affRes.data;
                const commissions = commRes.data;

                // Calculate Stats
                const totalAffiliates = affiliates.length;
                const activeAffiliates = affiliates.filter(a => a.approved).length;

                // Calculate Payout Stats
                let totalSales = 0;
                let totalCommission = 0;
                let pendingCommission = 0;
                let pendingAffiliatesSet = new Set();

                commissions.forEach(c => {
                    const amount = Number(c.commissionAmount);
                    // Only count valid sales (not reversed)
                    if (c.status !== 'reversed' && c.status !== 'cancelled') {
                        totalSales += Number(c.orderSubtotal);
                        totalCommission += amount;
                    }

                    // Pending Payouts (Approved but not Paid + Pending)
                    if (c.status === 'pending' || c.status === 'approved' || c.status === 'unpaid') {
                        pendingCommission += amount;
                        if (c.affiliate) pendingAffiliatesSet.add(c.affiliate._id);
                    }
                });

                setStats({
                    totalAffiliates,
                    activeAffiliates,
                    pendingPayoutAffiliates: pendingAffiliatesSet.size,
                    totalSales: totalSales.toFixed(2),
                    totalCommission: totalCommission.toFixed(2),
                    pendingCommission: pendingCommission.toFixed(2)
                });

                setLoading(false);
            } catch (err) {
                console.error("Error loading dashboard stats", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-4">Loading stats...</div>;

    const StatCard = ({ label, value, colorClass, icon }) => (
        <div className="card">
            <div className="stat-label">{label}</div>
            <div className={`stat-val ${colorClass || ''}`}>{value}</div>
        </div>
    );

    return (
        <div>
            {/* KPI Grid */}
            <div className="stat-grid">
                <StatCard label="Total Affiliates" value={stats.totalAffiliates} />
                <StatCard label="Active Affiliates" value={stats.activeAffiliates} colorClass="text-green-600" />
                <StatCard label="Total Sales Value" value={`$${stats.totalSales}`} />
                <StatCard label="Total Commission" value={`$${stats.totalCommission}`} />
                <div className="card" style={{ borderLeft: '4px solid #F59E0B' }}>
                    <div className="stat-label">Pending Payouts</div>
                    <div className="stat-val" style={{ color: '#F59E0B' }}>${stats.pendingCommission}</div>
                    <small style={{ color: '#6B7280' }}>Across {stats.pendingPayoutAffiliates} affiliates</small>
                </div>
            </div>

            {/* Charts Placeholder */}
            <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', borderStyle: 'dashed' }}>
                <p style={{ color: '#9CA3AF' }}>Sales Chart Visualization (Coming Soon)</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
