const createHttpError = require('http-errors');
const Tokens = require('./Tokens');
const moment = require('moment');
const bcrypt = require('bcrypt');
const { TOKENS } = require('../constants/authentication.constants');
const { USER_STATUS, TEMPLATE } = require('../constants/user.constants');
const Mail = require('./Mail');
const { ERRORS } = require('../constants/errors.constants');
const createRazorPayCustomer = require('../controllers/razorpay/createCustomer');

module.exports = class Authentication {

    constructor(userModel, tokenModel) {

        if (!userModel || !tokenModel) throw new createHttpError(422, ERRORS.MISSING_AUTHENTICATION_PARAMS);
        this.User = userModel;
        this.Token = tokenModel;
    }

    async register({ email, fullName, role, password }) {
        try {
            if (!email || !fullName || !role || !password) throw new createHttpError(422, ERRORS.MISSING_EMAIL_FIRSTNAME);

            const userFilter = { email };
            const existingUser = await this.User.findOne(userFilter).lean();
            if (existingUser && existingUser.status == USER_STATUS.VERIFIED) throw new createHttpError(400, ERRORS.USER_EXISTS);

            const salt = await bcrypt.genSalt(10);
            const newPassword = await bcrypt.hash(password, salt);

            const razorpayCustomerId = await createRazorPayCustomer(email, fullName);
            if (!razorpayCustomerId) throw new createHttpError(400, 'Customer Id required');

            const update = { fullName, role, password: newPassword, razorpayCustomerId };
            const options = { upsert: true, new: true, runValidators: true };
            const user = await this.User.findOneAndUpdate(userFilter, update, options).lean();

            const twoFaToken = await new Tokens(user._id).twoFaToken();
            const otp = await new Tokens(user._id).otp();

            await new Mail(user.email).sendOTP({ userOtp: otp.token, firstName: user.fullName });

            return { id: user._id, token: twoFaToken.token };
        } catch (error) { throw error; }
    }

    // async googleAuth({ email, firstName, isVerified }) {
    //     try {
    //         const userFilter = { email };
    //         let user = await this.User.findOne(userFilter);
    //         if (user && moment(user.lockUntil).isAfter(moment())) {
    //             const formattedLockTime = moment(user.lockUntil).format('LLL');
    //             throw new createHttpError(401, `${ERRORS.ACCOUNT_LOCKED} ${formattedLockTime}`);
    //         }
    //         if (user && isVerified && user.status !== USER.ENABLED) {
    //             user.status = USER.VERIFIED;
    //             await user.save();
    //         }
    //         if (!user) {
    //             const userData = { email, firstName };
    //             user = await this.User.create(userData);
    //             if (isVerified) {
    //                 user.status = USER.VERIFIED;
    //                 await user.save();
    //             }
    //         }
    //         const tokenType = user.status === USER.ENABLED ? TOKENS.ACCESS_TOKEN.TYPE : TOKENS.TWO_FA_TOKEN.TYPE;
    //         const token = await new Tokens(user._id, tokenType, this.Token).generate();

    //         const response = { ...token, name: user.firstName, status: user.status };
    //         return response;
    //     } catch (error) { throw error; }
    // }

    async login({ email, password }) {
        try {
            if (!email || !password) throw new createHttpError(422, ERRORS.MISSING_EMAIL_PASSWORD);

            const userFilter = { email };
            const userSelect = 'password fullName role email lockUntil totalAttempts status';
            const user = await this.User.findOne(userFilter).select(userSelect);
            if (!user) throw new createHttpError(401, ERRORS.USER_NOT_EXISTS);
            if (moment(user.lockUntil).isAfter(moment())) {
                const formattedLockTime = moment(user.lockUntil).format('LLL');
                throw new createHttpError(401, `${ERRORS.ACCOUNT_LOCKED} ${formattedLockTime}`);
            }
            if (user.status !== USER_STATUS.VERIFIED) throw new createHttpError[400](ERRORS.NOT_ENABLED);

            const isMatch = await bcrypt.compare(password, user?.password);
            if (!isMatch) {
                user.totalAttempts += 1;
                if (user.totalAttempts >= 3) {
                    user.totalAttempts = 0;
                    user.lockUntil = moment().add(24, 'h');
                    await user.save();
                    const formattedLockTime = moment(user.lockUntil).format('LLL');
                    throw new createHttpError(401, `${ERRORS.ACCOUNT_LOCKED} ${formattedLockTime}`);
                }
                await user.save();
                throw new createHttpError(401, `${ERRORS.INVALID_CREDENTIALS} ${3 - user.totalAttempts}`);
            }
            user.lockUntil = null;
            user.totalAttempts = 0;
            await user.save();
            const accessToken = await new Tokens(user._id).accessToken();

            const responseData = {
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                status: user.status,
                token: accessToken.token
            };

            return responseData;
        } catch (error) { throw error; }
    }

    async verifyOTP({ userId, otp }) {

        try {
            if (!userId || !otp) { throw new createHttpError(422, ERRORS.MISSING_USERID_OTP); }

            const tokenFilter = { userId: userId, type: TOKENS.OTP.TYPE };
            const otpExists = await this.Token.findOne(tokenFilter).lean();
            if (!otpExists) throw new createHttpError(400, ` ${ERRORS.OTP_EXPIRED}`);

            const userSelect = 'password fullName role email lockUntil totalAttempts status';
            const user = await this.User.findById(userId).select(userSelect);

            if (otp !== otpExists.token) {
                user.totalAttempts += 1;
                if (user.totalAttempts >= 3) {
                    user.totalAttempts = 0;
                    user.lockUntil = moment().add(24, 'h');
                    await user.save();
                    const formattedLockTime = moment(user.lockUntil).format('LLL');
                    throw new createHttpError(401, `${ERRORS.ACCOUNT_LOCKED} ${formattedLockTime}`);
                }
                await user.save();
                throw new createHttpError(401, `${ERRORS.INVALID_OTP} ${(3 - user.totalAttempts)}`);
            }

            user.status = USER_STATUS.VERIFIED;
            user.lockUntil = null;
            user.totalAttempts = 0;
            await user.save();

            await this.Token.deleteMany({ userId, $or: [{ type: TOKENS.TWO_FA_TOKEN.TYPE }, { type: TOKENS.OTP.TYPE }] }).lean();
            const accessToken = await new Tokens(user._id).accessToken();

            return { status: user.status, role: user.role, token: accessToken.token };

        } catch (error) { throw error; }
    }

    async resendOTP({ userId }) {
        try {
            if (!userId) throw new createHttpError(422, ERRORS.MISSING_USERID);

            const user = await this.User.findById(userId).lean();
            if ([USER_STATUS.VERIFIED].includes(user.status)) throw new createHttpError(400, ERRORS.NOT_ALLOWED_RESEND_OTP);

            const otp = await new Tokens(user._id).otp();
            // await new Mail(user.email).sendOTP({ userOtp: otp.token, firstName: user.fullName });
            return otp;
        } catch (error) { throw error; }
    }

    // async setPassword({ userId, password }) {
    //     try {
    //         if (!userId || !password) throw new createHttpError(422, ERRORS.MISSING_USERID_PASSWORD);

    //         const userSelect = 'password status';
    //         const user = await this.User.findById(userId).select(userSelect);

    //         if (user.status !== USER.VERIFIED) throw new createHttpError(401, ERRORS.UNVERIFIED);

    //         const salt = await bcrypt.genSalt(10);
    //         const newPassword = await bcrypt.hash(password, salt);

    //         user.status = USER.ENABLED;
    //         user.password = newPassword;
    //         await user.save();

    //         const tokenFilter = { userId: user._id, type: TOKENS.TWO_FA_TOKEN.TYPE };
    //         await this.Token.findOneAndDelete(tokenFilter).lean();

    //         const accessToken = await new Tokens(user._id).accessToken();
    //         return accessToken;

    //     } catch (error) { throw error; }
    // }

    async forgotPassword({ email }) {
        try {
            if (!email) throw new createHttpError(422, ERRORS.MISSING_EMAIL);
            const userFilter = { email };
            const userSelect = 'email fullName status';

            const user = await this.User.findOne(userFilter).select(userSelect).lean();
            if (!user) throw new createHttpError(404, ERRORS.USER_NOT_EXISTS);
            if (user.status !== USER_STATUS.VERIFIED) throw new createHttpError[400](ERRORS.NOT_ENABLED);
            const resetToken = await new Tokens(user._id).resetToken();

            await new Mail(user.email).forgetPassword({ email: user.email, firstName: user.fullName, token: resetToken.token });

            return resetToken;
        } catch (error) { throw error; }
    }

    async resetPassword({ userId, password }) {
        try {
            if (!userId || !password) throw new createHttpError(422, ERRORS.MISSING_USERID_PASSWORD);

            const userSelect = 'password email status';
            const user = await this.User.findById(userId).select(userSelect);
            if (user.status !== USER_STATUS.VERIFIED) throw new createHttpError[400](ERRORS.NOT_ENABLED);

            const isSame = await bcrypt.compare(password, user.password);
            if (isSame) throw new createHttpError(400, ERRORS.SAME_NEW_PASSWORD);

            const salt = await bcrypt.genSalt(10);
            const newPassword = await bcrypt.hash(password, salt);
            user.password = newPassword;
            await user.save();

            const tokenFilter = { userId: userId, type: TOKENS.RESET_TOKEN.TYPE };
            await this.Token.deleteOne(tokenFilter).lean();

            return { _id: user._id, email: user.email };
        } catch (error) { throw error; }
    }

    async changePassword({ userId, oldPassword, password }) {
        try {

            if (!userId || !oldPassword || !password) throw new createHttpError(422, ERRORS.MISSING_USERID_OLD_OR_NEW_PASSWORD);

            const userSelect = 'password';
            const user = await this.User.findById(userId).select(userSelect);

            const isSame = await bcrypt.compare(oldPassword, user?.password);
            if (!isSame) throw new createHttpError(400, ERRORS.INVALID_PASSWORD);

            const isMatched = await bcrypt.compare(password, user?.password);
            if (isMatched) throw new createHttpError(400, ERRORS.SAME_NEW_PASSWORD);

            const salt = await bcrypt.genSalt(10);
            const changedPassword = await bcrypt.hash(password, salt);
            user.password = changedPassword;
            await user.save();

            return null;
        } catch (error) { throw error; }
    }

    async profile({ userId }) {
        try {
            if (!userId) throw new createHttpError(422, ERRORS.MISSING_USERID);

            const userSelect = 'email fullName role razorpayFundAccountId createdAt ';
            const user = await this.User.findById(userId).select(userSelect).lean();
            user.onboardStatus = user.razopayAccountStatus ? true : false;
            user.razorpayFundAccountId = null;
            return user;

        } catch (error) { throw error; }
    }

    // async createAndSendMagicLink({ email, firstName }) {
    //     try {
    //         if (!email || !firstName) throw new createHttpError[422](ERRORS.MISSING_EMAIL_FIRSTNAME);
    //         // const existingUser = await this.User.findOne({ email });
    //         // if (existingUser && (existingUser.status === USER.ENABLED || existingUser.status === USER.DISABLED)) 

    //         const user = await this.User.findOneAndUpdate({ email: email }, { firstName: firstName }, { upsert: true, new: true, runValidators: true });
    //         if (user.status === USER.ENABLED || user.status === USER.DISABLED) throw new createHttpError[400](ERRORS.ENABLED);

    //         const magicToken = await new Tokens(user._id).magicToken();

    //         const mailData = { token: magicToken.token, firstName: user.firstName };
    //         await new Mail(user.email).magicLink(mailData);
    //         return user;
    //     } catch (error) { throw error; }
    // }


    // async verifyMagicLink({ token }) {
    //     try {
    //         if (!token) throw new createHttpError[422](ERRORS.MISSING_TOKENS_PARAMS);

    //         const tokenExists = await this.Token.findOne({ token: token, type: TOKENS.MAGIC_TOKEN.TYPE });
    //         if (!tokenExists) throw new createHttpError[401](ERRORS.TOKEN_EXPIRED);

    //         const user = await this.User.findById(tokenExists.userId);
    //         if (!user) throw new createHttpError[401](ERRORS.USER_NOT_EXISTS);
    //         if (user.status === USER.ENABLED || user.status === USER.DISABLED) throw new createHttpError[400](ERRORS.ENABLED);
    //         user.status = USER.VERIFIED;
    //         await user.save();

    //         const twoFaToken = await new Tokens(user.id).twoFaToken()
    //         const responseData = { email: user.email, firstName: user.firstName, token: twoFaToken.token };
    //         return responseData;
    //     } catch (error) { throw error }
    // }
};