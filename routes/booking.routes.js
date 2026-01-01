const ownerBookingDetails = require("../controllers/reservation/bookingHistory");
const asyncHandler = require("../utils/asyncHandler");
const router = require("express").Router();

router.post('/', asyncHandler(async function _ownerBookingDetails(req, res, next) {
    const data = await ownerBookingDetails(req?.authUser, req.body);
    res.ok(data);
}));

module.exports = router;