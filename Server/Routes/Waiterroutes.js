const express = require('express');
const router = express.Router();

// Define routes for waiter portal
router.get('/orders', (req, res) => {
    // Logic to get orders
    console.log('here');
    return res.status(400).json({ message: 'Orders Page' });
});

router.post('/orders', (req, res) => {
    // Logic to create a new order
    res.send('Order created successfully');
});

module.exports = router;
