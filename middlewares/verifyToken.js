const createHttpError = require("http-errors");
const { TOKENS } = require("../constants/authentication.constants");
const Token = require("../models/Token");
const User = require("../models/User");
const { USER_STATUS } = require("../constants/user.constants");
const { ERRORS } = require("../constants/errors.constants");

// middleware for the ACCESS TOKEN verification
const verifyToken = async (req, res, next) => {
    try {
        const authHeaders = req.headers.authorization;
        if (!authHeaders) throw new createHttpError(401, ERRORS.SESSION_EXPIRED);

        const token = authHeaders.split(' ')[1];

        const tokenFilter = { token: token, type: TOKENS.ACCESS_TOKEN.TYPE };
        const tokenExists = await Token.findOne(tokenFilter).lean();
        if (!tokenExists) throw new createHttpError(401, ERRORS.TOKEN_EXPIRED);

        const userSelect = 'password status';
        const user = await User.findById(tokenExists.userId).select(userSelect).lean();
        if (!user) throw new createHttpError(401, ERRORS.USER_NOT_FOUND);
        if (user.status !== USER_STATUS.VERIFIED) throw new createHttpError[400](ERRORS.NOT_ENABLED);

        const authUser = { _id: user._id };
        req.authUser = authUser;
        next();

    } catch (error) { return next(error); }
};

module.exports = verifyToken;