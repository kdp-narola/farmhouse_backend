const createHttpError = require("http-errors");
const { ERRORS } = require("../../constants/errors.constants");
const crypto = require('crypto');
const axiosInterceptor = require("../../helpers/axios");
const razorpayAPIConstant = require("../../constants/razorpayAPI.constant");

async function validateAccount(bank_account, contact) {
    const { name, ifsc, account_number } = bank_account;
    const { contactName, email } = contact;

    if (!name || !ifsc || !account_number) throw new createHttpError[422](ERRORS.ACCOUT_VALIDATION_MISSING_PARAM);
    if (!contactName || !email) throw new createHttpError[422](ERRORS.ACCOUNT_VALDATION_CONTACT_MISSING);

    const data = {
        source_account_number: process.env.SOURCE_ACCOUNT_NUMBER,
        // validation_type: 'optimized',
        reference_id: `payout_${crypto.randomUUID()}`,
        fund_account: {
            account_type: 'bank_account',
            bank_account: { name, ifsc, account_number },
            contact: { name: contactName, email }
        }
    }

    const verify = await axiosInterceptor(razorpayAPIConstant.ACCOUNT_VALIDATION, data);
    return verify
}

module.exports = validateAccount;