import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../axiosInstance';
import Chart from 'chart.js/auto';
import AddminNavbar from '../components/AdminNavbar';

const AdminDashboard = () => {
    const [todaySales, setTodaySales] = useState(0);
    const [saleTrendData, setSaleTrendData] = useState([]);
    const [popularItems, setPopularItems] = useState([]);
    const [ongoingOrders, setOngoingOrders] = useState([]);
    
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
            console.error('Error fetching data:', error);
        }
    };

    const initializeSaleTrendChart = (saleTrend) => {
        const trendLabels = saleTrend.map(data => {
            const date = new Date(data.date);
            return date.toLocaleDateString(); 
        });        const trendData = saleTrend.map(data => data.totalSales);

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
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white' 
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white' 
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white' // Change the color of the legend labels
                        }
                    },
                    title: {
                        display: true,
                        text: 'Most Popular Items',
                        color: 'white', 
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
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white' // Change the color of y-axis labels
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white' 
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white' // Change the color of the legend labels
                        }
                    },
                    title: {
                        display: true,
                        text: 'Most Popular Items',
                        color: 'white', 
                        font: {
                            size: 18
                        }
                    }
                }
            }
        });
    };
    

    return (
        <div className="container-fluid">
            <div className="row">
                <AddminNavbar />
                <main className="col-md-9 ms-sm-auto col-lg-10 bg-dark px-md-4">
                    <div className="pt-3 pb-2 mb-3 border-bottom text-white">
                        <h1 className="h2">Admin Dashboard</h1>
                    </div>

                    {/* Total Sales for Today */}
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card bg-primary text-white mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Total Sales for Today</h5>
                                    <p className="card-text">${todaySales}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sale Trend Chart */}
                    <div className="row">
                        <div className="col-md-8">
                            <div className="card bg-secondary text-white mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Sales Trend</h5>
                                    <canvas id="saleTrendChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Popular Items */}
                    <div className="row">
                        <div className="col-md-8">
                            <div className="card bg-secondary text-white mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Most Popular Items</h5>
                                    <canvas id="popularItemsChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ongoing Orders */}
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card bg-secondary text-white mb-4">
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
