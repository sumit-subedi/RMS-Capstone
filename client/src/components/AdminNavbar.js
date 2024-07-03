import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminNavbar = () => {
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="d-md-none">
                <Navbar.Brand href="/">Admin Panel</Navbar.Brand>
                <Navbar.Toggle aria-controls="offcanvasNavbar" />
                <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="start"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel">Admin Panel</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">
                                    Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/sales">
                                    Sales
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/inventory">
                                    Inventory
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/orders">
                                    Orders
                                </Link>
                            </li>
                            {/* Add more links as needed */}
                        </ul>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Navbar>

            <nav id="sidebar" className="col-md-3 col-lg-2 d-none d-md-block bg-dark sidebar border-end border-white p-3">
                <div className="position-sticky p-3">
                    <div className="mb-3 text-center">
                        <img src="../../logo.png" alt="Logo" className="img-fluid mb-2" />
                        <h4 className="text-white">Admin Panel</h4>
                        <hr className="border-white" />
                    </div>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/sales">
                                Sales
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/inventory">
                                Inventory
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/orders">
                                Orders
                            </Link>
                        </li>
                        {/* Add more links as needed */}
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default AdminNavbar;
