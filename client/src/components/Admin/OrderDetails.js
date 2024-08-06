import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
    const { id } = useParams(); // Get order ID from URL parameters
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axiosInstance.get(`admin/order/${id}`);
                setOrder(response.data.order);
                setItems(response.data.items);
                setError(null);
            } catch (error) {
                handleError(error, 'Error fetching order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    const handleError = (error, defaultMessage) => {
        if (error.response) {
            setError(`Error: ${error.response.status} ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
            setError('Error: No response from server. Please try again later.');
        } else {
            setError(`Error: ${error.message}`);
        }
        console.error(defaultMessage, error);
    };

    // Ensure price_at_order is a number before using toFixed
    const calculateTotalItemAmount = () => {
        return items.reduce((acc, item) => acc + (Number(item.price_at_order) * item.quantity), 0);
    };

    if (loading) {
        return <div className="container py-4 text-light">Loading...</div>;
    }

    if (error) {
        return <div className="container py-4 text-light alert alert-danger">{error}</div>;
    }

    // Ensure tax and discount are numbers
    const totalItemAmount = calculateTotalItemAmount();
    const totalAmount = totalItemAmount + (Number(order.tax) || 0) - (Number(order.discount) || 0);

    return (
        <div className="container py-4 text-light">
            <h2 className="mb-4">Order Details</h2>
            {order && (
                <div className="bg-dark p-4 rounded shadow">
                    <h4>Order ID: {order.order_id}</h4>
                    <p><strong>User Name:</strong> {order.user_name}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Total Amount:</strong> ${totalItemAmount.toFixed(2)}</p>
                    <p><strong>Discount:</strong> ${Number(order.discount).toFixed(2) || '0.00'}</p>
                    <p><strong>Tax:</strong> ${Number(order.tax).toFixed(2) || '0.00'}</p>
                    <p><strong>Table Identifier:</strong> {order.table_identifier}</p>
                    <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>

                    <h4 className="mt-4">Order Items</h4>
                    <table className="table table-striped table-dark table-hover">
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
                                    <td>${Number(item.price_at_order).toFixed(2)}</td>
                                    <td>${(Number(item.price_at_order) * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 text-end">
                        <h5>Total Amount: ${totalItemAmount.toFixed(2)}</h5>
                        <h5>Discount: -${Number(order.discount).toFixed(2) || '0.00'}</h5>
                        <h5>Tax: +${Number(order.tax).toFixed(2) || '0.00'}</h5>
                        <h4 className="mt-2">Final Total: ${totalAmount.toFixed(2)}</h4>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
