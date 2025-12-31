const paymentFailed = require('../controllers/webhook/paymentFailed');
const orderPaid = require('../controllers/webhook/orderPaid');
const verifySignature = require('../controllers/webhook/verifySignature');
const asyncHandler = require('../utils/asyncHandler');

const express = require('express')
const router = express.Router();

router.use(express.raw({ type: 'application/json' }));
router.post('/razorpay', asyncHandler(async function _razorPayWebhook(req, res, next) {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const payload = req.body;

    if (!verifySignature(payload, webhookSignature)) {
        console.error('Invalid signature');
        return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(payload.toString());
    switch (event.event) {
        case 'order.paid':
            orderPaid(event);
            break;

        case 'payment.failed':
            paymentFailed(event);
            break;

        default:
            console.log(`Unhandled event: ${event.event}`);
    }

    return res.status(200).json({ status: 'success' });
}))

module.exports = router;