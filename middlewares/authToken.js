const createHttpError = require("http-errors");
const moment = require('moment');
const { TOKENS } = require("../constants/authentication.constants");
const Token = require("../models/Token");
const User = require("../models/User");
const { ERRORS } = require("../constants/errors.constants");

const auth = async (req, res, next) => {

    // used for Tokens that are not ACCESS TOKEN
    try {
        const authHeaders = req.headers.authorization;
        if (!authHeaders) throw new createHttpError(401, ERRORS.SESSION_EXPIRED);

        const token = authHeaders.split(' ')[1];

        const tokenFilter = { token: token, $or: [{ type: TOKENS.TWO_FA_TOKEN.TYPE }, { type: TOKENS.RESET_TOKEN.TYPE }] };
        const tokenExists = await Token.findOne(tokenFilter).lean();
        if (!tokenExists) throw new createHttpError(401, ERRORS.TOKEN_EXPIRED);

        const user = await User.findById(tokenExists.userId).lean();
        if (!user) throw new createHttpError(401, ERRORS.USER_NOT_FOUND);
        

        if (moment(user.lockUntil).isAfter(moment())) {
            const formattedLockTime = moment(user.lockUntil).format('LLL');
            throw new createHttpError(401, `${ERRORS.ACCOUNT_LOCKED} ${formattedLockTime}`);
        }

        const authUser = { _id: user._id };
        req.authUser = authUser;
        next();

    } catch (error) { return next(error); }
};

module.exports = auth;