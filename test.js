// const mongoose = require("mongoose");
// const paginationAggregation = require('../../helpers/aggregationPagination');
// const Property = require("../../models/Property");

// async function listProperty(body) {
//     if (body.filter) {
//         const filterArray = ['amenities', 'houserule', 'category'];
//         const filter = {};

//         filterArray.forEach(field => {
//             const filterField = body.filter[field];
//             const filterFieldIsArray = Array.isArray(filterField);

//             if (filterField && filterFieldIsArray && filterField.length > 0) {
//                 filter[field] = {
//                     $all: filterField.filter((id) => mongoose.isValidObjectId(id))
//                         .map((id) => new mongoose.Types.ObjectId(id))
//                 };
//             }

//             if (filterField && !filterFieldIsArray && mongoose.isValidObjectId(filterField)) {
//                 filter[field] = new mongoose.Types.ObjectId(body.filter[field])
//             }
//         });

//         if (body.filter?.pricePerDay && (body.filter?.pricePerDay?.minPrice || body.filter?.pricePerDay?.maxPrice)) {
//             filter.pricePerDay = {}
//             if (body.filter?.pricePerDay?.minPrice) filter.pricePerDay.$gte = body.filter?.pricePerDay?.minPrice;
//             if (body.filter?.pricePerDay?.maxPrice) filter.pricePerDay.$lte = body.filter?.pricePerDay?.maxPrice;
//         }
//         body.filter = filter;
//     }

//     if (body.population) {
//         body.population = [...body.population,
//         {
//             path: 'reviews',
//             localField: '_id',
//             foreignField: 'property',
//             addPipeline: { $addFields: { avgRate: { $avg: '$reviews.rate' } } }
//         },];
//     }

//     const property = await paginationAggregation(Property, { ...body.filter, deletedAt: null }, body?.population, body);

//     const filterInformation = await Property.aggregate([
//         {
//             $group: {
//                 _id: null, minPricePerDay: { $min: "$pricePerDay" }, maxPricePerDay: { $max: "$pricePerDay" },
//                 minPricePerHours: { $min: "$pricePerHours" }, maxPricePerHours: { $max: "$pricePerHours" }
//             }
//         },
//         {
//             $project: {
//                 _id: 0, pricePerDay: { minPrice: "$minPricePerDay", maxPrice: "$maxPricePerDay" },
//                 pricePerHours: { minPrice: "$minPricePerHours", maxPrice: "$maxPricePerHours" }
//             }
//         }
//     ]);

//     property.filterInformation = filterInformation[0];
//     return property;
// }
// module.exports = listProperty;

function streetLight() {

    const timestamps = {
        red: 4000,
        yellow: 500,
        green: 3000
    }

    const setTime = (time) => setTimeout(() => {
        console.log()
    })

    const array = Object.keys(timestamps);
    
    console.log(timestamps['red']);

    setTimeout(function () {
        current = 'yellow'
        console.log(current)
    }, 4000);

    setTimeout(function () {
        streetLight()
    }, 7500)
}

streetLight()
