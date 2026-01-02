const bookProperty = require("../controllers/reservation/book");
const myReservation = require("../controllers/reservation/myReservation");
const asyncHandler = require("../utils/asyncHandler");
const validation = require("../utils/validation");
const validate = require('../middlewares/validate');
const reservationDetails = require("../controllers/reservation/details");
const verifyPayment = require("../controllers/razorpay/verifyPayment");
const deniedPayment = require("../controllers/razorpay/deniedPayment");
const reservationLists = require("../controllers/reservation/reservationLists");
const router = require("express").Router();

router.post('/bookProperty', validate(validation.RESERVATION_CREATE),
    asyncHandler(async function _bookProperty(req, res, next) {
        const data = await bookProperty(req?.authUser, req?.body);
        res.ok(data, 'Property successfully reserved.');
    }));

router.post('/verifyPayment', asyncHandler(async function _verifyPayment(req, res, next) {
    const data = await verifyPayment(req?.body);
    res.ok(data, 'Payment Verified');
}));

router.post('/deniedPayment', asyncHandler(async function _deniedPayment(req, res, next) {
    const data = await deniedPayment(req?.body);
    res.ok(data, 'User Denied Payment. Property Booking Cancelled.')
}));

router.get('/customer-upcoming-reservation', asyncHandler(async function _myReservation(req, res, next) {
    const data = await myReservation(req?.authUser);
    res.ok(data);
}));

router.get('/details/:reservationId', asyncHandler(async function _reservationDetailes(req, res, next) {
    const data = await reservationDetails(req?.authUser, req?.params);
    res.ok(data);
}))

router.post('/reservationLists', asyncHandler(async function _reservationLists(req, res, next) {
    const data = await reservationLists(req?.authUser, req?.body);
    res.ok(data);
}))

module.exports = router;