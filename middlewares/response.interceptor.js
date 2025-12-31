const STATUS_CODES = require('http').STATUS_CODES;

function responsehandler(req, res, next) {
    res.ok = function (data = {}, message = 'Reuqest executed successfully', statusCode = 200, statusText = null) {
        return res.status(statusCode).json({
            message: message,
            statusText: statusText || STATUS_CODES[statusCode].replaceAll(" ", "_").toUpperCase(),
            statusCode: statusCode,
            data: data,
        });
    };
    return next();
}

module.exports = responsehandler;