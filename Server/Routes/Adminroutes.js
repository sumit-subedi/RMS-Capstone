const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');


// Define routes
router.get('/dashboard', async (req, res) => {
    try {
        const todaySales = await getTodaySales();
        const saleTrend = await getSaleTrend();
        const popularItems = await getPopularItems();
        const ongoingOrders = await getOngoingOrders();


        res.json({
            todaySales,
            saleTrend,
            popularItems,
            ongoingOrders
        });
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Helper functions to fetch data
async function getTodaySales() {
    const query = `SELECT SUM(total_amount) AS todaySales FROM orders WHERE DATE(created_at) = CURDATE()`;
    const results = await new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
        });
    });
    return results.todaySales || 0;
}

async function getSaleTrend() {
    const query = `SELECT DATE(created_at) AS date, SUM(total_amount) AS totalSales 
                   FROM orders 
                   WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) 
                   GROUP BY DATE(created_at)`;
    const results = await new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return results;
}

async function getPopularItems() {
    const query = `SELECT item_name, SUM(quantity) AS totalQuantity 
                   FROM order_items 
                   GROUP BY item_name 
                   ORDER BY totalQuantity DESC 
                   LIMIT 5`;
    const results = await new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return results;
}

async function getOngoingOrders() {
    const query = `SELECT * FROM orders WHERE status = 'ongoing'`;
    const results = await new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return results;
}

// END OF ADMIN REPORT VISUAL

// CRUD Operation on Menu items Start

