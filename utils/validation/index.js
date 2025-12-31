const { body, param } = require("express-validator");
const { CUSTOMER, OWNER } = require("../../constants/role.constant");
const moment = require('moment');

module.exports = {
    REGISTER: [
        body('email').trim().toLowerCase().notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email address'),
        body('fullName').trim().notEmpty().withMessage('First name is required'),
        body('role').trim().notEmpty().isIn([CUSTOMER.role, OWNER.role]).withMessage('Role is in-correct'),
        body('password').trim().notEmpty().withMessage('Password is required')
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
            .withMessage('Password must be at least 6 characters long and include uppercase, lowercase, number, and symbol'),
    ],
    LOGIN: [
        body('email').trim().toLowerCase().notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email address'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    VERIFY_OTP: [
        body('otp').trim().notEmpty().withMessage('OTP is required').isString().withMessage('OTP must be a string')
    ],

    SET_PASSWORD: [
        body('password').trim().notEmpty().withMessage('Password is required')
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
            .withMessage('Password must be at least 6 characters long and include uppercase, lowercase, number, and symbol'),

        body('confirmPassword').trim().notEmpty().withMessage('Confirm password is required')
            .custom((value, { req }) => value === req.body.password).withMessage('Confirm password does not match password')
    ],
    FORGOT_PASSWORD: [
        body('email').trim().toLowerCase().notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email address')
    ],
    RESET_PASSWORD: [
        body('password').trim().notEmpty().withMessage('Password is required')
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
            .withMessage('Password must be at least 6 characters long and include uppercase, lowercase, number, and symbol'),

        body('confirmPassword').notEmpty().withMessage('Confirm password is required')
            .custom((value, { req }) => value === req.body.password).withMessage('Confirm password does not match password')
    ],
    CHANGE_PASSWORD: [
        body('oldPassword').trim().notEmpty().withMessage('Old password is required')
            .isString().withMessage('Old password must be a string').isLength({ min: 6 }).withMessage('Old password must be at least 6 characters'),

        body('password').trim().notEmpty().withMessage('New password is required').isString().withMessage('New password must be a string')
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
            .withMessage('New password must be at least 6 characters long and include uppercase, lowercase, number, and symbol'),

        body('confirmPassword').notEmpty().withMessage('Confirm password is required')
            .custom((value, { req }) => value === req.body.password).withMessage('Confirm password does not match new password')
    ],
    AMENITIES_CREATE: [
        body('label').trim().notEmpty().withMessage('Label is required.').isString().withMessage('Amenities must be a string.'),
        body('icon').trim().notEmpty().withMessage('Icon is required.').isString().withMessage('Icon must be a string.')
    ],
    AMENITIES_UPDATE: [
        body('label').trim().notEmpty().withMessage('Label is required.'),
        body('icon').trim().notEmpty().withMessage('Icon is required.').isString().withMessage('Icon must be a string.'),
        param('amenitiesId', 'valid amenitiesId is required in params.').trim().notEmpty().isMongoId()
    ],
    AMENITIES_DELETE: [
        param('amenitiesId', 'valid amenitiesId is required in params.').trim().notEmpty().isMongoId()
    ],
    CATEGORY_CREATE: [
        body('label').trim().notEmpty().withMessage('Label is required.').isString().withMessage('Amenities must be a string.')
    ],
    CATEGORY_UPDATE: [
        body('label').trim().notEmpty().withMessage('Label is required.'),
        param('categoryId', 'valid amenitiesId is required in params.').trim().notEmpty().isMongoId()
    ],
    CATEGORY_DELETE: [
        param('categoryId', 'valid amenitiesId is required in params.').trim().notEmpty().isMongoId()
    ],
    GET_PROPERTY: [
        param('propertyId', 'valid propertyId is required in params.').trim().notEmpty().isMongoId()
    ],
    CREATE_PROPERTY: [
        body('title').trim().notEmpty().withMessage('Title is required.').isLength({ min: 5 }).withMessage('Title must be at least 5 characters to create the property.'),
        body('description').trim().notEmpty().withMessage('Description is required.').isLength({ min: 10 }).withMessage('Description must be at least 10 characters to create the property.'),
        body('category', 'Valid category is required.').trim().notEmpty().isMongoId(),
        body('max_capacity').trim().notEmpty().withMessage('Maximum capacity is required.').isNumeric().withMessage('Maximum capacity must be a numeric value.'),
        body('noBedroom').trim().notEmpty().withMessage('Number of Bedrooms is required.').isNumeric().withMessage('Number of Bedrooms must be a numeric value.'),
        body('noBathroom').trim().notEmpty().withMessage('Number of Bathrooms is required.').isNumeric().withMessage('Number of Bathrooms must be a numeric value.'),
        body('area_sq').trim().notEmpty().withMessage('Area in square feet is required.').isNumeric().withMessage('Area must be a numeric value.'),
        body('pricePerDay').trim().notEmpty().withMessage('Price per day for the property is required.').isNumeric().withMessage('Price per day for the property must be a numeric value.'),
        body('pricePerHours').trim().notEmpty().withMessage('Price per hours for the property is required.').isNumeric().withMessage('Price per hours for the property must be a numeric value.'),
        body('addressLine').trim().notEmpty().withMessage('Address line is required.').isString().withMessage('Address line must be a string.'),
        body('pincode').trim().notEmpty().withMessage('Pincode is required.').isPostalCode('any').withMessage('Pincode must be a valid postal code.'),
        body('street').trim().notEmpty().withMessage('Street is required.').isString().withMessage('Street must be a string.'),
        body('state').trim().notEmpty().withMessage('State is required.').isString().withMessage('State must be a string.'),
        body('city').trim().notEmpty().withMessage('City is required.').isString().withMessage('City must be a string.'),
        body('district').trim().notEmpty().withMessage('District is required.').isString().withMessage('District must be a string.'),
        body('landMark').trim().optional().isString().withMessage('Landmark must be a string.'),
        body('mapLink').trim().notEmpty().withMessage('Map Link is required.').isURL().withMessage('Map link must be a valid URL.'),
        body('amenities').trim().notEmpty().withMessage('Aementites are required.').isArray({ min: 2 }).withMessage('Amenities must be an array of MongoObjectId.'),
        // body('houserule').trim().notEmpty().withMessage('House Rule are required.').isArray({ min: 2 }).withMessage('House Rule must be an array of MongoObjectId.'),
        body('additionalHouserules').trim().optional().isString().withMessage('Additional House Rules Must be a string.').isLength({ min: 10 }).withMessage('Minimum 10 character required to add Additional House Rules.')
    ],
    UPDATE_PROPERTY: [
        param('propertyId', 'valid propertyId is required in params.').trim().notEmpty().isMongoId(),
        body('title').trim().notEmpty().withMessage('Title is required.').isLength({ min: 5 }).withMessage('Title must be at least 5 characters to create the property.'),
        body('description').trim().notEmpty().withMessage('Description is required.').isLength({ min: 10 }).withMessage('Description must be at least 10 characters to create the property.'),
        body('category', 'Valid category is required.').trim().notEmpty().isMongoId(),
        body('max_capacity').trim().notEmpty().withMessage('Maximum capacity is required.').isNumeric().withMessage('Maximum capacity must be a numeric value.'),
        body('noBedroom').trim().notEmpty().withMessage('Number of Bedrooms is required.').isNumeric().withMessage('Number of Bedrooms must be a numeric value.'),
        body('noBathroom').trim().notEmpty().withMessage('Number of Bathrooms is required.').isNumeric().withMessage('Number of Bathrooms must be a numeric value.'),
        body('area_sq').trim().notEmpty().withMessage('Area in square feet is required.').isNumeric().withMessage('Area must be a numeric value.'),
        body('pricePerDay').trim().notEmpty().withMessage('Price per day for the property is required.').isNumeric().withMessage('Price per day for the property must be a numeric value.'),
        body('pricePerHours').trim().notEmpty().withMessage('Price per hours for the property is required.').isNumeric().withMessage('Price per hours for the property must be a numeric value.'),
        body('addressLine').trim().notEmpty().withMessage('Address line is required.').isString().withMessage('Address line must be a string.'),
        body('pincode').trim().notEmpty().withMessage('Pincode is required.').isPostalCode('any').withMessage('Pincode must be a valid postal code.'),
        body('street').trim().notEmpty().withMessage('Street is required.').isString().withMessage('Street must be a string.'),
        body('state').trim().notEmpty().withMessage('State is required.').isString().withMessage('State must be a string.'),
        body('city').trim().notEmpty().withMessage('City is required.').isString().withMessage('City must be a string.'),
        body('district').trim().notEmpty().withMessage('District is required.').isString().withMessage('District must be a string.'),
        body('landMark').trim().optional().isString().withMessage('Landmark must be a string.'),
        body('mapLink').trim().notEmpty().withMessage('Map Link is required.').isURL().withMessage('Map link must be a valid URL.'),
        body('amenities').trim().notEmpty().withMessage('Aementites are required.').isArray({ min: 2 }).withMessage('Amenities must be an array of MongoObjectId.'),
        // body('houserule').trim().notEmpty().withMessage('House Rule are required.').isArray({ min: 2 }).withMessage('House Rule must be an array of MongoObjectId.'),
        body('removeImages').trim().optional(),
    ],
    CREATE_WISHLIST: [
        body('propertyId', 'valid propertyId is required in body.').trim().notEmpty().isMongoId()
    ],
    REMOVE_WISHLIST: [
        param('wishlistId', 'valid wishlistId is required in params.').trim().notEmpty().isMongoId()
    ],

    RESERVATION_CREATE: [
        body('propertyId').trim().notEmpty().withMessage('Property Id is required.').isMongoId().withMessage('Valid Property id is required in Body.'),
        body('guest').trim().notEmpty().withMessage('No of Guest is Required.')
            .isNumeric().withMessage('Guest must be numeric.')
            .custom(value => value > 0).withMessage('Number of guests must be greater than zero.')
            .notEmpty().withMessage('Special Request cannot be an empty string if provided'),
        body('specialRequest').trim().optional().isString().withMessage('Special Request must be a string'),
        body('checkIn').trim().notEmpty().withMessage('Check In Time is required.').isISO8601().withMessage('Please Enter Check In in valid Date Format')
            .custom((value, { req }) => {
                const checkInDate = moment(value).utc().toISOString();
                const checkOutDate = moment(req.body.checkOut).utc().toISOString();
                if (checkInDate >= checkOutDate) throw new Error('Check-in time must be before check-out time.');

                if (checkInDate < moment().utc().toISOString()) throw new Error('Check-in time must be in the future.');

                return true;
            }),
        body('checkOut').trim().notEmpty().withMessage('check Out Time is required.').isISO8601().withMessage('Please Enter Check Out in valid Date Format')
            .custom((value, { req }) => {
                const checkInDate = moment(req.body.checkIn).utc().toISOString();
                const checkOutDate = moment(value).utc().toISOString();
                if (checkOutDate <= checkInDate) throw new Error('Check-out time must be after check-in time.');
                return true;
            }),
    ],

    REVIEW_CREATE: [
        body('propertyId', 'valid propertyId is required in body.').trim().notEmpty().isMongoId(),
        body('rate').trim().notEmpty().withMessage('Rate is required.').isNumeric({ min: 1, max: 5 }).withMessage('Rate must be a numeric value.'),
        body('comments').trim().notEmpty().withMessage('Comments is required.').isString()
            .withMessage('Comments must be a string value.')
    ],

    AVAILABLE_SLOT: [
        body('propertyId').trim().notEmpty().withMessage('Property Id is required.').isMongoId().withMessage('Valid Property id is required in Body.'),
        body('checkIn').trim().notEmpty().withMessage('Check In Time is required.').isISO8601().withMessage('Please Enter Check In in valid Date Format')
            .custom((value, { req }) => {
                const checkInDate = moment(value).utc().toISOString();
                const checkOutDate = moment(req.body.checkOut).utc().toISOString();
                if (checkInDate >= checkOutDate) throw new Error('Check-in time must be before check-out time.');

                if (checkInDate < moment().utc().toISOString()) throw new Error('Check-in time must be in the future.');

                return true;
            })
        ,
        body('checkOut').trim().notEmpty().withMessage('check Out Time is required.').isISO8601().withMessage('Please Enter Check Out in valid Date Format')
            .custom((value, { req }) => {
                const checkInDate = moment(req.body.checkIn).utc().toISOString();
                const checkOutDate = moment(value).utc().toISOString();
                if (checkOutDate <= checkInDate) throw new Error('Check-out time must be after check-in time.');
                return true;
            }),
    ],
};

