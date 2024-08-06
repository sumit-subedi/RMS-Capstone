const express = require('express');
const router = express.Router();
const pool = require('../db');

// Define routes for waiter portal
router.get('/orders', (req, res) => {
    // Logic to get orders
    console.log('here');
    return res.status(400).json({ message: 'Orders Page' });
});

router.get('/tables', async (req, res) => {
    try {
        const query = 'SELECT * FROM tables';
        const [results] = await pool.promise().query(query);

        if (!Array.isArray(results)) {
            throw new Error('Unexpected query result format');
        }

        const tables = results.map(table => ({
            id: table.table_id,
            table_number: table.table_identifier,
            capacity: table.seats,
            status: table.status 
        }));

        res.json(tables);
    } catch (error) {
        console.error('Error fetching tables information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /waiter/menu_items
router.get('/menu_items', async (req, res) => {
    try {
        const query = 'SELECT * FROM menu_items';
        const [results] = await pool.promise().query(query);

        const categorizedItems = results.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
        }, {});
        res.json(categorizedItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /waiter/orders/:tableId/items Add item to the order
router.post('/orders/:tableId/items', async (req, res) => {
    const { tableId } = req.params;
    const { itemId, quantity } = req.body;

    
    try {
        // Check if an active order exists, if not create one
        let orderId = await getOrCreateActiveOrder(tableId, req.user.userId);
        
        // Add item to order
        await pool.promise().query(
            'INSERT INTO active_order_items (active_order_id, item_id, quantity) VALUES (?, ?, ?)',
            [orderId, itemId, quantity]
        );        
        res.status(201).json({ message: 'Item added to order' });
    } catch (error) {
        console.error('Error adding item to order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /waiter/orders/:tableId
router.delete('/orders/:tableId', async (req, res) => {
    const { tableId } = req.params;
    try {
        // Delete Order Items
        await pool.promise().query('DELETE FROM active_order_items WHERE active_order_id IN (SELECT active_order_id FROM active_orders WHERE table_id = ?)', [tableId]);

        await pool.promise().query('DELETE FROM active_orders WHERE table_id = ?', [tableId]);
        await pool.promise().query('UPDATE tables SET status = "available" WHERE table_id = ?', [tableId]);
        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/orders/:tableId/items/:itemId', async (req, res) => {
    const { tableId, itemId } = req.params;
    try {
        // Perform deletion from your database (adjust the SQL query as per your schema)
        await pool.promise().query('DELETE FROM active_order_items WHERE active_order_id IN (SELECT active_order_id FROM active_orders WHERE table_id = ? AND status = "in_progress") AND item_id = ?', [tableId, itemId]);

        // Check if there are any remaining items in the active order
        const checkRemainingItemsQuery = `
        SELECT COUNT(*) AS itemCount 
        FROM active_order_items 
        WHERE active_order_id IN (
            SELECT active_order_id 
            FROM active_orders 
            WHERE table_id = ? AND status = "in_progress"
        )
        `;
        const [result] = await pool.promise().query(checkRemainingItemsQuery, [tableId]);

        const itemCount = result[0].itemCount;
        console.log(itemCount);

        if (itemCount === 0) {
            console.log("here");
        // Update table status to available if no items remain in the order
        const updateTableQuery = `
            UPDATE tables 
            SET status = "available" 
            WHERE table_id = ?
        `;
        await pool.promise().query(updateTableQuery, [tableId]);
    }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Helper function to get or create an active order
async function getOrCreateActiveOrder(tableId, userId) {
    try {
        const query = 'SELECT active_order_id FROM active_orders WHERE table_id = ? AND status = "in_progress"';
        const [rows] = await pool.promise().query(query, [tableId]);

        if (rows && rows.length > 0) {
            return rows[0].active_order_id;
        } else {
            console.log("here else");
            const query = 'INSERT INTO active_orders (table_id, status, user_id) VALUES (?, "in_progress", ?)';
            const [rows] = await pool.promise().query(query, [tableId, userId]);

            await pool.promise().query('UPDATE tables SET status = "occupied" WHERE table_id = ?', [tableId]);

            return rows.insertId;
        }
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching or creating active order: ' + error.message);
    }
}

// Endpoint to create or update an order
router.post('/orders', async (req, res) => {
    const { tableId, items, userId } = req.body;

    if (!tableId || !items || !userId || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid input. Please provide tableId, items array, and userId.' });
    }

    const connection = await pool.promise().getConnection();
    
    try {
        await connection.beginTransaction();

        // Check if an active order exists for the table
        const [existingOrderResult] = await connection.query('SELECT active_order_id FROM active_orders WHERE table_id = ? AND status = "in_progress"', [tableId]);

        let activeOrderId;
        if (existingOrderResult.length > 0) {
            // Update existing active order
            activeOrderId = existingOrderResult[0].active_order_id;
            await connection.query('DELETE FROM active_order_items WHERE active_order_id = ?', [activeOrderId]);
        } else {
            // Create new active order
            const [newOrderResult] = await connection.query(`
                INSERT INTO active_orders (user_id, table_id, status)
                VALUES (?, ?, 'in_progress')
            `, [userId, tableId]);
            activeOrderId = newOrderResult.insertId;
        }

        // Insert active order items
        const insertItemQuery = `
            INSERT INTO active_order_items (active_order_id, item_id, quantity)
            VALUES (?, ?, ?)
        `;
        for (const item of items) {
            await connection.query(insertItemQuery, [activeOrderId, item.itemId, item.quantity]);
        }

        // Update table status
        await connection.query('UPDATE tables SET status = ? WHERE table_id = ?', ['occupied', tableId]);

        // Calculate total amount (for information purposes, not stored in active_orders)
        const [totalAmountResult] = await connection.query(`
            SELECT SUM(mi.price * aoi.quantity) as total_amount
            FROM active_order_items aoi
            JOIN menu_items mi ON aoi.item_id = mi.item_id
            WHERE aoi.active_order_id = ?
        `, [activeOrderId]);
        const totalAmount = totalAmountResult[0].total_amount;

        await connection.commit();

        res.status(201).json({ 
            message: 'Order created/updated successfully', 
            activeOrderId, 
            totalAmount 
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error creating/updating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        connection.release();
    }
});


router.get('/menu_items', async (req, res) => {
    try {
        // Query the menu items database to retrieve menu information
        const [results] = await pool.promise().query('SELECT * FROM menu_items');

        // Initialize an object to store menu items categorized by type
        const categorizedMenuItems = {
            pizza: [],
            salad: [],
            desserts: [],
            pasta: [],
            others: [],
        };

        // Iterate through the results and categorize each menu item
        results.forEach(item => {
            switch (item.category) {
                case 'Pizza':
                    categorizedMenuItems.pizza.push(item);
                    break;
                case 'Salad':
                    categorizedMenuItems.salad.push(item);
                    break;
                case 'Desserts':
                    categorizedMenuItems.desserts.push(item);
                    break;
                case 'Pasta':
                    categorizedMenuItems.pasta.push(item);
                    break;
                default:
                    categorizedMenuItems.others.push(item);
                    break;
            }
        });

        // Send the categorized menu items as a JSON response to the client
        res.json(categorizedMenuItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to retrieve menu items by category
router.get('/menu_items/:category', async (req, res) => {
    const { category } = req.params;
    try {
        // Query the database to fetch menu items by category
        const [menuItems] = await pool.query('SELECT * FROM menu_items WHERE category = ?', [category]);

        // Send the retrieved menu items as a JSON response
        res.json(menuItems);
    } catch (error) {
        // Handle errors
        console.error('Error retrieving menu items by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/orders/:tableId', async (req, res) => {
    const { tableId } = req.params;
    try {
        const query = `SELECT oi.item_id, i.name, i.price, oi.quantity
                       FROM active_orders AS o
                       JOIN active_order_items AS oi ON o.active_order_id = oi.active_order_id
                       JOIN menu_items AS i ON oi.item_id = i.item_id
                       WHERE o.table_id = ?`;
        // Query the database to retrieve items for the specified table
        const [items] = await pool.promise().query(query, [tableId]);

        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found for this table' });
        }
        
        let itemsArray = items.map(row => ({
            item_id: row.item_id,
            name: row.name,
            price: row.price,
            quantity: row.quantity
        }));
    
        // Calculate total amount
        let totalAmount = items[0].total_amount;
       
        res.json({ itemsArray, totalAmount });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/orders', (req, res) => {
    // Logic to create a new order
    res.send('Order created successfully');
});

module.exports = router;
