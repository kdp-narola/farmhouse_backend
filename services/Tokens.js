const crypto = require('crypto');
const createHttpError = require('http-errors');
const moment = require('moment');
const { TOKENS } = require('../constants/authentication.constants');
const { ERRORS } = require('../constants/errors.constants');
const Token = require('../models/Token');
class Tokens {
    constructor(userId) {
        if (!userId) throw new createHttpError(422, ERRORS.MISSING_TOKENS_PARAMS);
        this.userId = userId;
        this.tokenType = null;
        this.Token = Token;
    }

    async #generate() {

        const generateToken = this.tokenType === TOKENS.OTP.TYPE
            ? crypto.randomInt(100000, 999999).toString()
            : crypto.randomUUID();
        console.warn(generateToken);

        const expiry = TOKENS[this.tokenType].EXPIRESIN;
        const expiresAt = moment().add(expiry.num, expiry.time);

        const tokenFilter = { userId: this.userId, type: this.tokenType };
        const tokenUpdate = { type: this.tokenType, token: generateToken, expiresAt: expiresAt };
        const tokenOptions = { upsert: true, new: true, runValidators: true };
        const addToken = await this.Token.findOneAndUpdate(tokenFilter, tokenUpdate, tokenOptions).select('-_id type token').lean();

        return addToken;
    }

    async twoFaToken() {
        this.tokenType = TOKENS.TWO_FA_TOKEN.TYPE;
        return await this.#generate()
    }

    async otp() {
        this.tokenType = TOKENS.OTP.TYPE;
        return await this.#generate()
    }

    async accessToken() {
        this.tokenType = TOKENS.ACCESS_TOKEN.TYPE;
        return await this.#generate()
    }

    async resetToken() {
        this.tokenType = TOKENS.RESET_TOKEN.TYPE;
        return await this.#generate()
    }

    async magicToken() {
        this.tokenType = TOKENS.MAGIC_TOKEN.TYPE;
        return await this.#generate()
    }
}

module.exports = Tokens;