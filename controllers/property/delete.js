const createHttpError = require("http-errors");
const Property = require("../../models/Property");
const { ERRORS } = require("../../constants/errors.constants");
const moment = require("moment");
const Reservation = require("../../models/Reservation");
const { RESERVATION_STATUS } = require("../../constants/common.constant");

async function deleteProperty(authUser, param) {
    const propertyId = param?.propertyId;
    const checkProperty = await Property.findOne({ _id: propertyId, user: authUser?._id }).select('deletedAt');
    if (!checkProperty || checkProperty.deletedAt) throw new createHttpError[404](ERRORS?.PROPERTY_NOTEXIST);

    const reservation = await Reservation.find({
        property: propertyId, checkIn: { $gte: moment().utc().toISOString() },
        status: { $ne: RESERVATION_STATUS.CANCELLED }
    });

    if (Array.isArray(reservation) && reservation.length) throw new createHttpError[403](ERRORS?.PROPERTY_NOT_DELETE);

    checkProperty.deletedAt = moment();
    await checkProperty.save();
    return checkProperty;
}

module.exports = deleteProperty;