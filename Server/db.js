const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,

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
