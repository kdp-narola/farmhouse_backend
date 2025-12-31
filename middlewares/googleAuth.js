const passport = require('passport');
const Authentication = require('../services/Authentication');
const User = require('../models/User');
const Token = require('../models/Token');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env?.GOOGLE_CLIENT_ID?.trim(),
    clientSecret: process.env?.GOOGLE_CLIENT_SECRET?.trim(),
    callbackURL: `${process.env?.FRONTEND_URL}/authentication/google/callback`
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            const options = { email: profile._json.email, firstName: profile.name.givenName, isVerified: profile._json.email_verified };
            const token = await new Authentication(User, Token).googleAuth(options);

            return cb(null, token);
        } catch (error) { return cb(error); }
    }
));