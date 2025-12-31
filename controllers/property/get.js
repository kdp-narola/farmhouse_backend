const createHttpError = require("http-errors");
const Property = require("../../models/Property");
const { ERRORS } = require('../../constants/errors.constants');
const mongoose = require("mongoose");
const HouseRule = require("../../models/HouseRule");

async function getProeprtyDescription(params) {
    const propertyId = params?.propertyId;
    // const property = await Property.findById(propertyId).populate(['category', 'user', 'amenities', 'houserule']).select('-__v');
    var pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(propertyId), deletedAt: null } },
        { $lookup: { from: "category", localField: "_id", foreignField: "category", as: "category" } },
        { $lookup: { from: "amenities", localField: "amenities", foreignField: "_id", as: "amenities" } },
        { $lookup: { from: "reviews", localField: "_id", foreignField: "property", as: "reviews" } },
        { $unwind: { path: `$user`, preserveNullAndEmptyArrays: true } },
        { $unwind: { path: `$category`, preserveNullAndEmptyArrays: true } },
        { $addFields: { totalReviews: { $size: '$reviews' }, avgRate: { $avg: '$reviews.rate' } } },
        { $project: { reviews: 0 } }
    ]
    const property = await Property.aggregate(pipeline)
    if (!property.length || property[0].deletedAt) throw new createHttpError[404](ERRORS.PROPERTY_NOTEXIST);

    var pipeline = [
        { $match: { deletedAt: null } },
        {
            $lookup: {
                from: "properties", let: { ruleId: "$_id" },
                pipeline: [
                    { $match: { _id: new mongoose.Types.ObjectId(params?.propertyId) } },
                    { $match: { $expr: { $in: ["$$ruleId", "$houserule"] } } }
                ],
                as: "matched"
            }
        },
        { $addFields: { isAllowed: { $cond: { if: { $gt: [{ $size: "$matched" }, 0] }, then: false, else: true } } } },
        { $project: { label: 1, isAllowed: 1 } }]

    property[0].houserule = await HouseRule.aggregate(pipeline);
    return property[0];
}
module.exports = getProeprtyDescription;