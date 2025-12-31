const mongoose = require('mongoose');
const { PAYOUT } = require('../constants/db.constant');

const payoutSchma = new mongoose.Schema({
    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Reservation ID is required.']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required.']
    },
    isPayOut: {
        type: Boolean,
        default: false,
        required: [true, 'isPayout is required.']
    },
    payoutReferenceId: {
        type: String,
        required: [true, 'Payout Reference ID is required.']
    },
    razorpayIdempotencyKey: {
        type: String,
        default: null
    }
})
module.exports = mongoose.model(PAYOUT, payoutSchma);