// Get all menu items
router.get('/menu-items', async (req, res) => {
    try {
        const query = `SELECT * FROM menu_items`;
    const results = await new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
        res.json(results);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a menu item by ID
router.get('/menu-items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM menu_items WHERE item_id = ?';
        const results = await new Promise((resolve, reject) => {
            pool.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        console.log(results);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching menu item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new menu item
router.post('/menu-items', async (req, res) => {
    const { name, description, price, category } = req.body;
    try {
        const query = 'INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)';
        const result = await new Promise((resolve, reject) => {
            pool.query(query, [name, description, price, category], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const newItemId = result.insertId;
        res.status(201).json({ item_id: newItemId, name, description, price, category });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Update a menu item
router.put('/menu-items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    try {
        const query = 'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ? WHERE item_id = ?';
        const result = await new Promise((resolve, reject) => {
            pool.query(query, [name, description, price, category, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json({ item_id: id, name, description, price, category });
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete a menu item
router.delete('/menu-items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM menu_items WHERE item_id = ?';
        const result = await new Promise((resolve, reject) => {
            pool.query(query, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// CRUD Operation on Menu items End


// *************CRUD Operation on table - START*********************

// Get all tables
router.get('/tables', async (req, res) => {
    try {
        const query = 'SELECT * FROM tables';
        const results = await new Promise((resolve, reject) => {
            pool.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        res.json(results);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a table by ID
router.get('/tables/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM tables WHERE table_id = ?';
        const results = await new Promise((resolve, reject) => {
            pool.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        if (results.length === 0) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching table:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new table
router.post('/tables', async (req, res) => {
    const { table_identifier, seats } = req.body;
    try {
        const query = 'INSERT INTO tables (table_identifier, seats) VALUES (?, ?)';
        const result = await new Promise((resolve, reject) => {
            pool.query(query, [table_identifier, seats], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const newTableId = result.insertId;
        res.status(201).json({ table_id: newTableId, table_identifier, seats });
    } catch (error) {
        console.error('Error adding table:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a table
router.put('/tables/:id', async (req, res) => {
    const { id } = req.params;
    const { table_identifier, seats, status } = req.body;
    try {
        const query = 'UPDATE tables SET table_identifier = ?, seats = ?, status = ? WHERE table_id = ?';
        const result = await new Promise((resolve, reject) => {
            pool.query(query, [table_identifier, seats, status, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.json({ table_id: id, table_identifier, seats, status });
    } catch (error) {
        console.error('Error updating table:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a table
router.delete('/tables/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM tables WHERE table_id = ?';
        const result = await new Promise((resolve, reject) => {
            pool.query(query, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.json({ message: 'Table deleted successfully' });
    } catch (error) {
        console.error('Error deleting table:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// *************CRUD Operation on table - START*********************


// ********************* User Management endpoints - START ********************//
// Get all users
router.get('/users', async (req, res) => {
    try {
        const query = 'SELECT user_id, username, email, full_name, role, is_active FROM users';
        const results = await new Promise((resolve, reject) => {
            pool.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        res.json(results);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a user by ID
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT user_id, username, email, full_name, role, is_active FROM users WHERE user_id = ?';
        const results = await new Promise((resolve, reject) => {
            pool.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new user
router.post('/users', async (req, res) => {
    console.log(req.body);
    const { username, password, email, full_name, role } = req.body;
    try {
        if (role === 'admin') {
            return res.status(403).json({ error: 'Cannot add admin users' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)';
        const result = await new Promise((resolve, reject) => {
            pool.query(query, [username, hashedPassword, email, full_name, role], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const newUserId = result.insertId;
        res.status(201).json({ user_id: newUserId, username, email, full_name, role });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a user
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, full_name, role, is_active, password } = req.body;
    try {
        const userQuery = 'SELECT * FROM users WHERE user_id = ?';
        const user = await new Promise((resolve, reject) => {
            pool.query(userQuery, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Cannot modify admin users' });
        }

        let updateQuery, queryParams;

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters long' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updateQuery = 'UPDATE users SET username = ?, email = ?, full_name = ?, role = ?, is_active = ?, password = ? WHERE user_id = ?';
            queryParams = [username, email, full_name, role, is_active, hashedPassword, id];
        } else {
            updateQuery = 'UPDATE users SET username = ?, email = ?, full_name = ?, role = ?, is_active = ? WHERE user_id = ?';
            queryParams = [username, email, full_name, role, is_active, id];
        }

        const result = await new Promise((resolve, reject) => {
            pool.query(updateQuery, queryParams, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user_id: id, username, email, full_name, role, is_active });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete a user
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const userQuery = 'SELECT * FROM users WHERE user_id = ?';
        const user = await new Promise((resolve, reject) => {
            pool.query(userQuery, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Cannot delete admin users' });
        }

        const deactivateQuery = 'UPDATE users SET is_active = 0 WHERE user_id = ?';
        const result = await new Promise((resolve, reject) => {
            pool.query(deactivateQuery, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deactivated successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ***************************** User Management EndPoint - END ************************

// GET all orders with optional filters
router.get('/orders', async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            status,
            userName,
            minAmount,
            maxAmount,
            tableIdentifier,
            orderId
        } = req.query;
        console.log(req.query);
        let query = 'SELECT * FROM orders WHERE 1';

        // Apply filters based on query parameters
        if (startDate) query += ` AND DATE(created_at) >= '${startDate}'`;
        if (endDate) query += ` AND DATE(created_at) <= '${endDate}'`;
        if (status) query += ` AND status LIKE '%${status}%'`; 
        if (userName) query += ` AND user_name LIKE '%${userName}%'`; 
        if (minAmount) query += ` AND total_amount >= ${minAmount}`;
        if (maxAmount) query += ` AND total_amount <= ${maxAmount}`;
        if (tableIdentifier) query += ` AND table_identifier LIKE '%${tableIdentifier}%'`; 
        if (orderId) query += ` AND order_id = ${orderId}`;

        const orders = await new Promise((resolve, reject) => {
            pool.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        res.json(orders);

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/order/:id', async (req, res) => {
    const orderId = req.params.id;
    console.log(orderId);
    try {
        // Query to get order details
        const orderQuery = 'SELECT * FROM orders WHERE order_id = ?';
        const order = await new Promise((resolve, reject) => {
            pool.query(orderQuery, [orderId], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Query to get order items
        const itemsQuery = 'SELECT * FROM order_items WHERE order_id = ?';
        const items = await new Promise((resolve, reject) => {
            pool.query(itemsQuery, [orderId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        res.json({ order, items });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
