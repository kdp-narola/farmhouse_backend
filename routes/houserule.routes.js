const createHouseRule = require('../controllers/houserule/create');
const deleteHouseRule = require('../controllers/houserule/delete');
const updateHouseRule = require('../controllers/houserule/update');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const validation = require('../utils/validation');

const router = require('express').Router();

router.post('/create', asyncHandler(async function _defineHouseRule(req, res, next) {
    const data = await createHouseRule(req.body);
    return res.ok(data, 'House rule is created successfully.');
}));

router.patch('/update/:ruleId',
    asyncHandler(async function _updateHouseRule(req, res, next) {
        const data = await updateHouseRule(req?.body, req?.params);
        res.ok(data, 'House rule have been successfully updated.');
    }));

router.delete('/delete/:ruleId',
    asyncHandler(async function _deleteHouseRule(req, res, next) {
        const data = await deleteHouseRule(req?.params);
        res.ok(data, 'House rulehave been successfully deleted.');
    }));

module.exports = router;