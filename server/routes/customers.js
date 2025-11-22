const express = require('express');
const router = express.Router();
const { customers } = require('../db');

// Get Customers for a business (no auth required for demo)
router.get('/', (req, res) => {
    try {
        const businessId = req.query.businessId;

        if (businessId === 'all' || !businessId) {
            // Return all customers from all businesses
            res.json(customers);
        } else {
            // Return customers for specific business
            const myCustomers = customers.filter(c => c.businessId === businessId);
            res.json(myCustomers);
        }
    } catch (error) {
        console.error('Error in GET /api/customers:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add New Customer
router.post('/', (req, res) => {
    try {
        const businessId = req.query.businessId || req.body.businessId || 'BID-12345';
        const { name, email, phone } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and Email are required' });
        }

        const newCustomer = {
            id: 'c' + Date.now(),
            businessId,
            name,
            email,
            phone: phone || '',
            purchasedProducts: []
        };

        customers.push(newCustomer);
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error('Error in POST /api/customers:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
