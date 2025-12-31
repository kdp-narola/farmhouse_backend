const mongoose = require('mongoose');
const { TOKENS } = require('../constants/authentication.constants');
const { USER, TOKEN } = require('../constants/db.constant');

const tokenSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER,
        required: [true, 'UserId is required to add Token']
    },
    type: {
        type: String,
        enum: [TOKENS.MAGIC_TOKEN.TYPE, TOKENS.RESET_TOKEN.TYPE, TOKENS.OTP.TYPE, TOKENS.TWO_FA_TOKEN.TYPE, TOKENS.ACCESS_TOKEN.TYPE],
        required: [true, 'Type of Token is required.']
    },
    token: {
        type: String
    },
    expiresAt: {
        type: Date,
        default: null
    },

}, { timestamps: true });

tokenSchema.index({ userId: 1, type: 1 });
tokenSchema.index({ token: 1 });
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3, name: 'token_expire' });

module.exports = mongoose.model(TOKEN, tokenSchema);