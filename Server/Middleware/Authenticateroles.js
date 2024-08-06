const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'a4f8071c613db1b9e2ca8a1df3f3d2e4b5a3c1d4f2b2c1a3e3d4a2f1b3c4d5e6f7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3';

function authenticateRole(roles) {
    return (req, res, next) => {

        const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Access Denied', message: 'No token provided' });
        }

        try {
            const verified = jwt.verify(token, JWT_SECRET);
            req.user = verified;

            if (roles && !roles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Forbidden', message: 'Insufficient role permissions' });
            }

            next();
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid Token', message: 'Token is not valid' });
            }
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token Expired', message: 'Token has expired' });
            }
            res.status(400).json({ error: 'Bad Request', message: 'Invalid token format' });
        }
    };

}


module.exports = authenticateRole;
