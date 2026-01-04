import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Affiliates = () => {
    const [affiliates, setAffiliates] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAffiliates = async () => {
        try {
            const res = await api.get('/admin/affiliates');
            setAffiliates(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAffiliates();
    }, []);

    const handleApprove = async (id) => {
        if (window.confirm('Approve this affiliate?')) {
            try {
                await api.patch(`/admin/affiliates/${id}/approve`);
                fetchAffiliates();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleDisable = async (id) => {
        if (window.confirm('Disable this affiliate?')) {
            try {
                await api.patch(`/admin/affiliates/${id}/disable`);
                fetchAffiliates();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleCommission = async (id, currentRate) => {
        const rate = prompt('Enter new commission rate (0-100):', currentRate);
        if (rate !== null) {
            try {
                await api.patch(`/admin/affiliates/${id}/commission`, { commissionRate: Number(rate) });
                fetchAffiliates();
            } catch (err) {
                alert('Failed update');
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Affiliates Management</h2>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Code</th>
                        <th>Status</th>
                        <th>Rate</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {affiliates.map((aff) => (
                        <tr key={aff._id}>
                            <td>{aff.name}</td>
                            <td>{aff.email}</td>
                            <td>{aff.affiliateCode}</td>
                            <td>{aff.approved ? 'Approved' : 'Pending/Disabled'}</td>
                            <td>{aff.commissionRate}%</td>
                            <td>
                                {!aff.approved && (
                                    <button onClick={() => handleApprove(aff._id)}>Approve</button>
                                )}
                                {aff.approved && (
                                    <button onClick={() => handleDisable(aff._id)}>Disable</button>
                                )}
                                {' '}
                                <button onClick={() => handleCommission(aff._id, aff.commissionRate)}>Set Rate</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Affiliates;
