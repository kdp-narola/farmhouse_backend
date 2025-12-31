const createHttpError = require("http-errors");
const Amenities = require("../../models/Amenities");
const cretaSlug = require("../../utils/createSlug");
const { ERRORS } = require("../../constants/errors.constants");

// async function cretaeAmenities(body) {
//     let { label, applicableTo } = body;
//     const slug = cretaSlug(label);

//     const findAmenities = await Amenities.findOne({ slug });
//     if (findAmenities) throw new createHttpError[400](ERRORS?.AMENITIES_EXIST);

//     const parentAmenites = await Amenities.find({ _id: { $in: applicableTo } });
//     if (parentAmenites?.length !== applicableTo?.length) throw new createHttpError[403]('Invalid Value of parent category');
//     applicableTo = parentAmenites.map((amenities) => amenities._id)

//     const amenities = await Amenities.create({ label, slug, applicableTo });
//     return amenities;
// }


async function cretaeAmenities(body) {
    let { label, icon } = body;
    const slug = cretaSlug(label);

    const findAmenities = await Amenities.findOne({ slug });
    if (findAmenities && !findAmenities.deletedAt) {
        throw new createHttpError[400](ERRORS?.AMENITIES_EXIST);
    }

    const findQuery = { slug };
    const updateQuery = { label, icon, deletedAt: null };
    const optionQuery = { upsert: true, new: true, runValidators: true }

    const amenities = await Amenities.findOneAndUpdate(findQuery, updateQuery, optionQuery)
        .select('label slug');
    return amenities;
}

module.exports = cretaeAmenities;