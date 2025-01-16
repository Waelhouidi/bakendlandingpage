const jwt = require('jsonwebtoken');

const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        jwt.verify(token, '123456789', (err, decoded) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to authenticate token' });
            }

            // Check if the user's role matches the required role
            if (decoded.role !== requiredRole) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            req.userId = decoded.id;
            next();
        });
    };
};

module.exports = verifyRole;