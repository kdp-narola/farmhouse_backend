const createHttpError = require("http-errors");
const { ERRORS } = require("../../constants/errors.constants");
const Amenities = require("../../models/Amenities");
const Property = require("../../models/Property");
const imageUpload = require("../../utils/images/imageUpload");
const HouseRule = require("../../models/HouseRule");

async function publishProperty(authUser, body, files) {
    let { title, description, category, max_capacity, noBedroom, noBathroom, area_sq, pricePerDay, houserule, pricePerHours, amenities,
        houseruleFromOwner } = body;
    const { addressLine, pincode, street, state, city, district, landMark, mapLink } = body;
    let images = files?.images;


    let checkAmenities = await Amenities.distinct('_id', { _id: { $in: amenities } });
    if (!checkAmenities.length) throw new createHttpError[403](ERRORS.AMENITIES_NOTEXIST);

    houserule = (houserule && Array.isArray(houserule)) ? houserule : [houserule];
    const checkHouseRule = await HouseRule.distinct('_id', { _id: { $in: houserule } });

    images = await imageUpload(images);
    const propertyPayload = {
        title, description, category, max_capacity, area_sq, noBedroom, noBathroom, pricePerDay, pricePerHours,
        amenities: checkAmenities, user: authUser._id, images,
        address: { addressLine, pincode, street, state, city, district, landMark, mapLink, houseruleFromOwner },
    }
    if (checkHouseRule && checkHouseRule.length) propertyPayload.houserule = checkHouseRule;
    const property = await Property.create(propertyPayload);

    return property
}
module.exports = publishProperty;