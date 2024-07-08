import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { Link } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('admin/users');
            console.log(response);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`admin/users/${id}`);
            fetchUsers(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-light">User List</h2>
            <div className="row row-cols-1 row-cols-md-2 g-3">
                {users.map(user => (
                    <div key={user.user_id} className="col">
                        <div className={`card shadow-sm h-100 ${user.is_active ? 'bg-light' : 'bg-secondary text-light'}`}>
                            <div className="card-body d-flex flex-column justify-content-between">
                                <h5 className="card-title">{user.username}</h5>
                                <p className="card-text">{user.email}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className={`badge ${user.is_active ? 'bg-primary' : 'bg-dark'}`}>{user.role}</span>
                                    </div>
                                    <div>
                                        <Link to={`/admin/users/${user.user_id}/edit`} className="btn btn-warning me-2">Edit</Link>
                                        {user.is_active ? (
                                            <button onClick={() => handleDelete(user.user_id)} className="btn btn-danger">Delete</button>
                                        ) : (
                                            <button className="btn btn-danger" disabled>Delete</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-4">
                <Link to="/admin/users/new" className="btn btn-primary">Add New User</Link>
            </div>
        </div>
    );
};

export default UserList;
