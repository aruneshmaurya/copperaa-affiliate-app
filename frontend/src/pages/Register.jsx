import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import DashboardStyles from '../components/DashboardStyles';
import logo from '../assets/logo.png';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData);
            console.log('Registration Success');
            setMsg('Registration successful! You can now log in.');
            setError('');
            setTimeout(() => navigate('/login-affiliate'), 2000);
        } catch (err) {
            console.error('Registration Error:', err);
            const detailedError = err.response?.data?.message || err.message || JSON.stringify(err);
            setError(detailedError);
            setMsg('');
        }
    };

    return (
        <>
            <DashboardStyles />
            <div className="auth-container">
                <div className="auth-card">
                    <img src={logo} alt="Copperaa" className="auth-logo" />

                    <h2 className="auth-title">Join the Program</h2>
                    <p className="auth-subtitle">Become a partner and earn today</p>

                    {msg && <div style={{ background: '#D1FAE5', color: '#065F46', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{msg}</div>}
                    {error && <div style={{ background: '#FECACA', color: '#991B1B', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="email"
                                name="email"
                                placeholder="Email Address"
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
                                onChange={onChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                            Create Account
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login-affiliate" className="auth-link">Login here</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
