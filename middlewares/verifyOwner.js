const createHttpError = require("http-errors");
const { ERRORS } = require("../constants/errors.constants");
const { CUSTOMER } = require("../constants/role.constant");
const { USER_STATUS } = require("../constants/user.constants");
const User = require("../models/User");

const verifyOwner = async (req, res, next) => {
    try {
        const authUser = req.authUser;
        const userSelect = 'role status';

        const user = await User.findById(authUser._id).select(userSelect).lean();
        if (!user) throw new createHttpError(401, ERRORS.USER_NOT_FOUND);
        if (user.status !== USER_STATUS.VERIFIED) throw new createHttpError[400](ERRORS.NOT_ENABLED);
        if (user.role === CUSTOMER.role) throw new createHttpError[401](ERRORS.ADMIN_OWNER_ONLY);
        next()
    } catch (error) { next(error) }
}
module.exports = verifyOwner;