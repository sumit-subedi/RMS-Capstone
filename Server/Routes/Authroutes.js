const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key for web token 
// ************** NEED TO STORE SECRET KEY ON ENVIRONMENT VARIABLE ********************************

const JWT_SECRET = process.env.JWT_SECRET || 'a4f8071c613db1b9e2ca8a1df3f3d2e4b5a3c1d4f2b2c1a3e3d4a2f1b3c4d5e6f7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3';


// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Query the database for the user
        const results = await new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(password, user.password);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user.user_id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ token, role: user.role });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
