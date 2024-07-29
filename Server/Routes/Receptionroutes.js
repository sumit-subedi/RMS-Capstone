const express = require('express');
const router = express.Router();
const pool = require('../db');
const mysql = require('mysql2/promise');

router.get('/occupied_tables', async (req, res) => {
    try {
        const query = 'SELECT * FROM tables WHERE status = "occupied"';
        pool.query(query, async(err, tables) => {
            if (err) {
                console.error('Error fetching occupied tables:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            // Fetch order details for each occupied table
            const tablesWithOrders = await Promise.all(tables.map(async (table) => {
                const orders = await getOrderDetailsByTableId(table.table_id);
                return {
                    ...table,
                    orders
                };
                
            }));

            res.json(tablesWithOrders);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const getOrderDetailsByTableId = (tableId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT ao.active_order_id, ao.status, aoi.quantity, mi.name, mi.price
            FROM active_orders ao
            LEFT JOIN active_order_items aoi ON ao.active_order_id = aoi.active_order_id
            LEFT JOIN menu_items mi ON aoi.item_id = mi.item_id
            WHERE ao.table_id = ? AND ao.status = 'in_progress'
        `;
        pool.query(query, [tableId], (err, results) => {
            if (err) {
                console.error('Error fetching order details:', err);
                return reject('Internal Server Error');
            }

            const orders = {};
            results.forEach(row => {
                console.log(row);
                const { active_order_id, status, quantity, name, price } = row;
                if (!orders[active_order_id]) {
                    orders[active_order_id] = {
                        active_order_id,
                        status,
                        items: []
                    };
                }
                orders[active_order_id].items.push({ name, quantity, price });
            });

            resolve(Object.values(orders));
        });
    });
};

router.get('/orders/:tableId', async (req, res) => {
    const { tableId } = req.params;
    try {
        console.log('here');
        const orderDetailsQuery = `
            SELECT ao.active_order_id, aoi.quantity, mi.name as item_name, mi.price
            FROM active_orders ao
            JOIN active_order_items aoi ON ao.active_order_id = aoi.active_order_id
            JOIN menu_items mi ON aoi.item_id = mi.item_id
            WHERE ao.table_id = ? AND ao.status = 'in_progress';
        `;
        pool.query(orderDetailsQuery, [tableId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log(results);
            if (results.length === 0) {
                return res.status(404).json({ error: 'No active orders for this table' });
            }

            const orders = [];
            results.forEach((row) => {
                const { active_order_id, waiter_name } = row;
                const existingOrder = orders.find(order => order.active_order_id === active_order_id);
                const item = {
                    item_name: row.item_name,
                    quantity: row.quantity,
                    price: row.price,
                };
                if (existingOrder) {
                    existingOrder.items.push(item);
                } else {
                    orders.push({
                        active_order_id,
                        waiterName: waiter_name,
                        items: [item],
                    });
                }
            });

            res.json({ order: orders, waiterName: results[0].waiter_name });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Finalize order for a specific table
router.post('/finalize/:tableId', async (req, res) => {
    const { tableId } = req.params;
    const { discount, grandTotal, paymentMethod } = req.body;  
    console.log(req.body, req.params);

    if (!tableId || discount === undefined || grandTotal === undefined || !paymentMethod) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                console.error('Error starting transaction:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Fetch active order
            connection.query(
                'SELECT * FROM active_orders WHERE table_id = ? AND status = "in_progress"',
                [tableId],
                (err, activeOrderRows) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error('Error fetching active order:', err);
                            res.status(500).json({ error: 'Internal Server Error' });
                        });
                    }

                    if (activeOrderRows.length === 0) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(404).json({ error: 'No active order found for this table.' });
                        });
                    }

                    const activeOrder = activeOrderRows[0];
                    const activeOrderId = activeOrder.active_order_id;

                    // Fetch username
                    connection.query(
                        'SELECT username FROM users WHERE user_id = ?',
                        [activeOrder.user_id],
                        (err, userRows) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.error('Error fetching username:', err);
                                    res.status(500).json({ error: 'Internal Server Error' });
                                });
                            }

                            const username = userRows[0] ? userRows[0].username : 'Unknown';

                            // Insert into orders table
                            connection.query(
                                `INSERT INTO orders (user_name, table_identifier, status, total_amount, discount, tax, grand_total, created_at, completed_at)
                                 SELECT ?, t.table_identifier, ?, ?, ?, ?, ?, ao.created_at, NOW()
                                 FROM active_orders ao
                                 JOIN tables t ON ao.table_id = t.table_id
                                 WHERE ao.active_order_id = ?`,
                                [username, 'completed', grandTotal-discount, discount,0.0, grandTotal, activeOrderId],
                                (err, result) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            console.error('Error inserting into orders table:', err);
                                            res.status(500).json({ error: 'Internal Server Error' });
                                        });
                                    }

                                    const orderId = result.insertId;

                                    // Insert into order_items table
                                    connection.query(
                                        `INSERT INTO order_items (order_id, item_name, quantity, price_at_order)
                                         SELECT ?, mi.name, aoi.quantity, mi.price
                                         FROM active_order_items aoi
                                         JOIN menu_items mi ON aoi.item_id = mi.item_id
                                         WHERE aoi.active_order_id = ?`,
                                        [orderId, activeOrderId],
                                        (err) => {
                                            if (err) {
                                                return connection.rollback(() => {
                                                    connection.release();
                                                    console.error('Error inserting into order_items table:', err);
                                                    res.status(500).json({ error: 'Internal Server Error' });
                                                });
                                            }

                                            // Update table status to 'available'
                                            connection.query(
                                                'DELETE FROM active_orders WHERE active_order_id = ?',
                                                [activeOrderId],
                                                (err) => {
                                                    if (err) {
                                                        return connection.rollback(() => {
                                                            connection.release();
                                                            console.error('Error deleting active order:', err);
                                                            res.status(500).json({ error: 'Internal Server Error' });
                                                        });
                                                    }

                                                    // Update table status
                                                    connection.query(
                                                        'UPDATE tables SET status = "available" WHERE table_id = ?',
                                                        [tableId],
                                                        (err) => {
                                                            if (err) {
                                                                return connection.rollback(() => {
                                                                    connection.release();
                                                                    console.error('Error updating table status:', err);
                                                                    res.status(500).json({ error: 'Internal Server Error' });
                                                                });
                                                            }

                                                            connection.commit(err => {
                                                                if (err) {
                                                                    return connection.rollback(() => {
                                                                        connection.release();
                                                                        console.error('Error committing transaction:', err);
                                                                        res.status(500).json({ error: 'Internal Server Error' });
                                                                    });
                                                                }

                                                                connection.release();
                                                                res.status(200).json({ message: 'Order finalized successfully' });
                                                            });
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        });
    }); 
});


router.post('/orders', (req, res) => {
    // Logic to create a new order
    res.send('Order created successfully');
});

// Other routes for waiter portal...

module.exports = router;
