const mongoose = require('mongoose');
const { HOUSERULE } = require('../constants/db.constant');

const houseRuleSchema = new mongoose.Schema({
    label: {
        type: String,
        required: [true, 'Label is Required.']
    },
    slug: {
        type: String,
        required: [true, 'Slug is Required.'],
        unique: [true, 'Category already exist.']
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model(HOUSERULE, houseRuleSchema);
