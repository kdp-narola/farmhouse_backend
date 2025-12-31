const createHttpError = require("http-errors");
const Property = require("../../models/Property");
const { ERRORS } = require("../../constants/errors.constants");
const calculatePrice = require("../property/calculatePrice");
const propertyAvailable = require("./propertyAvailble");
const { BOOKING_TYPE } = require("../../constants/common.constant");
const razorpay = require("../../config/razorpay");
const crypto = require('crypto');
const Reservation = require("../../models/Reservation");
const User = require("../../models/User");
const moment = require('moment');
const axios = require('axios');
async function bookProperty(authUser, body) {
    let { propertyId, checkIn, checkOut, guest, specialRequest, bookingType } = body;

    if (!Object.hasOwn(BOOKING_TYPE, bookingType)) {
        throw new createHttpError(400, 'Invalid Booking Type.')
    }

    const property = await Property.findById(propertyId);
    if (!property || property.deletedAt) throw new createHttpError[400](ERRORS.PROPERTY_NOTEXIST);
    if (property.max_capacity < guest) {
        throw new createHttpError[400](`Maximum ${property.max_capacity} person are allowed.`);
    }

    var params = {
        propertyId: property?._id,
        checkIn: moment(checkIn).utc().toISOString(),
        checkOut: moment(checkOut).utc().toISOString()
    };
    const propertyAvailble = await propertyAvailable(params);
    if (propertyAvailble) throw new createHttpError[400]("Property Not Available during this period of time.");

    const finalAmount = await calculatePrice(property?._id, checkIn, checkOut);
    if (!finalAmount) throw new createHttpError[403]('Final Amount is required to Book Reservation');

    const user = await User.findById(authUser._id);
    if (!user) throw new User.createHttpError(401, ERRORS.USER_NOT_EXISTS);

    const reservation = new Reservation({
        property: property?._id || propertyId,
        user: authUser._id,
        checkIn: moment(checkIn).utc().toISOString(),
        checkOut: moment(checkOut).utc().toISOString(),
        guest: guest,
        finalAmount: finalAmount,
        specialRequest: specialRequest ? specialRequest : null,
        bookingType: BOOKING_TYPE[bookingType]
    });

    const options = {
        amount: finalAmount * 100,
        currency: 'INR',
        receipt: `ORD_${crypto.randomUUID()}`,
        notes: { reservationId: reservation._id },
        cod_fee: 1500,
        customer_details: { email: user?.email, name: user?.fullName },
    }

    try {
        const order = await razorpay.orders.create(options);
        reservation.razorPayReferenceID = order.receipt;
        reservation.razorpayOrderID = order.id;
        console.log("reservation",reservation)

        await reservation.save()
        return { orderId: order.id, customerId: user.razorpayCustomerId, timeout: 100 }
    } catch (error) {
        console.log('error :>> ', error);
        throw new createHttpError[403]('Payment Gatway ERROR:')
    }
}

module.exports = bookProperty;