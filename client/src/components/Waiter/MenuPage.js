import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import Navbar from '../Navbar'; 

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState({});

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axiosInstance.get('waiter/menu_items');
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    return (
        <div className="bg-dark d-flex flex-column">
            <Navbar /> {/* Include the Navbar component */}
            <div className="container py-4 flex-grow-1">
                <h2 className="mb-4 text-light">Menu Items</h2>
                {Object.keys(menuItems).map(category => (
                    <div key={category} className="mb-4 ">
                        <h3 className="text-light">{category}</h3>
                        <div className="row row-cols-1 row-cols-md-2 g-3">
                            {menuItems[category].map(item => (
                                <div key={item.item_id} className="col">
                                    <div className="card shadow-sm bg-secondary h-100">
                                        <div className="card-body text-light">
                                            <h5 className="card-title">{item.name}</h5>
                                            <p className="card-text">{item.description}</p>
                                            <p className="card-text">Price: ${item.price}</p>
                                            <p className="card-text">Availability: {item.is_available ? 'Available' : 'Not Available'}</p>
                                            {/* Add hover effect for detailed view */}
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
