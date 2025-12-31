const STATUS_CODES = require('http').STATUS_CODES;
const errorHandler = (err, req, res, next) => {

    console.log(err);
    const STATUS_CODE = err.statusCode || 500;
    const error = {
        message: err.message,
        statusText: STATUS_CODES[err.statusCode || 500].replaceAll(" ", "_").toUpperCase(),
        statusCode: STATUS_CODE,
        name: err.name,
        data: err.data || {}
    };
    return res.status(STATUS_CODE).json(error);
};
module.exports = errorHandler;