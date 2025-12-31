const ejs = require('ejs');
const createHttpError = require('http-errors');
const path = require('path');
const { ERRORS } = require('../constants/errors.constants');

module.exports = async function mailOptions(to, templateName, data) {

    if (!to || !templateName || !data) {
        throw new createHttpError(422, ERRORS.MISSING_MAIL_OPTIONS_PARAMS);
    }

    const ejsTemplate = await new Promise((resolve, reject) =>
        ejs.renderFile(path.join(__dirname, '..', 'views', 'mails', `${templateName}.ejs`), data,
            (err, html) => {
                if (err) reject(new createHttpError(404, err));
                resolve(html);
            }));

    switch (templateName) {
        case 'otp': subject = 'Your OTP Verification Code from Authentication Service'; break;
        case 'resetPassword': subject = 'Your Reset Password link from Authentication Service'; break;
        case 'magiclink': subject = 'Your Secure Magic link from Authentication Service'; break;
        default: subject = 'Mail from Authentication Service'; break;
    }

    const options = {
        from: process.env?.MAIL_SERVICE_EMAIL?.trim(),
        to: to.trim?.() || to,
        cc: process.env?.MAIL_SERVICE_EMAIL?.trim(),
        subject: subject,
        html: ejsTemplate,
    };
    return options;
};