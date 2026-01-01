const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyOwner = require('../middlewares/verifyOwner');
const verifyToken = require('../middlewares/verifyToken');

const router = require('express').Router();


router.use('/authentication', require('./authentication.routes'));
router.use('/public', require('./public.routes'));

router.use(verifyToken);
router.use('/wishlist', require('./wishlist.routes'));
router.use('/reservation', require('./reservation.routes'));
router.use('/bookings', require('./booking.routes'));
router.use('/review', require('./review.routes'));
router.use('/owner', verifyOwner, require('./owner.routes'));
router.use('/admin', verifyAdmin, require('./admin.routes'));
router.use('/statistics', require('./statistics.routes'));

module.exports = router;