import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import Navbar from '../Navbar';

const TableDetailsPage = () => {
    const { tableId } = useParams();
    const [items, setItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [orderExists, setOrderExists] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchItems();
        fetchMenuItems();
    }, [tableId]);

    const fetchItems = async () => {
        try {
            const response = await axiosInstance.get(`/waiter/orders/${tableId}`);
            console.log(response, response.data.itemsArray.length);
            if (response.data.itemsArray.length === 0) {
                setItems([]);
                setTotalAmount(0);
                setOrderExists(false);
            } else {
                setItems(response.data.itemsArray);
                setTotalAmount(response.data.totalAmount);
                setOrderExists(true);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            setOrderExists(false);
        }
    };

    const fetchMenuItems = async () => {
        try {
            const response = await axiosInstance.get('/waiter/menu_items');
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            setErrorMessage('Failed to fetch menu items. Please try again.');
        }
    };

    const handleAddItem = async () => {
        if (!selectedItem || quantity <= 0) {
            setErrorMessage('Please select an item and enter a valid quantity.');
            return;
        }
        try {
            await axiosInstance.post(`/waiter/orders/${tableId}/items`, {
                itemId: selectedItem,
                quantity: quantity
            });
            fetchItems(); // Refresh the order list
            setSelectedItem('');
            setQuantity(1);
            setShowAddItemModal(false); // Close the Add Item modal after adding item
            setSuccessMessage('Item added successfully.');
            setErrorMessage('');
        } catch (error) {
            console.error('Error adding item:', error);
            setErrorMessage('Failed to add item. Please try again.');
            setSuccessMessage('');
        }
    };

    const handleCancelOrder = async () => {
        try {
            await axiosInstance.delete(`/waiter/orders/${tableId}`);
            setItems([]);
            setTotalAmount(0);
            setOrderExists(false);
            setSuccessMessage('Order cancelled successfully.');
            setErrorMessage('');
        } catch (error) {
            console.error('Error cancelling order:', error);
            setErrorMessage('Failed to cancel order. Please try again.');
            setSuccessMessage('');
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await axiosInstance.delete(`/waiter/orders/${tableId}/items/${itemId}`);
            fetchItems(); // Refresh the order list after deleting an item
            setSuccessMessage('Item deleted successfully.');
            setErrorMessage('');
        } catch (error) {
            console.error('Error deleting item:', error);
            setErrorMessage('Failed to delete item. Please try again.');
            setSuccessMessage('');
        }
    };

    const openAddItemModal = () => {
        setShowAddItemModal(true);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const closeAddItemModal = () => {
        setShowAddItemModal(false);
    };

    return (
        <div className="bg-dark vh-100 d-flex flex-column">
            <Navbar />
            <div className="container py-4 flex-grow-1">
                <h2 className="mb-4 text-light">Table {tableId} Details</h2>
                {errorMessage && <div className="alert alert-danger mb-4" role="alert">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success mb-4" role="alert">{successMessage}</div>}
                {!orderExists && <div className="alert alert-info mb-4" role="alert">No order items found for this table.</div>}
                {orderExists && (
                    <>
                        <ul className="list-group mb-4">
                            {items.map(item => (
                                <li key={item.item_id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="me-auto">
                                        <span>{item.name}</span>
                                        <br />
                                        <span className="badge bg-primary mt-2">{item.quantity}</span>
                                        <br />
                                        <span className="badge bg-secondary mt-2">$ {item.price}</span>
                                    </div>
                                    <button className="btn btn-danger" onClick={() => handleDeleteItem(item.item_id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {/* Add Item Modal */}
                {showAddItemModal && (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Item</h5>
                                    <button type="button" className="btn-close" onClick={closeAddItemModal}></button>
                                </div>
                                <div className="modal-body">
                                    <select
                                        className="form-select mb-2"
                                        value={selectedItem}
                                        onChange={(e) => setSelectedItem(e.target.value)}
                                    >
                                        <option value="">Select an item</option>
                                        {Object.entries(menuItems).map(([category, items]) => (
                                            <optgroup label={category} key={category}>
                                                {items.map(item => (
                                                    <option key={item.item_id} value={item.item_id}>
                                                        {item.name} - ${item.price}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        className="form-control mb-2"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        min="1"
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeAddItemModal}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleAddItem}>Add Item</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="bg-light p-3 mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>Total Amount: ${totalAmount}</div>
                        <div>
                        <button onClick={openAddItemModal} className="btn btn-primary m-3">Add Item</button>

                        {orderExists && <button onClick={handleCancelOrder} className="btn btn-danger m-3">Cancel Order</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableDetailsPage;
