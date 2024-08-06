import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../../axiosInstance';
import Chart from 'chart.js/auto';
import './styles.css'; 

const AdminDashboard = () => {
    const [todaySales, setTodaySales] = useState(0);
    const [saleTrendData, setSaleTrendData] = useState([]);
    const [popularItems, setPopularItems] = useState([]);
    const [ongoingOrders, setOngoingOrders] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const saleTrendChartRef = useRef(null);
    const popularItemsChartRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/admin/dashboard');
            const { todaySales, saleTrend, popularItems, ongoingOrders } = response.data;
            setTodaySales(todaySales);
            setSaleTrendData(saleTrend);
            setPopularItems(popularItems);
            setOngoingOrders(ongoingOrders);

            // Initialize or update charts here using Chart.js
            initializeSaleTrendChart(saleTrend);
            initializePopularItemsChart(popularItems);

        } catch (error) {
            handleError(error, 'Failed to fetch dashboard data');
        }
    };

    const handleError = (error, defaultMessage) => {
        if (error.response) {
            setErrorMessage(`Error: ${error.response.status} ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
            setErrorMessage('Error: No response from server. Please try again later.');
        } else {
            setErrorMessage(`Error: ${error.message}`);
        }
        console.error(defaultMessage, error);
    };

    const initializeSaleTrendChart = (saleTrend) => {
        const trendLabels = saleTrend.map(data => new Date(data.date).toLocaleDateString());
        const trendData = saleTrend.map(data => data.totalSales);

        const ctx = document.getElementById('saleTrendChart');
        if (saleTrendChartRef.current) {
            saleTrendChartRef.current.destroy();
        }
        saleTrendChartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendLabels,
                datasets: [{
                    label: 'Sales Trend',
                    data: trendData,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Sales Trend Over Time',
                        color: '#ffffff',
                        font: {
                            size: 18
                        }
                    }
                }
            }
        });
    };

    const initializePopularItemsChart = (popularItems) => {
        const itemLabels = popularItems.map(item => item.item_name);
        const itemData = popularItems.map(item => item.totalQuantity);

        const ctx = document.getElementById('popularItemsChart');
        if (popularItemsChartRef.current) {
            popularItemsChartRef.current.destroy();
        }
        popularItemsChartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: itemLabels,
                datasets: [{
                    label: 'Most Popular Items',
                    data: itemData,
                    backgroundColor: 'rgba(40, 167, 69, 0.5)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Top Selling Items',
                        color: '#ffffff',
                        font: {
                            size: 18
                        }
                    }
                }
            }
        });
    };

    return (
        <div className="admin-dashboard bg-dark text-white">
            <div className="row">
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <div className="pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">Admin Dashboard</h1>
                    </div>

                    {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}

                    <div className="row">
                        <div className="col-md-6">
                            <div className="card bg-primary text-white mb-4 shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Total Sales for Today</h5>
                                    <p className="card-text">${todaySales}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-8">
                            <div className="card bg-secondary text-white mb-4 shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Sales Trend</h5>
                                    <canvas id="saleTrendChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-8">
                            <div className="card bg-secondary text-white mb-4 shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Most Popular Items</h5>
                                    <canvas id="popularItemsChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="card bg-secondary text-white mb-4 shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Ongoing Orders</h5>
                                    <ul className="list-group list-group-flush">
                                        {ongoingOrders.map((order, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                                                Table {order.table_id}
                                                <span className="badge bg-primary rounded-pill">${order.total_amount}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
