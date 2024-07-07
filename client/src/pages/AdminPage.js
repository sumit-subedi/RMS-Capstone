import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddminNavbar from '../components/AdminNavbar';
import AdminDashboard from '../components/Admin/AdminDashboard';
import MenuList from '../components/Admin/MenuList';
import MenuItemForm from '../components/Admin/MenuItemForm';
import TableList from '../components/Admin/TableList';
import TableForm from '../components/Admin/TableForm';

const AdminPage = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <AddminNavbar />
                <main className="col-md-9 ms-sm-auto col-lg-10 bg-dark px-md-4">
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/menu-items" element={<MenuList />} />
                        <Route path="/menu-items/new" element={<MenuItemForm />} />
                        <Route path="/menu-items/:id/edit" element={<MenuItemForm />} />
                        <Route path="/tables" element={<TableList />} />
                        <Route path="/tables/new" element={<TableForm />} />
                        <Route path="/tables/:id/edit" element={<TableForm />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
