const mongoose = require('mongoose');
const { USER, AMENITIES, PROPERTY, HOUSERULE } = require('../constants/db.constant');
const { PROPERTY_STATUS } = require('../constants/common.constant');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is Required.'],
    },
    description: {
        type: String,
        required: [true, 'Description is Required.']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: [true, 'Category is Requried.'],
    },
    max_capacity: {
        type: Number,
        required: [true, 'Maximum Capacity of person is required to add Property.']
    },
    area_sq: {
        type: Number,
        required: [true, 'Area is required to add Property.']
    },
    pricePerDay: {
        type: Number,
        required: [true, 'A price per day is required to add Property.']
    },
    pricePerHours: {
        type: Number,
        required: [true, 'A price per hours is required to add Property.']
    },
    noBedroom: {
        type: Number,
        required: [true, 'Number of Badroom required.']
    },
    noBathroom: {
        type: Number,
        required: [true, 'Number of Bathroom required.']
    },
    images: {
        type: Array,
        required: [true, "Images of Property is Required."]
    },
    amenities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: AMENITIES,
        required: [true, 'Amenities is required.']
    }],
    houseruleFromOwner: {
        type: String,
        default: null
    },
    houserule: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: HOUSERULE,
        default: null
        // required: [true, 'House rule is required.']
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
        required: [true, 'User is required to add Property']
    },
    address: {
        addressLine: {
            type: String,
            required: [true, 'Addreess Line is required.']
        },
        pincode: {
            type: Number,
            required: [true, 'Pincode is required.']
        },
        street: {
            type: String,
            required: [true, 'Street is Required.'],
        },
        state: {
            type: String,
            required: [true, 'State is Required.'],
        },
        city: {
            type: String,
            required: [true, 'City is Required.'],
        },
        district: {
            type: String,
            required: [true, 'District is Required.'],
        },
        landMark: {
            type: String,
            default: null
        },
        mapLink: {
            type: String,
            required: [true, 'Google Map Link is required.']
        },
    },
    status: {
        type: String,
        enum: Object.values(PROPERTY_STATUS),
        default: PROPERTY_STATUS.PEDNING,
        required: [true, 'Property status is Required.']
    },
    deletedAt: {
        type: Date,
        default: null,
        select: false
    }

}, { timestamps: true });

propertySchema.index({ 'address.city': 1, 'address.state': 1 });
propertySchema.index({ pincode: 1 });
propertySchema.index({ pricePerDay: 1 });
propertySchema.index({ pricePerHours: 1 });
propertySchema.index({ amenities: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ pricePerDay: 1, max_capacity: 1, 'address.city': 1 });

module.exports = mongoose.model(PROPERTY, propertySchema);