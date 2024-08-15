import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import Cookies from 'js-cookie'; 
import logo from '../images/logo.png'; 

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

            // Save the role in a cookie
            Cookies.set('user_role', role, { expires: 7 }); // Expires in 7 days

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
        <div className="login-background container-fluid bg-dark text-light vh-100 d-flex align-items-center justify-content-center">
            <div className="card bg-secondary p-4 p-md-5 shadow-lg rounded">
                <div className="text-center mb-4">
                <img src={logo} alt="Logo" className="mb-3" style={{ maxWidth: '150px' }} />
                <h2 className="text-light">Login</h2>
                </div>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control bg-dark border-light text-light input-form"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ color: 'white' }} 
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control bg-dark border-light text-light input-form"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ color: 'white' }} 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
