const createHttpError = require("http-errors");

const validate = validations => {
    return async (req, res, next) => {

        for (const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                const msg = result.errors[0].msg;
                const error = new createHttpError(422, msg || 'Validation Error');
                return next(error);
            }
        }
        next();
    };
};
module.exports = validate;