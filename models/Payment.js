const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reservation',
        required: [true, 'Reservation is required.']
    },
   

}, { timestamps: true });

module.exports = mongoose.model('payment', paymentSchema);