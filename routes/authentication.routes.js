const passport = require('passport');
const auth = require('../middlewares/authToken');
const validate = require('../middlewares/validate');
const verifyToken = require('../middlewares/verifyToken');
const Token = require('../models/Token');
const User = require('../models/User');
const Authentication = require('../services/Authentication');
const asyncHandler = require('../utils/asyncHandler');
const validation = require('../utils/validation');
const router = require('express').Router();
// require('../middlewares/googleAuth');


// for the register form 
// router.get('/register', asyncHandler(async (req, res, next) => {
//     res.render('pages/register', data = { url: `${process.env.FRONTEND_URL}/authentication/google` });
// }));

// // redirect to Google login ... 
// router.get('/google',
//     passport.authenticate('google', { scope: ['email', 'profile'] }),
//     asyncHandler(async (req, res, next) => {
//         res.ok();
//     }));

// router.get('/google/callback',
//     passport.authenticate('google', { session: false, failureRedirect: '/api/v1/authentication/register' }),
//     asyncHandler(async (req, res, next) => {
//         // req.user.data.type === 'ACCESS_TOKEN  --> navigate to HomePage
//         // req.user.data.type === 'TWO_FA_TOKEN  --> navigate to Set Password
//         res.ok(req.user, 'Token attached');
//     }));

router.post('/register', validate(validation.REGISTER), asyncHandler(async (req, res, next) => {
    // type - email-password
    const registerUser = await new Authentication(User, Token).register(req.body);
    res.ok(registerUser, 'Registration Successful', 201);
}));

router.post('/login', validate(validation.LOGIN), asyncHandler(async (req, res, next) => {
    const login = await new Authentication(User, Token).login(req.body);
    res.ok(login, 'Login Successful');
}));

router.post('/verify-otp', validate(validation.VERIFY_OTP), auth, asyncHandler(async (req, res, next) => {
    const otpVerify = await new Authentication(User, Token).verifyOTP({ userId: req.authUser._id, ...req.body });
    res.ok(otpVerify, 'Verification Successful');
}));

router.post('/resend-otp', auth, asyncHandler(async (req, res, next) => {
    const resendOtp = await new Authentication(User, Token).resendOTP({ userId: req.authUser._id });
    res.ok(resendOtp, 'OTP Sent To Your Mail Id.');
}));

// router.post('/set-password', validate(validation.SET_PASSWORD), auth, asyncHandler(async (req, res, next) => {
//     const setPassword = await new Authentication(User, Token).setPassword({ userId: req.authUser._id, ...req.body });
//     res.ok(setPassword, 'Password Set Successfully');
// }));

router.post('/forgot-password', validate(validation.FORGOT_PASSWORD), asyncHandler(async (req, res, next) => {
    const forgotPassword = await new Authentication(User, Token).forgotPassword(req.body);
    res.ok(forgotPassword, 'Reset Link Sent to Your Mail Id.');
}));

router.post('/reset-password', validate(validation.RESET_PASSWORD), auth, asyncHandler(async (req, res, next) => {
    const resetPassword = await new Authentication(User, Token).resetPassword({ userId: req.authUser._id, ...req.body });
    res.ok(resetPassword, 'Password Reset Successfully');
}));

router.post('/change-password', validate(validation.CHANGE_PASSWORD), verifyToken, asyncHandler(async (req, res, next) => {
    const changePassword = await new Authentication(User, Token).changePassword({ userId: req.authUser._id, ...req.body });
    res.ok(changePassword, 'Password Changed Successfully');
}));

router.get('/profile-me', verifyToken, asyncHandler(async (req, res, next) => {
    const data = await new Authentication(User, Token).profile({ userId: req.authUser._id });
    res.ok(data);
}));


// Magic Link 

// router.get('/singin-with-magic-link', asyncHandler(async (req, res, next) => {
//     res.render('pages/magicLinkGenerate');
// }));

// router.get('/verify', asyncHandler(async (req, res, next) => {
//     res.render('pages/magicLinkRedirect')
// }));

// router.get('/setPassword', asyncHandler(async (req, res, next) => {
//     res.render('pages/magicSetPassword')
// }));

// router.post('/magic-link', asyncHandler(async (req, res, next) => {
//     const data = await new Authentication(User, Token).createAndSendMagicLink(req.body);
//     res.ok(data);
// }));

// router.post('/verify-magic-token', asyncHandler(async (req, res, next) => {
//     const data = await new Authentication(User, Token).verifyMagicLink(req.body);
//     res.ok(data)
// }))

module.exports = router;