import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import DashboardStyles from '../components/DashboardStyles';
import logo from '../assets/logo.png'; // Make sure file exists

const AffiliateLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await authService.login(formData);
            if (user.role === 'affiliate') {
                navigate('/affiliate/dashboard');
            } else if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                setError('Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <>
            <DashboardStyles />
            <div className="auth-container">
                <div className="auth-card">
                    <img src={logo} alt="Copperaa" className="auth-logo" />

                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Login to track your commissions</p>

                    {error && <div style={{ background: '#FECACA', color: '#991B1B', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                            Login
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an affiliate account? <Link to="/register" className="auth-link">Join Now</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AffiliateLogin;
