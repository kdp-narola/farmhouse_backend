const pagination = require("../../helpers/pagination");
const User = require("../../models/User");

async function allUsers(body) {
  body.options = body.options || {};
  body.options.pagination = true;
  body.options.page = Number(body.options.page) || 1;
  body.options.limit = Number(body.options.limit) || 10;
  body.options.select =
    "+role -razorpayCustomerId -razorpayFundAccountId -updatedAt -__v";

  const allowedFilters = ["fullName", "role", "status"];
  const obj = body.filter || {};

  const filter = allowedFilters.reduce(
    (acc, key) => (obj[key] ? { ...acc, [key]: obj[key] } : acc),
    {}
  );

  const paginatedResult = await pagination(
    User,
    filter,
    body.population,
    body
  );

  const roleWiseAgg = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  const roleWiseCount = roleWiseAgg.reduce((acc, cur) => {
    acc[cur._id] = cur.count;
    return acc;
  }, {});

  const totalUserCount = await User.countDocuments();

  const page = body.options.page;
  const limit = body.options.limit;
  const total = paginatedResult.total ?? totalUserCount;

  return {
    data: paginatedResult.data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    roleWiseCount,
    totalUserCount,
  };
}

module.exports = allUsers;