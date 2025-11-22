const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log('Auth Middleware Reached');
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Token verified. Decoded:', JSON.stringify(decoded, null, 2));
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(401).send('Invalid Token');
    }
    return next();
};

module.exports = verifyToken;
