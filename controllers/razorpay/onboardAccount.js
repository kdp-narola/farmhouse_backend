const createHttpError = require("http-errors");
const razorpay = require("../../config/razorpay");
const User = require("../../models/User");
const { ERRORS } = require("../../constants/errors.constants");
const validateAccount = require("./validateAccount");

async function onbaordAccount(authUser, body) {
    const { beneficiaryName, ifscCode, accountNumber } = body;
    const user = await User.findById(authUser._id).select('fullName email razorpayCustomerId razorpayFundAccountId');
    if (!user) throw new createHttpError(400, ERRORS.USER_NOT_EXISTS);
    const bank_account = {
        account_number: accountNumber,
        name: beneficiaryName,
        ifsc: ifscCode
    };
    const contact = { contactName: user.fullName, email: user.email };
    await validateAccount(bank_account, contact)
    // return verifyAccount    
    const fundAccount = await razorpay.fundAccount.create({
        customer_id: user?.customer_id,
        account_type: 'bank_account_type',
        bank_account: bank_account
    });
    user.razorpayFundAccountId = fundAccount._id;
    await fundAccount.save();
    return { razopayAccountStatus: true }
}

module.exports = onbaordAccount