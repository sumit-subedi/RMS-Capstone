const express = require('express');
const app = express();
const mysql = require('mysql');


// Import route handlers
const waiterRoutes = require('./Routes/Waiterroutes');
const receptionistRoutes = require('./Routes/Receptionroutes');
const adminRoutes = require('./Routes/Adminroutes');

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restaurant_db'
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to MySQL database!');
    connection.release(); // Release the connection
});

module.exports = pool; 

// Mount route handlers
app.use('/waiter', waiterRoutes);
app.use('/reception', receptionistRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
