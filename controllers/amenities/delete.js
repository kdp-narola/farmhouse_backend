const createHttpError = require("http-errors");
const Amenities = require("../../models/Amenities");
const { ERRORS } = require("../../constants/errors.constants");
const moment = require('moment');

async function deleteAmenities(params) {
    const amenitiesId = params?.amenitiesId;
    const amenities = await Amenities.findById(amenitiesId);
    if (!amenities || amenities.deletedAt) throw new createHttpError(400, ERRORS.AMENITIES_NOTEXIST);

    const currentTime = moment().utc()
    amenities.deletedAt = currentTime.toISOString();
    await amenities.save();
    return { ...amenities, deletedAt: currentTime.format('LLL') };
}
module.exports = deleteAmenities;

