const Reservation = require("../../models/Reservation");

async function pendingReservationDetails(authUser, payload) {
    const { options = {}, filter = {} } = payload;
    const {
        page = 1,
        limit = 10,
        sort = { checkIn: -1 },
        select = "",
        search = {}
    } = options;
    const skip = (page - 1) * limit;
    const matchStage = {
        reservationStatus: "PENDING"
    };
    const pipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: "properties",
                localField: "property",
                foreignField: "_id",
                as: "property"
            }
        },
        { $unwind: "$property" },
        {
            $match: {
                "property.user": authUser._id,
                "property.deletedAt": null
            }
        },
        ...(search?.value && search?.keys?.length
			? [{
				$match: {
					$or: search.keys.map(key => ({
						[`property.${key}`]: {
							$regex: search.value,
							$options: "i"
						}
					}))
				}
			}]
			: []),
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "bookingUser"
            }
        },
        { $unwind: "$bookingUser" },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                _id: 1,
                checkIn: 1,
                checkOut: 1,
                finalAmount: 1,
                paymentStatus: 1,
                reservationStatus: 1,
                createdAt: 1,

                property: select
                    ? select.split(" ").reduce((acc, field) => {
                        acc[field] = `$property.${field}`;
                        return acc;
                    }, { _id: "$property._id" })
                    : {
                        _id: "$property._id",
                        title: "$property.title",
                        address: "$property.address",
                        pricePerDay: "$property.pricePerDay",
                        pricePerHours: "$property.pricePerHours",
                        images: "$property.images"
                    },

                bookingUser: {
                    _id: "$bookingUser._id",
                    fullName: "$bookingUser.fullName",
                    email: "$bookingUser.email"
                }
            }
        }
    ];

    const data = await Reservation.aggregate(pipeline);
    const countPipeline = pipeline.filter(
        stage => !stage.$skip && !stage.$limit
    );
    countPipeline.push({ $count: "total" });
    const countResult = await Reservation.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

module.exports = pendingReservationDetails;
