// tokenVerificationMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'a4f8071c613db1b9e2ca8a1df3f3d2e4b5a3c1d4f2b2c1a3e3d4a2f1b3c4d5e6f7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3';

function verifyToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access Denied', message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid Token', message: 'Token is not valid' });
    }
}

module.exports = verifyToken;
