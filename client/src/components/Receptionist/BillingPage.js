import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import Navbar from '../Navbar';

const BillingPage = () => {
    const { tableId } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const [waiterName, setWaiterName] = useState('');
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axiosInstance.get(`/reception/orders/${tableId}`);
                setOrderDetails(response.data.order[0].items);
                setWaiterName(response.data.waiterName);
            } catch (error) {
                setError('Error fetching order details:', error.message);
            }
        };

        fetchOrderDetails();
    }, [tableId]);

    const handleDiscountChange = (e) => {
        setDiscount(Number(e.target.value));
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const calculateTotal = () => {
        return orderDetails.reduce((acc, item) => acc + item.quantity * item.price, 0);
    };

    const calculateGrandTotal = () => {
        const total = calculateTotal();
        const discountedTotal = total - (total * discount) / 100;
        console.log(discountedTotal);
        return discountedTotal + total * 0.13; 
    };

    const finalizeOrder = async () => {
        try {
            await axiosInstance.post(`/reception/finalize/${tableId}`, {
                discount,
                grandTotal: calculateGrandTotal(),
                paymentMethod,
            });
            alert('Order finalized successfully!');
            navigate('/reception');
        } catch (error) {
            setError('Error finalizing order:', error.message);
        }
    };

    return (
        <div className="container mt-5">
            <Navbar />
            <h2 className="text-center mb-4">Billing for Table {tableId}</h2>
            {error && <p className="text-danger text-center">{error}</p>}
            <div className="card border-primary mb-4">
                <div className="card-body">
                    <h5 className="card-title">Waiter: {waiterName}</h5>
                    <div className="table-responsive mb-3">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Units</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.item_name}</td>
                                        <td>{item.quantity}</td>
                                        <td>${(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex flex-column mb-4">
                        <div className="d-flex justify-content-between mb-2">
                            <h6>Subtotal:</h6>
                            <h6>${calculateTotal().toFixed(2)}</h6>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <h6>Discount:</h6>
                            <h6>-${(calculateTotal() * discount / 100).toFixed(2)}</h6>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <h6>Tax (13%):</h6>
                            <h6>+${( calculateTotal() * 0.13).toFixed(2)}</h6>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <h5>Grand Total:</h5>
                            <h5>${calculateGrandTotal().toFixed(2)}</h5>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <div className="w-50">
                            <label htmlFor="discount" className="form-label">
                                Discount (%):
                            </label>
                            <select
                                id="discount"
                                className="form-select"
                                value={discount}
                                onChange={handleDiscountChange}
                            >
                                <option value={0}>None</option>
                                <option value={5}>5%</option>
                                <option value={10}>10%</option>
                                <option value={15}>15%</option>
                                <option value={20}>20%</option>
                            </select>
                        </div>
                        <div className="w-50">
                            <label htmlFor="paymentMethod" className="form-label">
                                Payment Method:
                            </label>
                            <select
                                id="paymentMethod"
                                className="form-select"
                                value={paymentMethod}
                                onChange={handlePaymentMethodChange}
                            >
                                <option value="cash">Cash</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="mobile_payment">Mobile Payment</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <button
                        className="btn btn-success btn-lg w-100"
                        onClick={finalizeOrder}
                    >
                        Finalize Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
