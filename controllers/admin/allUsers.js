const { USER_STATUS } = require('../../constants/user.constants');
const pagination = require("../../helpers/pagination");
const User = require("../../models/User");

async function allUsers(body) {
    var arr = ['fullName', 'role', 'status'];
    var obj = body?.filter;
    let select = (arr, obj) => arr.reduce((r, e) => Object.assign(r, obj[e] ? { [e]: obj[e] } : null), {});
    const filter = select(arr, obj) || null;

    body.options.select = '+role -razorpayCustomerId -razorpayFundAccountId -updatedAt -__v'
    const users = await pagination(User, filter, body?.population, body);

    const count = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
    users.roleWiseCount = count.reduce((a, c) => { a[c._id] = c.count; return a }, {});
    users.totalUserCount = await User.countDocuments()
    return users;
}

module.exports = allUsers;