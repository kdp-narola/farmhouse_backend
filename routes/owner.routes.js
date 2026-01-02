const myProperties = require('../controllers/property/myProperties');
const pendingApprovalProperties = require('../controllers/property/pendingApprovalProperties');
const onbaordAccount = require('../controllers/razorpay/onboardAccount');
const reservationAction = require('../controllers/reservation/action');
const bookingDetails = require('../controllers/reservation/bookingDetails');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const validation = require('../utils/validation');

const router = require('express').Router();

router.post('/onboardPaymentAccount', asyncHandler(async function _onbaordAccount(req, res, next) {
    const data = await onbaordAccount(req.authUser, req.body);
    return res.ok(data)
}));

router.post('/myProperties', asyncHandler(async function _(req, res, next) {
    const data = await myProperties(req.authUser, req.body);
    res.ok(data)
}));

router.post('/pendingApprovalProperties', asyncHandler(async function _pendingApprovalProperties(req, res, next) {
    const data = await pendingApprovalProperties(req.authUser, req.body);
    res.ok(data)
}));

router.get('/reservation/:propertyId', validate(validation.GET_PROPERTY),
    asyncHandler(async function _bookingDetails(req, res, next) {
        const data = await bookingDetails(req.authUser, req?.params);
        res.ok(data);
    }));

router.post('/reservation/action/:reservationId', asyncHandler(
    async function _reservationAction(req, res, next) {
        const data = await reservationAction(req.authUser, req?.body, req?.params);
        res.ok(data)
    }));

router.use('/property', require('./property.routes'));
module.exports = router;