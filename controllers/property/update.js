const createHttpError = require("http-errors");
const Property = require("../../models/Property");
const imageUpload = require("../../utils/images/imageUpload");
const { ERRORS } = require("../../constants/errors.constants");
const unlinkImages = require("../../utils/images/unlinkImages");
const Amenities = require("../../models/Amenities");
const HouseRule = require("../../models/HouseRule");

async function upadateProperty(authUser, body, files, params) {
    let { title, description, category, max_capacity, noBedroom, noBathroom, area_sq, pricePerDay, pricePerHours,
        amenities, houserule, houseruleFromOwner,
        addressLine, pincode, street, state, city, district, landMark, mapLink, removedImages } = body;
    let images = files?.images;

    const findProperty = await Property.findById(params?.propertyId);
    if (!findProperty || findProperty.deletedAt) throw new createHttpError[404](ERRORS.PROPERTY_NOTEXIST);
    if (findProperty.user.toString() !== authUser._id.toString()) throw new createHttpError[404]("You are aunauthorixed to update this property.");

    const checkAmenities = await Amenities.distinct('_id', { _id: { $in: amenities } });
    if (!checkAmenities.length) throw new createHttpError[403](ERRORS.AMENITIES_NOTEXIST);

    houserule = (houserule && Array.isArray(houserule)) ? houserule : [houserule];
    const checkHouseRule = await HouseRule.distinct('_id', { _id: { $in: houserule }, deletedAt: null });
    console.log('checkHouseRule :>> ', checkHouseRule);
    const updateQuery = {
        title,
        description,
        category,
        max_capacity,
        area_sq,
        noBedroom,
        noBathroom,
        pricePerDay,
        pricePerHours,
        houseruleFromOwner,
        amenities: checkAmenities,
        address: { addressLine, pincode, street, state, city, district, landMark, mapLink },
    };
    if (checkHouseRule && checkHouseRule.length) updateQuery.houserule = checkHouseRule;
    console.log('updateQuery :>> ', updateQuery);
    updateQuery.images = [];

    if (removedImages) {
        const removedImagesArray = Array.isArray(removedImages) ? removedImages : [removedImages]
        findProperty.images = findProperty.images.filter(img => !removedImagesArray.includes(img));
        await unlinkImages(removedImagesArray);
    }

    if (images) {
        const uploadedImage = await imageUpload(images);
        updateQuery.images.push(...uploadedImage);
    }

    updateQuery.images.push(...findProperty.images);
    const populateOption = [{ path: 'houserule', select: '_id label' }, { path: 'amenities', select: '_id label' }];
    const property = await Property.findByIdAndUpdate(params?.propertyId,
        updateQuery, { new: true, runValidators: true }).populate(populateOption);

    return property;
}
module.exports = upadateProperty;