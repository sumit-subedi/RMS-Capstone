import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import Navbar from '../Navbar'; 
import './styles.css'; 

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axiosInstance.get('waiter/menu_items');
            setMenuItems(response.data);
            setError(''); // Clear any previous errors
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 200 range
                setError(`Error: ${error.response.status} ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                // Request was made but no response was received
                setError('Error: No response from server. Please try again later.');
            } else {
                // Something else happened while setting up the request
                setError(`Error: ${error.message}`);
            }
            console.error('Error fetching menu items:', error);
        }
    };

    return (
        <div className="bg-dark d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container py-4 flex-grow-1">
                <h2 className="mb-4 text-light text-center">Menu Items</h2>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                {Object.keys(menuItems).map(category => (
                    <div key={category} className="mb-5">
                        <h3 className="text-light mb-3">{category}</h3>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {menuItems[category].map(item => (
                                <div key={item.item_id} className="col">
                                    <div className="card shadow-sm h-100 menu-card">
                                        <div className="card-body d-flex flex-column text-light">
                                            <h5 className="card-title">{item.name}</h5>
                                            <p className="card-text flex-grow-1">{item.description}</p>
                                            <p className="card-text"><strong>Price:</strong> ${item.price}</p>
                                            <p className="card-text"><strong>Availability:</strong> {item.is_available ? 'Available' : 'Not Available'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuPage;
