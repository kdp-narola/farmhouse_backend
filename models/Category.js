const mongoose = require('mongoose');
const { CATEGORY } = require('../constants/db.constant');

const categorySchema = new mongoose.Schema({
    label: {
        type: String,
        required: [true, 'Label is Required.']
    },
    slug: {
        type: String,
        required: [true, 'Slug is Required.'], unique: [true, 'Category already exist.']
    },
}, { timestamps: true });

module.exports = mongoose.model(CATEGORY, categorySchema);