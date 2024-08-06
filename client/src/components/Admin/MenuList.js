import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { Link } from 'react-router-dom';

const MenuList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axiosInstance.get('admin/menu-items');
            setMenuItems(response.data);
            setErrorMessage('');
        } catch (error) {
            handleError(error, 'Error fetching menu items');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            try {
                await axiosInstance.delete(`admin/menu-items/${id}`);
                fetchMenuItems(); // Refresh the list after deletion
                setErrorMessage('');
            } catch (error) {
                handleError(error, 'Error deleting menu item');
            }
        }
    };

    const handleError = (error, defaultMessage) => {
        if (error.response) {
            setErrorMessage(`Error: ${error.response.status} ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
            setErrorMessage('Error: No response from server. Please try again later.');
        } else {
            setErrorMessage(`Error: ${error.message}`);
        }
        console.error(defaultMessage, error);
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-light">Menu Items</h2>
            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
            <div className="row row-cols-1 row-cols-md-2 g-3">
                {menuItems.map(item => (
                    <div key={item.item_id} className="col">
                        <div className="card bg-dark text-light shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.description}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="badge bg-info">{item.category}</span>
                                    <div>
                                        <Link to={`/admin/menu-items/${item.item_id}/edit`} className="btn btn-warning me-2">Edit</Link>
                                        <button onClick={() => handleDelete(item.item_id)} className="btn btn-danger">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-4">
                <Link to="/admin/menu-items/new" className="btn btn-success">Add New Item</Link>
            </div>
        </div>
    );
};

export default MenuList;
