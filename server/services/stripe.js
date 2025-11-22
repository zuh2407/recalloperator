const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const processRefund = async (amount, currency, customerId) => {
    try {
        // For demo, create a test payment intent first, then refund it
        // In production, you'd refund an actual charge

        console.log(`[Stripe] Processing refund: $${amount / 100} ${currency.toUpperCase()}`);

        // Create a test PaymentIntent (simulating a previous purchase)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method: 'pm_card_visa', // Test payment method
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        });

        console.log(`[Stripe] ✅ Payment Intent created: ${paymentIntent.id}`);

        // Now create a refund
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntent.id,
            amount: amount,
            reason: 'requested_by_customer' // Product recall
        });

        console.log(`[Stripe] ✅ Refund processed: ${refund.id} - $${amount / 100}`);

        return {
            success: true,
            refundId: refund.id,
            amount: amount,
            currency: currency,
            status: refund.status
        };
    } catch (error) {
        console.error('[Stripe] ❌ Error processing refund:', error.message);
        return {
            success: false,
            error: error.message,
            amount: amount,
            currency: currency
        };
    }
};

module.exports = { processRefund };
