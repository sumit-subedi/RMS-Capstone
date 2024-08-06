import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ReceptionistPage from './pages/ReceptionistPage';
import WaiterPage from './pages/WaiterPage';
import TableDetailsPage from './components/Waiter/TableDetailsPage';
import MenuPage from './components/Waiter/MenuPage';
import BillingPage from './components/Receptionist/BillingPage';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(Cookies.get('user_role'));

    useEffect(() => {
        // Update role from cookies whenever the component mounts
        setRole(Cookies.get('user_role'));
    }, []);

    const renderPageBasedOnRole = () => {
        if (!token) {
            return <Navigate to="/login" />;
        }

        switch (role) {
            case 'admin':
                return <Navigate to="/admin" />;
            case 'receptionist':
                return <Navigate to="/reception" />;
            case 'waiter':
                return <Navigate to="/waiter" />;
            default:
                return <Navigate to="/login" />;
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage setToken={setToken} setRole={setRole} />} />
                <Route path="/admin/*" element={<AdminPage />} />
                <Route path="/reception" element={<ReceptionistPage />} />
                <Route path="/waiter" element={<WaiterPage />} />
                <Route path="/" element={renderPageBasedOnRole()} />
                <Route path="/tables/:tableId" element={<TableDetailsPage />} />
                <Route path="/waiter/menu" element={<MenuPage />} />
                <Route path="/reception/billing/:tableId" element={<BillingPage />} />
            </Routes>
        </Router>
    );
};

export default App;
