import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ReceptionistPage = () => {
    const [occupiedTables, setOccupiedTables] = useState([]);
    const [error, setError] = useState('');
    const [hoveredTableId, setHoveredTableId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch occupied tables from the server
        const fetchOccupiedTables = async () => {
            try {
                const response = await axiosInstance.get('/reception/occupied_tables');
                setOccupiedTables(response.data);
                console.log(response.data);
            } catch (error) {
                setError('Error fetching occupied tables:', error);
            }
        };

        fetchOccupiedTables();
    }, []);

    const handleTableClick = (tableId) => {
        navigate(`billing/${tableId}`);
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
        <div className="receptionist container-fluid bg-light text-dark vh-100">
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-center mb-4">Welcome to the Reception</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <div className="row justify-content-center">
                    {occupiedTables.map(table => (
                        <div
                            key={table.table_id}
                            className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
                            onMouseEnter={() => setHoveredTableId(table.table_id)}
                            onMouseLeave={() => setHoveredTableId(null)}
                        >
                            <div
                                className={`card table-card ${getTableColor(table.status)}`}
                                onClick={() => handleTableClick(table.table_id)}
                            >
                                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                    <h5 className="card-title">Table {table.table_number}</h5>
                                    <p className="card-text">Capacity: {table.capacity}</p>
                                </div>
                            </div>
                            {hoveredTableId === table.table_id && (
                                <div className="hover-bubble">
                                    {table.orders.map(order => (
                                        <div key={order.active_order_id}>
                                            <h6>Order ID: {order.active_order_id}</h6>
                                            <p>Status: {order.status}</p>
                                            <ul className="list-unstyled">
                                                {order.items.map((item, index) => (
                                                    <li key={index}>
                                                        {item.name} - {item.quantity} pc - ${item.price.toFixed(2)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReceptionistPage;
