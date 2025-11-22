const express = require('express');
const router = express.Router();
const { supplyChain, products } = require('../db');

// Get supply chain data for all products
router.get('/', (req, res) => {
    try {
        const businessId = req.query.businessId;

        let businessProducts;
        if (businessId === 'all' || !businessId) {
            // Get all products from all businesses
            businessProducts = products;
        } else {
            // Get products for specific business
            businessProducts = products.filter(p => p.businessId === businessId);
        }

        const productIds = businessProducts.map(p => p.id);

        // Get supply chain data for these products
        const businessSupplyChain = supplyChain.filter(sc => productIds.includes(sc.productId));

        // Enrich with product info
        const enrichedData = businessSupplyChain.map(sc => {
            const product = businessProducts.find(p => p.id === sc.productId);
            return {
                ...sc,
                productName: product?.name,
                currentRiskScore: product?.riskScore,
                productStatus: product?.status
            };
        });

        res.json(enrichedData);
    } catch (error) {
        console.error('Error in GET /api/supply-chain:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get supply chain data for a specific product
router.get('/:productId', (req, res) => {
    try {
        const { productId } = req.params;
        const scData = supplyChain.find(sc => sc.productId === productId);

        if (!scData) {
            return res.status(404).json({ message: 'Supply chain data not found' });
        }

        const product = products.find(p => p.id === productId);

        res.json({
            ...scData,
            productName: product?.name,
            currentRiskScore: product?.riskScore,
            productStatus: product?.status
        });
    } catch (error) {
        console.error('Error in GET /api/supply-chain/:productId:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
