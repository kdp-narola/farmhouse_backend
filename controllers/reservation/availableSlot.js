const createHttpError = require("http-errors");
const Property = require("../../models/Property");
const { ERRORS } = require("../../constants/errors.constants");
const moment = require('moment');
const propertyAvailble = require("./propertyAvailble");
const calculatePrice = require("../property/calculatePrice");

async function availableSlot(params) {
    let { propertyId, checkIn, checkOut } = params;

    const property = await Property.findById(propertyId);
    if (!property) throw new createHttpError(400, ERRORS.PROPERTY_NOTEXIST);

    const totalPrice = await calculatePrice(property._id, checkIn, checkOut);

    checkIn = moment(checkIn).utc().toISOString();
    checkOut = moment(checkOut).utc().toISOString();
    const checkReservation = await propertyAvailble({ propertyId, checkIn, checkOut })
    console.log('object :>> ', checkReservation);
    if (checkReservation) return { isAvailable: false }
    return { isAvailable: true, totalPrice };
}
module.exports = availableSlot;