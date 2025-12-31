const listAmenities = require('../controllers/amenities/list');
const getProeprtyDescription = require('../controllers/property/get');
const listProperty = require('../controllers/property/list');
const listCategory = require('../controllers/category/list');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const validation = require('../utils/validation');
const listHouseRule = require('../controllers/houserule/list');
const availableSlot = require('../controllers/reservation/availableSlot');
const router = require('express').Router();

router.post('/property', asyncHandler(async function (req, res, next) {
    const data = await listProperty(req?.body);
    res.ok(data);
}));

router.get('/property/:propertyId', validate(validation.GET_PROPERTY), asyncHandler(async function (req, res, next) {
    const data = await getProeprtyDescription(req?.params);
    res.ok(data);
}));

router.post('/amenities/list', asyncHandler(async function _listAmenities(req, res, next) {
    const data = await listAmenities(req?.body);
    res.ok(data);
}));

router.post('/category/list', asyncHandler(async function _listCategory(req, res, next) {
    const data = await listCategory(req?.body);
    res.ok(data);
}));

router.post('/houserule/list', asyncHandler(async function _listHouseRule(req, res, next) {
    const data = await listHouseRule(req?.body);
    res.ok(data);
}));

router.post('/availableSlot', validate(validation.AVAILABLE_SLOT), asyncHandler(async function _listAvailableSlot(req, res, next) {
    const data = await availableSlot(req?.body)
    res.ok(data)
}));

module.exports = router;