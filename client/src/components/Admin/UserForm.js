// src/components/Admin/UserForm.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: '',
        email: '',
        full_name: '',
        role: 'waiter',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get(`admin/users/${id}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await axiosInstance.put(`admin/users/${id}`, user);
            } else {
                await axiosInstance.post('admin/users', user);
            }
            setLoading(false);
            navigate('/admin/users');
        } catch (error) {
            setLoading(false);
            console.error('Error saving user:', error);
        }
    };

    return (
        <div className="container py-4">
            <div className="card bg-dark text-light shadow">
                <div className="card-header bg-dark text-white">
                    <h2 className="mb-0">{id ? 'Edit User' : 'Add User'}</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-light">Username</label>
                            <input type="text" className="form-control bg-dark text-light" name="username" value={user.username} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-light">Email</label>
                            <input type="email" className="form-control bg-dark text-light" name="email" value={user.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-light">Full Name</label>
                            <input type="text" className="form-control bg-dark text-light" name="full_name" value={user.full_name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-light">Role</label>
                            <select className="form-select bg-dark text-light" name="role" value={user.role} onChange={handleChange} required>
                                
                                <option value="waiter">Waiter</option>
                                <option value="receptionist">Receptionist</option>
                                <option value="admin">Admin</option>

                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-light">Password</label>
                            <input type="password" className="form-control bg-dark text-light" name="password" value={user.password} onChange={handleChange} required={!id} placeholder={id ? "Leave blank to keep current password" : ""} />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className={`btn btn-secondary bg-dark text-light ${loading ? 'disabled' : ''}`} disabled={loading}>{loading ? 'Saving...' : (id ? 'Update' : 'Add')}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
