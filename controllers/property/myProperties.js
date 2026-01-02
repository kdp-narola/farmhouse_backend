const { PROPERTY_STATUS } = require("../../constants/common.constant");
const pagination = require("../../helpers/pagination");
const Property = require("../../models/Property");

async function myProperties(authUser, body) {
    body.filter = { ...body?.filter, user: authUser._id, deletedAt: null };

    const property = await pagination(Property, body?.filter, body?.population, body);
    return property;
}

module.exports = myProperties;