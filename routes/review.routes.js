const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const validation = require('../utils/validation');

const router = require('express').Router();

router.post('/create', validate(validation.REVIEW_CREATE),
    asyncHandler(async function _createReview(req, res, next) {
        const data = await require('../controllers/review/create')(req.authUser, req.body);
        res.ok(data, 'Review cretaed successfully.')
    }));

router.get('/:propertyId', validate(validation.GET_PROPERTY),
    asyncHandler(async function _propertyReview(req, res, next) {
        const data = await require('../controllers/review/get')(req?.params);
        return res.ok(data)
    }));

module.exports = router;