const pagination = require("../../helpers/pagination");
const Amenities = require("../../models/Amenities");

async function listAmenities(body) {
    const amenities = await pagination(Amenities, filter = {deletedAt : null}, population = [], body)
    return amenities;
}

// async function listAmenities(body) {
//     const amenities = await Amenities.aggregate([
//         { $match: { applicableTo: null } },
//         {
//             $graphLookup: {
//                 from: "amenities2",
//                 startWith: "$_id",
//                 connectFromField: "_id",
//                 connectToField: "applicableTo",
//                 as: "amenities",
//                 depthField: "depth"
//             }
//         },
//         {
//             $project: {
//                 label: 1,
//                 amenities: {
//                     $map: {
//                         input: "$amenities",
//                         as: 'a',
//                         in: { _id: '$$a._id', label: '$$a.label' }
//                     }
//                 }
//             }
//         }
//     ])
//     return amenities;
// }

module.exports = listAmenities;