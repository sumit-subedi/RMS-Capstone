import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const TableForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [table, setTable] = useState({
        table_identifier: '',
        seats: '',
        status: 'available'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTable();
        }
    }, [id]);

    const fetchTable = async () => {
        try {
            const response = await axiosInstance.get(`admin/tables/${id}`);
            setTable(response.data);
        } catch (error) {
            console.error('Error fetching table:', error);
        }
    };

    const handleChange = (e) => {
        setTable({ ...table, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await axiosInstance.put(`admin/tables/${id}`, table);
            } else {
                await axiosInstance.post('admin/tables', table);
            }
            setLoading(false);
            navigate('/admin/tables');
        } catch (error) {
            setLoading(false);
            console.error('Error saving table:', error);
        }
    };

    return (
        <div className="container py-4">
            <div className="card bg-dark text-light shadow">
                <div className="card-header bg-dark text-white">
                    <h2 className="mb-0">{id ? 'Edit Table' : 'Add Table'}</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-light">Table Identifier</label>
                            <input type="text" className="form-control bg-dark text-light" name="table_identifier" value={table.table_identifier} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-light">Seats</label>
                            <input type="number" className="form-control bg-dark text-light" name="seats" value={table.seats} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-light">Status</label>
                            <select className="form-select bg-dark text-light" name="status" value={table.status} onChange={handleChange} required>
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="reserved">Reserved</option>
                            </select>
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className={`btn btn-secondary bg-dark text-light ${loading ? 'disabled' : ''}`} disabled={loading}>{loading ? 'Saving...' : (id ? 'Update' : 'Add')}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/tables')}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TableForm;
