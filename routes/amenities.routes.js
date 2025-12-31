const cretaeAmenities = require('../controllers/amenities/create');
const deleteAmenities = require('../controllers/amenities/delete');
const updateAmenities = require('../controllers/amenities/update');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const validation = require('../utils/validation');

const router = require('express').Router();

router.post('/create', validate(validation.AMENITIES_CREATE), asyncHandler(async function _cretaeAmenities(req, res, next) {
    const data = await cretaeAmenities(req?.body);
    res.ok(data, 'Amenities have been successfully created.');
}));

router.patch('/update/:amenitiesId', validate(validation.AMENITIES_UPDATE),
    asyncHandler(async function _updateAmenities(req, res, next) {
        const data = await updateAmenities(req?.body, req?.params);
        res.ok(data, 'Amenities have been successfully updated.');
    }));

router.delete('/delete/:amenitiesId', validate(validation.AMENITIES_DELETE),
    asyncHandler(async function _deleteAmenities(req, res, next) {
        const data = await deleteAmenities(req?.params);
        res.ok(data, 'Amenities have been successfully deleted.');
    }));

module.exports = router;