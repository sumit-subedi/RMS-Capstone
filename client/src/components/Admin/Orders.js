import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { Link } from 'react-router-dom';


const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: '',
        userName: '',
        minAmount: '',
        maxAmount: '',
        tableIdentifier: '',
        orderId: ''
    });
    const [totalAmount, setTotalAmount] = useState(0);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

    useEffect(() => {
        fetchOrders();
    }, [filters, sortColumn, sortDirection]); // Update orders whenever filters, sort column, or sort direction change

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get('admin/orders', { params: { ...filters, sortColumn, sortDirection } });
            setOrders(response.data);
            calculateTotalAmount(response.data); // Calculate total amount on update
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const calculateTotalAmount = (orders) => {
        const total = orders.reduce((acc, order) => acc + parseFloat(order.total_amount), 0);
        setTotalAmount(total);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const resetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            status: '',
            userName: '',
            minAmount: '',
            maxAmount: '',
            tableIdentifier: '',
            orderId: ''
        });
    };

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const getSortedOrders = () => {
        if (sortColumn) {
            const sortedOrders = [...orders].sort((a, b) => {
                const aValue = a[sortColumn];
                const bValue = b[sortColumn];
                if (sortDirection === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
            return sortedOrders;
        }
        return orders;
    };

    const sortedOrders = getSortedOrders();

    return (
        <div className="container py-4 text-light">
            <h2 className="mb-4">Admin Orders</h2>
            {/* Filter Controls */}
            <div className="row mb-3">
                <div className="col">
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="form-control" placeholder="Start Date" />
                </div>
                <div className="col">
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="form-control" placeholder="End Date" />
                </div>
                <div className="col">
                    <input type="text" name="status" value={filters.status} onChange={handleFilterChange} className="form-control" placeholder="Status" />
                </div>
                <div className="col">
                    <input type="text" name="userName" value={filters.userName} onChange={handleFilterChange} className="form-control" placeholder="User Name" />
                </div>
                <div className="col">
                    <input type="number" name="minAmount" value={filters.minAmount} onChange={handleFilterChange} className="form-control" placeholder="Min Amount" />
                </div>
                <div className="col">
                    <input type="number" name="maxAmount" value={filters.maxAmount} onChange={handleFilterChange} className="form-control" placeholder="Max Amount" />
                </div>
                <div className="col">
                    <input type="text" name="tableIdentifier" value={filters.tableIdentifier} onChange={handleFilterChange} className="form-control" placeholder="Table Identifier" />
                </div>

                <div className="col-auto">
                    <button className="btn btn-primary" onClick={fetchOrders}>Apply Filters</button>
                </div>
                <div className="col-auto">
                    <button className="btn btn-secondary" onClick={resetFilters}>Reset Filters</button>
                </div>
            </div>
            {/* Order Table */}
            <div className="table-responsive">
                <table className="table table-striped table-hover text-light">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('order_id')} className="cursor-pointer">
                                Order ID {sortColumn === 'order_id' && <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'down' : 'up'}`}></i>}
                            </th>
                            <th onClick={() => handleSort('user_name')} className="cursor-pointer">
                                User {sortColumn === 'user_name' && <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'down' : 'up'}`}></i>}
                            </th>
                            <th onClick={() => handleSort('status')} className="cursor-pointer">
                                Status {sortColumn === 'status' && <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'down' : 'up'}`}></i>}
                            </th>
                            <th onClick={() => handleSort('total_amount')} className="cursor-pointer">
                                Total Amount {sortColumn === 'total_amount' && <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'down' : 'up'}`}></i>}
                            </th>
                            <th onClick={() => handleSort('table_identifier')} className="cursor-pointer">
                                Table {sortColumn === 'table_identifier' && <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'down' : 'up'}`}></i>}
                            </th>
                            {/* Add more columns as needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedOrders.map(order => (
                            <tr key={order.order_id}>
                                <td>{order.order_id}</td>
                                <td>{order.user_name}</td>
                                <td>{order.status}</td>
                                <td>${order.total_amount}</td>
                                <td>{order.table_identifier}</td>
                                <td>
                                    <Link to={`/admin/order/${order.order_id}`} className="btn btn-info btn-sm">View Details</Link>
                                </td>
                                {/* Display timestamps or additional details */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Display Total Amount */}
            <div className="mt-4 text-end">
                <h5>Total Amount of Orders: ${totalAmount.toFixed(2)}</h5>
            </div>
        </div>
    );
};

export default AdminOrders;
