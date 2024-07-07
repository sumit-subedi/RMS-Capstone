import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { Link } from 'react-router-dom';

const MenuList = () => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axiosInstance.get('admin/menu-items');
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`admin/menu-items/${id}`);
            fetchMenuItems(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-light">Menu Items</h2>
            <div className="row row-cols-1 row-cols-md-2 g-3">
                {menuItems.map(item => (
                    <div key={item.item_id} className="col">
                        <div className="card shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                                <h5 className="card-title">{item.name}</h5>
                                <p className="card-text">{item.description}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="badge bg-primary">{item.category}</span>
                                    </div>
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
                <Link to="/admin/menu-items/new" className="btn btn-primary">Add New Item</Link>
            </div>
        </div>
    );
};

export default MenuList;
