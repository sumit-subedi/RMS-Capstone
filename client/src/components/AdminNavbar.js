import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear token from local storage
        localStorage.removeItem('token');
        
        // Redirect to login page
        navigate('/login');
    };

    return (
        <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar vh-100">
            <div className="position-sticky p-3">
                <div className="text-center mb-3">
                    <img src="../../logo.png" alt="Logo" className="img-fluid mb-2" />
                    <h4 className="text-white">Admin Panel</h4>
                    <hr className="border-white" />
                </div>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/admin">
                            Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/admin/menu-items">
                            Menu Items
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/admin/tables">
                            Tables
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/admin/users">
                            Users
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/admin/orders">
                            Orders
                        </Link>
                    </li>
                    <li className="nav-item">
                        <button className="btn btn-link nav-link text-white" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default AdminNavbar;
