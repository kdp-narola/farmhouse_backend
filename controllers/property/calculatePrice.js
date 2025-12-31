const createHttpError = require("http-errors");
const moment = require('moment');
const Property = require("../../models/Property");
const { ERRORS } = require("../../constants/errors.constants");

async function calculatePrice(propertyId, checkIn, checkOut) {
    if (!propertyId || !checkIn || !checkOut) {
        throw new createHttpError[400]('Property ID, Check-In Time and Check-Out time requried.');
    }

    const property = await Property.findById(propertyId);
    if (!property || property.deletedAt) throw new createHttpError[400](ERRORS.PROPERTY_NOTEXIST);

    const hours = moment(checkOut).diff(moment(checkIn), 'hours');
    if (hours <= 0) throw new createHttpError[400]('Hours must be greater than 0');

    let price = 0;
    const pricePerDay = property.pricePerDay;
    const pricePerHours = property.pricePerHours;

    const parseFullDay = Math.floor(hours / 24);
    const remaingHours = hours % 24

    if (parseFullDay > 0) price += parseFullDay * pricePerDay;
    if (remaingHours > 0) price += remaingHours * pricePerHours;

    const finalAmount = price.toFixed(2);
    return finalAmount
}

module.exports = calculatePrice;