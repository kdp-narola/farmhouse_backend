const mongoose = require('mongoose');
const { USER_STATUS } = require('../constants/user.constants');
const { ADMIN, CUSTOMER, OWNER } = require('../constants/role.constant');
const { USER } = require('../constants/db.constant');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        required: [true, 'Email is required'],
        unique: [true, 'Email already in Use']
    },
    password: {
        type: String,
        select: false,
        required: [true, 'Password is required'],
        minLength: [6, 'Add minimum 6 characters in password']
    },
    fullName: {
        type: String,
        required: [true, 'FirstName is required']
    },
    lockUntil: {
        type: Date,
        default: null,
        select: false,
    },
    totalAttempts: {
        type: Number,
        min: 0,
        max: [3, 'TotalAttempts can not be more than 3'],
        default: 0,
        select: false
    },
    role: {
        type: String,
        enum: [ADMIN.role, CUSTOMER.role, OWNER.role],
        select: false
    },
    razorpayCustomerId: {
        type: String,
        required: [true, 'RazorPay Customer Id is required.']
    },
    razorpayFundAccountId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: Object.values(USER_STATUS), default: USER_STATUS.PENDING,
    },
}, { timestamps: true });

module.exports = mongoose.model(USER, userSchema);


