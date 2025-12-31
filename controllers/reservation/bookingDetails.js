const createHttpError = require("http-errors");
const Property = require("../../models/Property");
const { ERRORS } = require("../../constants/errors.constants");
const Reservation = require("../../models/Reservation");

async function bookingDetails(authUser, params) {
    const propertyId = params?.propertyId;

    const property = await Property.findOne({ _id: propertyId, user: authUser._id });
    if (!property || property.deletedAt) throw new createHttpError[401](ERRORS.PROPERTY_NOTEXIST);

    const reservation = await Reservation.find({ property: property?._id }).sort({ checkIn: 1 }).populate(['user']);

    return reservation;
}
module.exports = bookingDetails; 