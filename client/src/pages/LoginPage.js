import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

const LoginPage = ({ setToken, setRole }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { token, role } = await login(username, password);
            console.log(token, role);
            localStorage.setItem('token', token);

            setToken(token);
            setRole(role);

            // Navigate to the appropriate page based on role
            if (role === 'waiter') {
                navigate('/waiter');
            } else if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'receptionist') {
                navigate('/reception');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container-fluid bg-dark text-light vh-100 d-flex align-items-center justify-content-center">
            <div className="card bg-secondary p-5">
                <h2 className="text-center text-muted mb-4">Login</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control bg-secondary border-light text-light"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control bg-secondary border-light text-light"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
