const { products, customers, logs } = require('./db');
const { processRefund } = require('./services/stripe');
const { sendRecallEmail } = require('./services/sendgrid');

let isRunning = false;
let intervalId = null;

const startAgent = () => {
    if (isRunning) return;
    isRunning = true;
    console.log('🤖 AI Agent Started: Continuous Risk Monitoring (0-10 scale)...');
    console.log('📧 Emails will be sent CONTINUOUSLY when risk ≥8');
    console.log('🔄 Risk scores fluctuate every 3 seconds');

    intervalId = setInterval(async () => {
        await monitorRisks();
    }, 3000); // Check every 3 seconds
};

const stopAgent = () => {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(intervalId);
    console.log('🛑 AI Agent Stopped.');
};

const monitorRisks = async (clientProducts = null) => {
    // Use client products if provided (for Vercel statelessness), otherwise use in-memory
    const targetProducts = clientProducts || products;
    const newLogs = [];

    // 1. Fluctuate Scores (Aggressive for demo)
    targetProducts.forEach(p => {
        if (p.status !== 'Recalled') {
            // More aggressive fluctuation: -3 to +3 for faster demo
            const change = Math.floor(Math.random() * 7) - 3;
            let newScore = p.riskScore + change;
            newScore = Math.max(0, Math.min(10, newScore)); // Clamp 0-10

            if (newScore !== p.riskScore) {
                p.riskScore = newScore;
                // Log significant changes
                if (Math.abs(change) >= 2) {
                    console.log(`📊 Risk Change: ${p.name} → ${newScore} (${change > 0 ? '+' : ''}${change})`);
                }
            }
        }
    });

    // 2. Perception: Check for CRITICAL risk (≥ 8)
    const riskyProducts = targetProducts.filter(p => p.riskScore >= 8 && p.status !== 'Recalled');

    if (riskyProducts.length > 0) {
        for (const product of riskyProducts) {
            console.log(`\n🚨 CRITICAL RISK DETECTED: ${product.name} (Score: ${product.riskScore})`);

            // 3. Reasoning: Identify affected customers
            const affectedCustomers = customers.filter(c =>
                c.businessId === product.businessId &&
                c.purchasedProducts.includes(product.id)
            );

            console.log(`👥 Identified ${affectedCustomers.length} affected customers`);

            // 4. Action: Process refunds and send emails (CONTINUOUSLY)
            const logEntry = {
                timestamp: new Date(),
                type: 'RISK_DETECTED',
                businessId: product.businessId,
                message: `Critical Risk (Score ${product.riskScore}) detected for ${product.name}. Processing actions...`
            };
            logs.push(logEntry);
            newLogs.push(logEntry);

            for (const customer of affectedCustomers) {
                // Calculate refund amount
                const refundAmount = Math.round(product.price * 100);

                // Process Refund via Stripe
                console.log(`💳 Processing Stripe refund for ${customer.name}...`);
                const refundResult = await processRefund(refundAmount, 'usd', customer.id);

                // Send Email with refund details
                console.log(`📧 Sending email to ${customer.email}...`);
                const emailResult = await sendRecallEmail(
                    customer.email,
                    product.name,
                    customer.name,
                    refundAmount
                );

                const actionLog = {
                    timestamp: new Date(),
                    type: 'ACTION_TAKEN',
                    businessId: product.businessId,
                    message: `Refunded $${(refundAmount / 100).toFixed(2)} & Emailed ${customer.name} for ${product.name}`,
                    details: {
                        refund: refundResult,
                        email: emailResult,
                        refundAmount: refundAmount
                    }
                };
                logs.push(actionLog);
                newLogs.push(actionLog);

                console.log(`✅ Actions completed for ${customer.name}`);
            }

            console.log(`\n📝 Total actions logged: ${logs.length}\n`);
        }
    }

    return { products: targetProducts, logs: newLogs };
};

// Simulation Helper: Force a product to Critical Risk (≥ 8)
const simulateRiskEvent = (businessId) => {
    const businessProducts = products.filter(p => p.businessId === businessId && p.status !== 'Recalled');

    if (businessProducts.length > 0) {
        const randomProduct = businessProducts[Math.floor(Math.random() * businessProducts.length)];
        randomProduct.riskScore = 9; // Jump to 9

        console.log(`⚡ SIMULATION: ${randomProduct.name} spiked to 9`);
        logs.push({
            timestamp: new Date(),
            type: 'SIMULATION',
            businessId: businessId,
            message: `Simulated Risk Spike for ${randomProduct.name} (Score: 9)`
        });
        return randomProduct;
    }
    return null;
};

// Get monitoring status
const getStatus = () => {
    return { isRunning };
};

// Run a single cycle of risk monitoring (for Vercel/Serverless)
const runAgentCycle = async (clientProducts = null) => {
    console.log('🔄 Running single agent cycle...');
    const result = await monitorRisks(clientProducts);
    return { success: true, message: 'Agent cycle completed', ...result };
};

module.exports = { startAgent, stopAgent, simulateRiskEvent, getStatus, runAgentCycle };
