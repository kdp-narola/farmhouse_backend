const axios = require('axios');
const createHttpError = require('http-errors');

async function axiosInterceptor(URL, data) {
    try {
        const response = await axios.post(URL,
            data,
            {
                headers: { 'Content-Type': 'application/json' },
                auth: { username: process.env.RAZORPAY_TEST_KEY, password: process.env.RAZORPAY_KEY_SECRET }
            }
        );
        return response
    } catch (error) {
        throw new createHttpError(error.status || 401, error.response?.data?.error?.description || 'Razorpay server Error.');
    }
}
module.exports = axiosInterceptor;
