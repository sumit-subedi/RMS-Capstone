const express = require('express');
const router = express.Router();
const pool = require('../db');

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


module.exports = router;
