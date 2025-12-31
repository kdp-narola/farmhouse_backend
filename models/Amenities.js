const mongoose = require('mongoose');
const { AMENITIES } = require('../constants/db.constant');

const amenitiesSchema = new mongoose.Schema({
    label: {
        type: String,
        required: [true, 'Key is Required.']
    },
    slug: {
        type: String,
        required: [true, 'Slug is Required.'], unique: [true, 'This Ameniti already exist.']
    },
    icon: {
        type: String,
        required: [true, 'Icon is required.']
    },
    deletedAt:{
        type: Date,
        default: null
    }
    // applicableTo: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'amenities',
    //     default: null,
    // }]
    
}, { timestamps: true });


module.exports = mongoose.model(AMENITIES, amenitiesSchema);