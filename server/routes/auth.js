const express = require('express');
const router = express.Router();
const { users, products, customers } = require('../db');

// Register new business
router.post('/register', (req, res) => {
    const { businessId, password, name } = req.body;

    if (!businessId || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if business ID already exists
    const existing = users.find(u => u.businessId === businessId);
    if (existing) {
        return res.status(400).json({ message: 'Business ID already registered' });
    }

    const newUser = {
        id: 'u' + Date.now(),
        businessId,
        password,
        name
    };

    users.push(newUser);

    // Create sample products for this new business
    const sampleProducts = [
        { name: 'Organic Baby Spinach', category: 'Produce', price: 4.99, batchId: 'SP-2024-001' },
        { name: 'Premium Almond Milk', category: 'Dairy', price: 5.99, batchId: 'AM-2024-045' },
        { name: 'Free-Range Eggs (12ct)', category: 'Dairy', price: 6.99, batchId: 'EG-2024-112' },
        { name: 'Spicy Hummus', category: 'Dips', price: 3.99, batchId: 'HM-2024-882' },
        { name: 'Frozen Chicken Nuggets', category: 'Frozen', price: 8.99, batchId: 'CN-2024-331' },
        { name: 'Artisan Sourdough Bread', category: 'Bakery', price: 7.99, batchId: 'SB-2024-099' }
    ];

    const createdProducts = [];
    sampleProducts.forEach((product, index) => {
        const newProduct = {
            id: `p${Date.now()}_${index}`,
            businessId: businessId,
            name: product.name,
            batchId: product.batchId,
            riskScore: Math.floor(Math.random() * 4), // Start with 0-3
            status: 'Safe',
            category: product.category,
            price: product.price,
            stock: Math.floor(Math.random() * 100) + 50
        };
        products.push(newProduct);
        createdProducts.push(newProduct);
    });

    // IMPORTANT: Add Zuhair (the demo user) as a customer to EVERY store
    const zuhairCustomer = {
        id: `c${Date.now()}_zuhair`,
        businessId: businessId,
        name: 'Zuhair Atham',
        email: 'mail-zuhair2407atham@gmail.com',
        phone: '+1555-DEMO-001',
        purchasedProducts: createdProducts.slice(0, 3).map(p => p.id) // Purchased 3 random products
    };
    customers.push(zuhairCustomer);

    // Add a sample customer for the store
    customers.push({
        id: `c${Date.now()}_store`,
        businessId: businessId,
        name: `${name} Customer`,
        email: `customer@${name.toLowerCase().replace(/\s/g, '')}.com`,
        phone: '+1555' + Math.floor(Math.random() * 10000),
        purchasedProducts: []
    });

    console.log(`✅ New business registered: ${name} (${businessId})`);
    console.log(`📦 Created ${sampleProducts.length} products for ${name}`);
    console.log(`👤 Added Zuhair Atham (mail-zuhair2407atham@gmail.com) as customer`);

    res.status(201).json({
        message: 'Registration successful',
        user: { name, businessId },
        productsCreated: sampleProducts.length,
        customersCreated: 2 // Zuhair + store customer
    });
});

// Get business info by ID
router.get('/business/:businessId', (req, res) => {
    const { businessId } = req.params;
    const user = users.find(u => u.businessId === businessId);

    if (!user) {
        return res.status(404).json({ message: 'Business not found' });
    }

    res.json({ businessId: user.businessId, name: user.name });
});

module.exports = router;
