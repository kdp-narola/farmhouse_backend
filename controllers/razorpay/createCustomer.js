const createHttpError = require('http-errors');
const razorpay = require('../../config/razorpay');
async function createRazorPayCustomer(email, fullName) {
    if (!email || !fullName) {
        throw new createHttpError(400, 'Email and FullName is required to create Contact.');
    }
    const customer = await razorpay.customers.create({ name: fullName, email, fail_existing: 0 });
    console.log('customer :>> ', customer);
    return customer?.id
}
module.exports = createRazorPayCustomer;