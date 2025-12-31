const crypto = require('crypto');
function generateSignature(payload, type) {
    switch (type) {
        case 'nonwebhook':
            SECERT = process.env.RAZORPAY_KEY_SECRET;
        case 'webhook':
            SECERT = process.env.RAZORPAY_WEBHOOK_SECRET;
    }
    return crypto
        .createHmac('sha256', SECERT)
        .update(payload)
        .digest('hex');
}

module.exports = generateSignature;