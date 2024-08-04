// src/pages/OrderDetails.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
    const { id } = useParams(); // Get order ID from URL parameters
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axiosInstance.get(`admin/order/${id}`);
                setOrder(response.data.order);
                setItems(response.data.items);
            } catch (error) {
                setError('Error fetching order details');
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [id]);

    if (error) {
        return <div className="container py-4 text-light">{error}</div>;
    }

    // Calculate the total item amount
    const calculateTotalItemAmount = () => {
        return items.reduce((acc, item) => acc + (item.price_at_order * item.quantity), 0);
    };

    // Calculate total amount considering the discount and tax
    const totalItemAmount = calculateTotalItemAmount();
    const totalAmount = totalItemAmount + (order.tax || 0) - (order.discount || 0);

    return (
        <div className="container py-4 text-light">
            <h2 className="mb-4">Order Details</h2>
            {order && (
                <div>
                    <h4>Order ID: {order.order_id}</h4>
                    <p><strong>User Name:</strong> {order.user_name}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Total Amount:</strong> ${totalItemAmount.toFixed(2)}</p>
                    <p><strong>Discount:</strong> ${order.discount ? order.discount.toFixed(2) : '0.00'}</p>
                    <p><strong>Tax:</strong> ${order.tax ? order.tax.toFixed(2) : '0.00'}</p>
                    <p><strong>Table Identifier:</strong> {order.table_identifier}</p>
                    <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>

                    <h4 className="mt-4">Order Items</h4>
                    <table className="table table-striped table-hover text-light">
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.order_item_id}>
                                    <td>{item.order_item_id}</td>
                                    <td>{item.item_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price_at_order.toFixed(2)}</td>
                                    <td>${(item.price_at_order * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 text-end">
                        <h5>Total Amount: ${totalItemAmount.toFixed(2)}</h5>
                        <h5>Discount: -${order.discount ? order.discount.toFixed(2) : '0.00'}</h5>
                        <h5>Tax: +${order.tax ? order.tax.toFixed(2) : '0.00'}</h5>
                        <h4 className="mt-2">Final Total: ${totalAmount.toFixed(2)}</h4>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
