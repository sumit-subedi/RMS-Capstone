import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { Link } from 'react-router-dom';

const TableList = () => {
    const [tables, setTables] = useState([]);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await axiosInstance.get('admin/tables');
            setTables(response.data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`admin/tables/${id}`);
            fetchTables(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting table:', error);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-light">Tables</h2>
            <div className="row row-cols-1 row-cols-md-2 g-3">
                {tables.map(table => (
                    <div key={table.table_id} className="col">
                        <div className="card shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                                <h5 className="card-title">{table.table_identifier}</h5>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className={`badge ${getStatusBadgeClass(table.status)}`}>{table.status}</span>
                                        <span className="badge bg-secondary ms-2">Seats: {table.seats}</span>

                                    </div>
                                    <div>
                                        <Link to={`/admin/tables/${table.table_id}/edit`} className="btn btn-warning me-2">Edit</Link>
                                        <button onClick={() => handleDelete(table.table_id)} className="btn btn-danger">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-4">
                <Link to="/admin/tables/new" className="btn btn-primary">Add New Table</Link>
            </div>
        </div>
    );
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'available':
            return 'bg-success';
        case 'occupied':
            return 'bg-warning text-dark';
        case 'reserved':
            return 'bg-info';
        default:
            return 'bg-secondary';
    }
};

export default TableList;
