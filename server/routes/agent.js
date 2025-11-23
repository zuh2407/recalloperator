const express = require('express');
const router = express.Router();
const { startAgent, stopAgent, getStatus, runAgentCycle } = require('../agent');

// Get agent status
router.get('/status', (req, res) => {
    try {
        const status = getStatus();
        res.json(status);
    } catch (error) {
        console.error('Error getting agent status:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start agent
router.post('/start', (req, res) => {
    try {
        startAgent();
        res.json({ message: 'AI Agent started', isRunning: true });
    } catch (error) {
        console.error('Error starting agent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Stop agent
router.post('/stop', (req, res) => {
    try {
        stopAgent();
        res.json({ message: 'AI Agent stopped', isRunning: false });
    } catch (error) {
        console.error('Error stopping agent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Trigger single agent cycle (tick)
router.post('/tick', async (req, res) => {
    try {
        const result = await runAgentCycle(req.body.products);
        res.json(result);
    } catch (error) {
        console.error('Error running agent cycle:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
