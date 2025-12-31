const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const nodeMailer = require('nodemailer');
const mailOptions = require("../helpers/mailOptions");
const createHttpError = require("http-errors");
const { ERRORS } = require("../constants/errors.constants");
const { TEMPLATE } = require("../constants/user.constants");


module.exports = class Mail {

    constructor(to) {

        if (!to) throw new createHttpError[422](ERRORS.MISSING_TO_ADDRESS);
        this.to = to;

        //AWS SES FOR PRODUCTION
        this.transporter = nodeMailer.createTransport(
            process.env?.NODE_ENV !== 'production' ?
                {
                    host: "smtp.ionos.com",
                    port: 587,
                    secure: false,
                    auth: { user: process.env?.MAIL_SERVICE_EMAIL?.trim(), pass: process.env?.MAIL_SERVICE_PASSWORD?.trim(), },
                } :
                {
                    SES: {
                        sesClient: new SESClient({ region: process.env?.AWS_REGION?.trim() }),
                        SendEmailCommand
                    }
                });
    }

    async #sendEmail({ templateName, data }) {
        try {
            const options = await mailOptions(this.to, templateName, data);

            const info = await this.transporter.sendMail(options);
            console.log('mail info : >> ', info);
            return info;

        } catch (error) {
            throw new createHttpError(400, error || ERRORS.MAIL_ERROR);
        }
    }

    async sendOTP({ userOtp, firstName }) {
        try {
            if (!userOtp || !firstName) throw new createHttpError[422](ERRORS.MISSING_REGISTER_EMAIL);
            const mailData = { templateName: TEMPLATE.OTP, data: { userOtp, firstName } };
            const info = await this.#sendEmail(mailData);
            return info
        } catch (error) { throw error }
    }

    async forgetPassword({ email, token, firstName }) {
        try {
            if (!token || !firstName || !email) throw new createHttpError[422](ERRORS.MISSING_FORGETPASSWORD_EMAIL);
            const url = `${process.env?.FRONTEND_URL.trim()}/auth/reset-pass/?token=${token}`;
            const mailData = { templateName: TEMPLATE.RESET_PASSWORD, data: { token, firstName, email, url } };
            const info = await this.#sendEmail(mailData);
            return info;
        } catch (error) { throw new createHttpError[403]('Mail Server Error.') }
    }

    async magicLink({ token, firstName }) {
        try {
            if (!token || !firstName) throw new createHttpError[422](ERRORS.MISSING_FORGETPASSWORD_EMAIL);
            const url = `${process.env.FRONTEND_URL.trim()}/api/v1/authentication/verify?token=${token}`;
            const mailData = { templateName: TEMPLATE.MAGICLINK, data: { firstName, url } }
            const info = await this.#sendEmail(mailData);
            return info
        } catch (error) { throw error }
    }
};