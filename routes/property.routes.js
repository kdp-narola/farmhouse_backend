const deleteProperty = require('../controllers/property/delete');
const publishProperty = require('../controllers/property/publish');
const asyncHandler = require('../utils/asyncHandler');
const validation = require('../utils/validation');
const validate = require('../middlewares/validate');
const upadateProperty = require('../controllers/property/update');
const updatePropertyApproval = require('../controllers/reservation/updatePropertyApproval');
const verifyAdmin = require('../middlewares/verifyAdmin');

const router = require('express').Router();

router.post('/create', validate(validation.CREATE_PROPERTY), asyncHandler(async function _publishProperty(req, res, next) {
    const data = await publishProperty(req?.authUser, req?.body, req?.files);
    res.ok(data, 'Property have been successfully created.');
}));

router.patch('/:propertyId', verifyAdmin, asyncHandler(async function _updatePropertyApproval(req, res, next) {
    const data = await updatePropertyApproval(req?.body, req?.params?.propertyId);
    res.ok(data, 'Property approval have been successfully updated.');
}));

router.patch('/update/:propertyId', validate(validation.UPDATE_PROPERTY),
    asyncHandler(async function _upadateProperty(req, res, next) {
        const data = await upadateProperty(req?.authUser, req?.body, req?.files, req?.params);
        res.ok(data, 'Property have been successfully updated.');
    }));

router.delete('/delete/:propertyId', validate(validation.GET_PROPERTY),
    asyncHandler(async function _deleteProperty(req, res, next) {
        const data = await deleteProperty(req?.authUser, req?.params);
        res.ok(data, 'Property have been successfully deleted.');
    }));

module.exports = router;