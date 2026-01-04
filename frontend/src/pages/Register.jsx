import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';

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
            setMsg('Registration successful! Please wait for admin approval.');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error registering');
            setMsg('');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Affiliate Register</h2>
            {msg && <p style={{ color: 'green' }}>{msg}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input type="text" name="name" placeholder="Full Name" onChange={onChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input type="email" name="email" placeholder="Email" onChange={onChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input type="password" name="password" placeholder="Password" onChange={onChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#333', color: '#fff' }}>Register</button>
            </form>
            <p style={{ marginTop: '10px' }}><Link to="/login-affiliate">Login here</Link></p>
        </div>
    );
};

export default Register;
