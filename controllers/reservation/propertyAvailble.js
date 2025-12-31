const createHttpError = require("http-errors");
const { ERRORS } = require("../../constants/errors.constants");
const Reservation = require("../../models/Reservation");
const { RESERVATION_STATUS } = require("../../constants/common.constant");

async function propertyAvailable({ propertyId, checkIn, checkOut }) {
    if (!propertyId || !checkIn || !checkOut) throw new createHttpError[400](ERRORS.AVAILBLITYCHECK_MISSING_PARAM);

    const checkAvaibility = await Reservation.findOne({
        property: propertyId,
        reservationStatus: { $ne: RESERVATION_STATUS.CANCELLED },
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn }
    });
    console.log('checkAvaibility :>> ', checkAvaibility);
    return checkAvaibility;
}
module.exports = propertyAvailable;