import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const WaiterPage = () => {
    const [tables, setTables] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch table data from the server
        const fetchTables = async () => {
            try {
                const response = await axiosInstance.get('/waiter/tables');
                console.log(response.data);
                setTables(response.data);
            } catch (error) {
                handleFetchError(error);
            }
        };

        fetchTables();
    }, []);

    const handleFetchError = (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            switch (error.response.status) {
                case 500:
                    setError('Server error. Please try again later.');
                    break;
                case 404:
                    setError('Data not found. Please check the endpoint.');
                    break;
                case 403:
                    setError('Access forbidden. Please check your permissions.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
                    break;
            }
        } else if (error.request) {
            // The request was made but no response was received
            setError('Network error. Please check your connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            setError('An error occurred. Please try again.');
        }
        console.error('Error fetching table data:', error);
    };

    const handleTableClick = (tableId) => {
        navigate(`/tables/${tableId}`);
    };

    const getTableColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-success text-white';
            case 'occupied':
                return 'bg-danger text-white';
            case 'reserved':
                return 'bg-warning text-dark';
            default:
                return '';
        }
    };

    return (
        <div className="container-fluid bg-dark text-light vh-100">
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-center mb-4">Table Status</h2>
                {error && (
                    <div className="alert alert-danger text-center" role="alert">
                        {error}
                    </div>
                )}
                <div className="row justify-content-center">
                    {tables.map(table => (
                        <div key={table.id} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                            <div
                                className={`card table-card ${getTableColor(table.status)}`}
                                onClick={() => handleTableClick(table.id)}
                            >
                                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                    <h5 className="card-title">Table {table.table_number}</h5>
                                    <p className="card-text">Capacity: {table.capacity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WaiterPage;
