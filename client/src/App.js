import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ReceptionistPage from './pages/ReceptionistPage';
import WaiterPage from './pages/WaiterPage';
import TableDetailsPage from './components/Waiter/TableDetailsPage';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    const renderPageBasedOnRole = () => {
        if (!token) {
            return <Navigate to="/login" />;
        }

        switch (role) {
            case 'admin':
                return <AdminPage />;
            case 'receptionist':
                return <ReceptionistPage />;
            case 'waiter':
                return <WaiterPage />;
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
            </Routes>
        </Router>
    );
};

export default App;
