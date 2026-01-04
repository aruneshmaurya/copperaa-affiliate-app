import AffiliateLayout from './components/AffiliateLayout';
import AffiliateSettings from './pages/AffiliateSettings';

// ...

{/* Affiliate Routes */ }
<Route element={<ProtectedRoute role="affiliate" />}>
    <Route path="/affiliate" element={<AffiliateLayout />}>
        <Route path="dashboard" element={<AffiliateDashboard />} />
        <Route path="settings" element={<AffiliateSettings />} />
        <Route index element={<Navigate to="dashboard" />} />
    </Route>
</Route>

{/* Admin Routes */ }
                <Route element={<ProtectedRoute role="admin" />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="affiliates" element={<Affiliates />} />
                        <Route path="commissions" element={<Commissions />} />
                        <Route index element={<Navigate to="dashboard" />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login-affiliate" />} />
            </Routes >
        </Router >
    );
}

export default App;
