const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,

    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    port: process.env.DB_PORT || "3306",
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'restaurant_db'
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
