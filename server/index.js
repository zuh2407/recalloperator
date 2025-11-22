const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const logRoutes = require('./routes/logs');
const customerRoutes = require('./routes/customers');
const supplyChainRoutes = require('./routes/supplyChain');
const agentRoutes = require('./routes/agent');
const { startAgent } = require('./agent');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/supply-chain', supplyChainRoutes);
app.use('/api/agent', agentRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Product Recall AI Server is Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Frontend: http://localhost:5174`);

    // Start the AI Agent after 2 seconds
    setTimeout(() => {
        startAgent();
    }, 2000);
});
