const createHttpError = require("http-errors");
const pagination = require("../../helpers/pagination");
const Property = require("../../models/Property");
const User = require("../../models/User");
const { ERRORS } = require("../../constants/errors.constants");

async function pendingApprovalProperties(authUser, body) {
    const user = await User.findById(authUser._id).select("role").lean();
    if(!user) throw new createHttpError[404](ERRORS.USER_NOT_FOUND);

    const role = user.role;
    if(role === 'OWNER') {
      body.filter = { ...body?.filter, user: authUser._id, deletedAt: null, status: 'PENDING' };
    } else {
      body.filter = { ...body?.filter, deletedAt: null, status: 'PENDING' };
    }

    const property = await pagination(Property, body?.filter, body?.population, body);
    return property;
}

module.exports = pendingApprovalProperties;