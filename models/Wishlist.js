const mongoose = require('mongoose');
const { WISHLIST, USER, PROPERTY } = require('../constants/db.constant');

const wishlistSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: PROPERTY,
        required: [true, 'Property id is required.']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
        required: [true, 'User id is required.']
    }
}, { timestamps: true, versionKey: false });

wishlistSchema.index({ user: 1 })
wishlistSchema.index({ user: 1, property: 1 })
module.exports = mongoose.model(WISHLIST, wishlistSchema);