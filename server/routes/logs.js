const express = require('express');
const router = express.Router();
const { logs } = require('../db');

// Get logs for a business (no auth required for demo)
router.get('/', (req, res) => {
    try {
        const businessId = req.query.businessId;

        if (businessId === 'all' || !businessId) {
            // Return all logs from all businesses
            res.json(logs.reverse());
        } else {
            // Return logs for specific business
            const myLogs = logs.filter(l => l.businessId === businessId);
            res.json(myLogs.reverse());
        }
    } catch (error) {
        console.error('Error in GET /api/logs:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
