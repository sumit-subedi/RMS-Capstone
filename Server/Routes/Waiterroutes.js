const express = require('express');
const router = express.Router();
const pool = require('../db');


// Define routes for waiter portal
router.get('/orders', (req, res) => {
    // Logic to get orders
    console.log('here');
    return res.status(400).json({ message: 'Orders Page' });
});

router.get('/tables',async (req, res) => {
    try {
        // Query the tables database to retrieve table information
        pool.query('SELECT * FROM tables', (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }

            // Format the response with table information including occupancy status
            const tables = results.map(table => ({
                id: table.id,
                table_number: table.table_number,
                capacity: table.capacity,
                status: table.status 
            }));

            res.json(tables);
        });
    } catch (error) {
        console.error('Error fetching tables information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/menu_items', async (req, res) => {
    try {
        // Query the menu items database to retrieve menu information
        pool.query('SELECT * FROM menu_items', (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
    
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
        });
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
        const menuItems = await pool.query('SELECT * FROM menu_items WHERE category = $1', [category]);

        // Send the retrieved menu items as a JSON response
        res.json(menuItems.rows);
    } catch (error) {
        // Handle errors
        console.error('Error retrieving menu items by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/orders', (req, res) => {
    // Logic to create a new order
    res.send('Order created successfully');
});

module.exports = router;
