const mongoose = require('mongoose');
const { PROPERTY, USER, RESERVATION } = require('../constants/db.constant');
const { RESERVATION_STATUS, BOOKING_TYPE, PAYMENT_STATUS } = require('../constants/common.constant');

const reservationSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: PROPERTY,
        required: [true, 'Property id is required.']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
        required: [true, 'User id is required.']
    },
    checkIn: {
        type: Date,
        required: [true, 'Checkin Date and Time is required.']
    },
    checkOut: {
        type: Date,
        required: [true, 'Checkout Date and Time is required.']
    },
    guest: {
        type: Number,
        required: [true, 'No of Guest is required.'],
    },
    bookingType: {
        type: String,
        enum: Object.values(BOOKING_TYPE),
        required: [true, 'Booking Type is requried.']
    },
    finalAmount: {
        type: Number,
        required: [true, 'Final Amount is required.']
    },
    reservationStatus: {
        type: String,
        enum: Object.values(RESERVATION_STATUS),
        default: RESERVATION_STATUS.PEDNING,
        required: [true, 'Reservation status is Required.']
    },
    paymentStatus: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.PEDNING,
        required: [true, 'Reservation status is Required.']
    },
    razorpayOrderID: {
        type: String,
    },
    razorPayReferenceID: {
        type: String,
    },
    razorpayPaymentID: {
        type: String,
        // default: null,
    },
    razorPaySignature: {
        type: String,
        // default: null,
    },
    specialRequest: {
        type: String,
        default: null
    },
    cancellationReasons: {
        type: String,
        default: null,
        select: false
    },
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
        default: null,
        select: false
    }
}, { timestamps: true })
reservationSchema.index({ checkIn: 1 });
reservationSchema.index({ checkOut: 1 });
reservationSchema.index({ status: 1 });

const Reservation = mongoose.model(RESERVATION, reservationSchema)
module.exports = Reservation;

 