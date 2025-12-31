const mongoose = require('mongoose');
const { REVIEW, USER, PROPERTY } = require('../constants/db.constant');

const reviewSchema = new mongoose.Schema({
    rate: {
        type: Number,
        required: [true, 'Rate is required.'],
        min: 1,
        max: 5
    },
    comments: {
        type: String,
        required: [true, 'Comments is required.'],
        min: [5, 'Minimum 5 Character is required.'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
        required: [true, 'User is required.']
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: PROPERTY,
        required: [true, 'Property is required.']
    }
});

reviewSchema.index({ property: 1, user: 1 });

module.exports = mongoose.model(REVIEW, reviewSchema);

