const createHttpError = require("http-errors");
const Property = require("../../models/Property");
const { ERRORS } = require("../../constants/errors.constants");
const Review = require("../../models/Review");

async function propertyReview(params) {
    const property = await Property.findById(params?.propertyId).lean();
    if (!property || property.deletedAt) throw new createHttpError[404](ERRORS.PROPERTY_NOTEXIST);

    const review = await Review.find({ property: property._id })
        .populate([{ path: 'user', select: 'fullName status' }]).select('-__v').lean();
    if (!review.length) return { data: review, message: 'No Reviews.' }
    return review;
}
module.exports = propertyReview;