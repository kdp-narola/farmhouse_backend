const createHttpError = require("http-errors");
const Property = require("../../models/Property");
const { ERRORS } = require("../../constants/errors.constants");
const Review = require("../../models/Review");

async function createReview(authUser, body) {
    const { propertyId, rate, comments } = body;

    const property = await Property.findById(propertyId);
    if (!property || property.deletedAt) throw new createHttpError[404](ERRORS.PROPERTY_NOTEXIST);

    const findQuery = { property: property?._id, user: authUser?._id };
    const updateQuery = { rate, comments };
    const options = { new: true, upsert: true, runValidators: true };

    const review = await Review.findOneAndUpdate(findQuery, updateQuery, options);
    return review;
}
module.exports = createReview;