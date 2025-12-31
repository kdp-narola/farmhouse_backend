const createHttpError = require("http-errors");
const { ADMIN } = require("../constants/role.constant");
const { USER_STATUS } = require("../constants/user.constants");
const User = require("../models/User");
const { ERRORS } = require("../constants/errors.constants");

const verifyAdmin = async (req, res, next) => {
    try {
        const authUser = req.authUser;
        const userSelect = 'role status';

        const user = await User.findById(authUser._id).select(userSelect).lean();
        if (!user) throw new createHttpError(401, ERRORS.USER_NOT_FOUND);
        if (user.status !== USER_STATUS.VERIFIED) throw new createHttpError[400](ERRORS.NOT_ENABLED);
        if (user.role !== ADMIN.role) throw new createHttpError[401](ERRORS.ADMIN_ONLY);

        next()
    } catch (error) { next(error) }
}

module.exports = verifyAdmin;