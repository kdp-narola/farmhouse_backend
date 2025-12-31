const allUsers = require('../controllers/admin/allUsers');
const dashboardDetails = require('../controllers/admin/dashboardDetails');
const asyncHandler = require('../utils/asyncHandler');

const router = require('express').Router();

router.post('/users/list', asyncHandler(async function _listAllUsers(req, res, next) {
    const data = await allUsers(req?.body);
    return res.ok(data);
}));

router.get('/dashboardDetails', asyncHandler(async function _dashboardDetails(req, res, next) {
    const data = await dashboardDetails();
    return res.ok(data);
}));

router.use('/amenities', require('./amenities.routes'));
router.use('/category', require('./category.routes'));
router.use('/houserule', require('./houserule.routes'));

module.exports = router;