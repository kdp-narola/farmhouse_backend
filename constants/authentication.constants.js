module.exports = {
    TOKENS: {
        TWO_FA_TOKEN: {
            EXPIRESIN: { num: 15, time: 'minutes' },
            TYPE: 'TWO_FA_TOKEN'
        },
        ACCESS_TOKEN: {
            EXPIRESIN: { num: 24, time: 'hours' },
            TYPE: 'ACCESS_TOKEN'
        },
        OTP: {
            EXPIRESIN: { num: 10, time: 'minutes' },
            TYPE: 'OTP'
        },
        RESET_TOKEN: {
            EXPIRESIN: { num: 10, time: 'minutes' },
            TYPE: 'RESET_TOKEN'
        },
        MAGIC_TOKEN: {
            EXPIRESIN: { num: 15, time: 'minutes' },
            TYPE: 'MAGIC_TOKEN'
        }
    },
};