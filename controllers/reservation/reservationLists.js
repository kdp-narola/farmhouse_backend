const Reservation = require("../../models/Reservation");
const User = require("../../models/User");

async function reservationLists(authUser, payload) {
  const { options = {} } = payload;

  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select = "",
    search = {}
  } = options;

  const skip = (page - 1) * limit;

  const user = await User.findById(authUser._id).select("role").lean();
  if (!user) throw new Error("User not found");

  const role = user.role;

  const matchStage = {};

  if (role === "CUSTOMER") {
    matchStage.user = authUser._id;
  }

 const pipeline = [
  { $match: matchStage },

  // 🔹 ALWAYS populate property
  {
    $lookup: {
      from: "properties",
      localField: "property",
      foreignField: "_id",
      as: "property"
    }
  },
  { $unwind: "$property" },

  // 🔹 OWNER / ADMIN restriction
  ...(role !== "CUSTOMER"
    ? [
        {
          $match: {
            "property.user": authUser._id,
            "property.deletedAt": null
          }
        }
      ]
    : []),

  // 🔹 SEARCH (property-based)
  ...(search?.value && search?.keys?.length
    ? [
        {
          $match: {
            $or: search.keys.map(key => ({
              [`property.${key}`]: {
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
        ? select.split(" ").reduce(
            (acc, field) => ({
              ...acc,
              [field]: `$property.${field}`
            }),
            { _id: "$property._id" }
          )
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

module.exports = reservationLists;