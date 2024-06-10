import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    const navigate = useNavigate();


    const handleLogout = () => {
        // Clear token from local storage
        localStorage.removeItem('token');
        
        // Redirect to home page
        navigate('/');

    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Waiter Portal</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/waiter">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/waiter/tables">Tables</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/waiter/orders">Orders</Link>
                        </li>
                        <li className="nav-item">
                        <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
