const createHttpError = require("http-errors");
const { ERRORS } = require("../../constants/errors.constants");
const Amenities = require("../../models/Amenities");
const cretaSlug = require("../../utils/createSlug");

async function updateAmenities(body, params) {
    const { label, icon } = body;
    const amenitiesId = params?.amenitiesId;
    const slug = cretaSlug(label);
    const amenities = await Amenities.findById(amenitiesId);
    if (!amenities || amenities.deletedAt) throw new createHttpError[400](ERRORS?.AMENITIES_NOTEXIST);

    const checkSlug = await Amenities.findOne({ _id: { $ne: amenities?.id }, slug });
    if (checkSlug) throw new createHttpError[400](ERRORS?.AMENITIES_EXIST);

    amenities.label = label;
    amenities.slug = slug;
    amenities.icon = icon;
    await amenities.save();

    return { _id: amenities?.id, label: label }
}

// async function updateAmenities(body, params) {
//     const label = body?.label;
//     const amenitiesId = params?.amenitiesId;
//     const slug = cretaSlug(label);
//     const amenities = await Amenities.findById(amenitiesId);
//     if (!amenities) throw new createHttpError[400](ERRORS?.AMENITIES_NOTEXIST);

//     const checkSlug = await Amenities.findOne({ _id: { $ne: amenities?.id }, slug });
//     if (checkSlug) throw new createHttpError[400](ERRORS?.AMENITIES_EXIST);

//     const parentAmenites = await Amenities.find({ _id: { $in: applicableTo } });
//     if (parentAmenites?.length !== applicableTo?.length) throw new createHttpError[403]('Invalid Value of parent category');
//     applicableTo = parentAmenites.map((amenities) => amenities._id)

//     amenities.label = label;
//     amenities.slug = slug;
//     await amenities.save()
//     return { _id: amenities?.id, label: label }
// }
module.exports = updateAmenities;