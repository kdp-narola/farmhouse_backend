const Property = require("../../models/Property");
const Reservation = require("../../models/Reservation");

async function ownerBookingDetails(authUser, payload) {
  const { options = {}, filter = {} } = payload;

  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select = "",
    search = {}
  } = options;

  const { key } = filter;

  let matchStage = {};

  if (key === "owner") {
    const properties = await Property.find({
      user: authUser._id,
      deletedAt: null
    }).select("_id");

    matchStage.property = {
      $in: properties.map(p => p._id)
    };
  }

  if (key === "") {
    matchStage.user = authUser._id;
  }

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

    ...(search?.value && search?.keys?.length
      ? [
          {
            $match: {
              $or: search.keys.map(k => ({
                [`property.${k}`]: {
                  $regex: search.value,
                  $options: "i"
                }
              }))
            }
          }
        ]
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

    {
      $lookup: {
        from: "users",
        localField: "property.user",
        foreignField: "_id",
        as: "propertyOwner"
      }
    },
    { $unwind: "$propertyOwner" },

    { $sort: sort },

    {
      $group: {
        _id: "$property._id",

        property: { $first: "$property" },

        propertyOwner: {
          $first: {
            _id: "$propertyOwner._id",
            fullName: "$propertyOwner.fullName",
            email: "$propertyOwner.email"
          }
        },

        reservations: {
          $push: {
            _id: "$_id",
            checkIn: "$checkIn",
            checkOut: "$checkOut",
            finalAmount: "$finalAmount",
            reservationStatus: "$reservationStatus",
            paymentStatus: "$paymentStatus",
            bookingUser: {
              _id: "$bookingUser._id",
              fullName: "$bookingUser.fullName",
              email: "$bookingUser.email"
            }
          }
        }
      }
    },

    { $skip: (page - 1) * limit },
    { $limit: limit }
  ];

  if (select) {
    const project = {
      reservations: 1,
      propertyOwner: 1
    };

    select.split(" ").forEach(f => {
      project[`property.${f}`] = 1;
    });

    pipeline.push({ $project: project });
  }

  const data = await Reservation.aggregate(pipeline);

  const countPipeline = pipeline
    .filter(stage => !stage.$skip && !stage.$limit)
    .concat([{ $count: "total" }]);

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

module.exports = ownerBookingDetails;