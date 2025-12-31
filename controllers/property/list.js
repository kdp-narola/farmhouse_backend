const mongoose = require("mongoose");
const paginationAggregation = require('../../helpers/aggregationPagination');
const Property = require("../../models/Property");

async function listProperty(body) {
    if (body.filter) {
        const filterArray = ['amenities', 'houserule', 'category'];
        const filter = {};

        filterArray.forEach(field => {
            if (body.filter[field] && Array.isArray(body.filter[field]) && body.filter[field].length) {
                filter[field] = {
                    $all: body.filter[field].filter((id) => mongoose.isValidObjectId(id)).map((id) => new mongoose.Types.ObjectId(id))
                }
            }
            if (body.filter[field] && !Array.isArray(body.filter[field]) && mongoose.isValidObjectId(body.filter[field])) {
                filter[field] = new mongoose.Types.ObjectId(body.filter[field])
            }
        });

        if (body.filter?.pricePerDay && (body.filter?.pricePerDay?.minPrice || body.filter?.pricePerDay?.maxPrice)) {
            filter.pricePerDay = {}
            if (body.filter?.pricePerDay?.minPrice) filter.pricePerDay.$gte = body.filter?.pricePerDay?.minPrice;
            if (body.filter?.pricePerDay?.maxPrice) filter.pricePerDay.$lte = body.filter?.pricePerDay?.maxPrice;
        }
        body.filter = filter;
    }

    if (body.population) {
        body.population = [...body.population,
        {
            path: 'reviews',
            localField: '_id',
            foreignField: 'property',
            addPipeline: { $addFields: { avgRate: { $avg: '$reviews.rate' } } }
        },];
    }

    const property = await paginationAggregation(Property, { ...body.filter, deletedAt: null }, body?.population, body);

    const filterInformation = await Property.aggregate([
        { $match: { deletedAt: null } },
        {
            $group: {
                _id: null, minPricePerDay: { $min: "$pricePerDay" }, maxPricePerDay: { $max: "$pricePerDay" },
                minPricePerHours: { $min: "$pricePerHours" }, maxPricePerHours: { $max: "$pricePerHours" }
            }
        },
        {
            $project: {
                _id: 0, pricePerDay: { minPrice: "$minPricePerDay", maxPrice: "$maxPricePerDay" },
                pricePerHours: { minPrice: "$minPricePerHours", maxPrice: "$maxPricePerHours" }
            }
        }
    ]);

    property.filterInformation = filterInformation[0];
    return property;
}
module.exports = listProperty;