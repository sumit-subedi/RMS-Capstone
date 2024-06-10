import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import Navbar from '../Navbar';

const TableDetailsPage = () => {
    const { tableId } = useParams();
    const [items, setItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState([]);

    useEffect(() => {
        // Fetch items ordered for the selected table
        const fetchItems = async () => {
            try {
                const response = await axiosInstance.get(`/waiter/orders/${tableId}`);
                console.log(response.data);
                setItems(response.data.itemsArray);
                setTotalAmount(response.data.totalAmount);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, [tableId]);

    const handleCancelOrder = () => {
        // Implement logic to cancel orders
    };

    const handleAddItem = () => {
        // Implement logic to add items
    };
    <Navbar />
    return (
       
        <div className=" bg-dark vh-100">
            <h2 className="mb-4 p-4 text-light">Table {tableId} Details</h2>
            <ul className="list-group mb-4">
                {items.map(item => (
                    <li key={item.item_id} className="list-group-item d-flex justify-content-between p-4 m-3 align-items-center">
                        <div className="me-auto">
            <span>{item.name}</span><br />
        </div>
        <div>
        <span className="badge bg-primary rounded-pill">{item.quantity}</span>
<br></br>
            <span className="badge bg-secondary rounded-pill">$ {item.price}</span>
        </div>
                    </li>
                ))}
            </ul>
            <div className="fixed-bottom bg-light p-3 d-flex justify-content-between align-items-center">
                <div>Total Amount: {totalAmount}</div>
                <div>
                    <button onClick={handleCancelOrder} className="btn btn-danger me-2">Cancel Order</button>
                    <button onClick={handleAddItem} className="btn btn-primary">Add Item</button>
                </div>
            </div>
        </div>
    );
};

export default TableDetailsPage;
