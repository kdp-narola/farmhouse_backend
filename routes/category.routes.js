const createCategory = require('../controllers/category/create');
const deleteCategory = require('../controllers/category/delete');
const updateCategory = require('../controllers/category/update');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const validation = require('../utils/validation');

const router = require('express').Router();

router.post('/create', validate(validation.CATEGORY_CREATE),
    asyncHandler(async function _createCategory(req, res, next) {
        const data = await createCategory(req?.body);
        res.ok(data, 'Category have been successfully created.');
    }));

router.patch('/update/:categoryId', validate(validation.CATEGORY_UPDATE),
    asyncHandler(async function _updateCategory(req, res, next) {
        const data = await updateCategory(req?.body, req?.params);
        res.ok(data, 'Category have been successfully updated.');
    }));

router.delete('/delete/:categoryId', validate(validation.CATEGORY_DELETE),
    asyncHandler(async function _deleteCategory(req, res, next) {
        const data = await deleteCategory(req?.params);
        res.ok(data, 'Category have been successfully deleted.');
    }));
    
module.exports = router;