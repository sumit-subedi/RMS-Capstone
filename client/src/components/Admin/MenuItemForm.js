import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const MenuItemForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState({
        name: '',
        price: '',
        category: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchMenuItem();
        }
    }, [id]);

    const fetchMenuItem = async () => {
        try {
            const response = await axiosInstance.get(`admin/menu-items/${id}`);
            setItem(response.data);
        } catch (error) {
            console.error('Error fetching menu item:', error);
        }
    };

    const handleChange = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await axiosInstance.put(`admin/menu-items/${id}`, item);
            } else {
                await axiosInstance.post('admin/menu-items', item);
            }
            setLoading(false);
            navigate('/admin/menu-items');
        } catch (error) {
            setLoading(false);
            console.error('Error saving menu item:', error);
        }
    };

    return (
        <div className="container py-4">
            <div className="card bg-dark text-light shadow">
                <div className="card-header bg-dark text-white">
                    <h2 className="mb-0">{id ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-light">Name</label>
                            <input type="text" className="form-control bg-dark text-light" name="name" value={item.name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-light">Price</label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-light">$</span>
                                <input type="number" className="form-control bg-dark text-light" name="price" value={item.price} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-light">Category</label>
                            <select className="form-select bg-dark text-light" name="category" value={item.category} onChange={handleChange} required>
                                <option value="">Select category...</option>
                                <option value="Appetizer">Appetizer</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Beverage">Beverage</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-light">Description</label>
                            <textarea className="form-control bg-dark text-light" name="description" value={item.description} onChange={handleChange}></textarea>
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className={`btn btn-secondary bg-dark text-light ${loading ? 'disabled' : ''}`} disabled={loading}>{loading ? 'Saving...' : (id ? 'Update' : 'Add')}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/menu-items')}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MenuItemForm;
