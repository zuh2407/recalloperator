const express = require('express');
const router = express.Router();
const { products } = require('../db');
const { simulateRiskEvent } = require('../agent');

// Get all products for a business (no auth required for demo)
router.get('/', (req, res) => {
    try {
        const businessId = req.query.businessId;

        if (businessId === 'all' || !businessId) {
            // Return all products from all businesses
            res.json(products);
        } else {
            // Return products for specific business
            const myProducts = products.filter(p => p.businessId === businessId);
            res.json(myProducts);
        }
    } catch (error) {
        console.error('Error in GET /api/products:', error);
        res.status(500).json({ error: error.message });
    }
});

// Trigger Simulation
router.post('/simulate', (req, res) => {
    try {
        const businessId = req.query.businessId || req.body.businessId || 'BID-12345';
        const result = simulateRiskEvent(businessId);

        if (result) {
            res.json({ message: 'Simulation triggered', product: result });
        } else {
            res.json({ message: 'No eligible products to simulate risk for' });
        }
    } catch (error) {
        console.error('Error in POST /api/products/simulate:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
