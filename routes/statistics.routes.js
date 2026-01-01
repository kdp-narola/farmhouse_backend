const getDashboardStatistics = require('../controllers/statistics');
const asyncHandler = require('../utils/asyncHandler');
const router = require('express').Router();

router.get('/', asyncHandler(async function _statistics(req, res, next) {
    const data = await getDashboardStatistics(req?.authUser);
    return res.ok(data);
}));
    
module.exports = router;