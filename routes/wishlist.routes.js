const addTowishList = require('../controllers/wishlist/create');
const fetchWishlist = require('../controllers/wishlist/list');
const removeWishlist = require('../controllers/wishlist/remove');
const validate = require('../middlewares/validate');
const asyncHandler = require('../utils/asyncHandler');
const validation = require('../utils/validation');

const router = require('express').Router();

router.post('/add-to-wishlist', validate(validation.CREATE_WISHLIST), asyncHandler(async function _addToWishlist(req, res, next) {
    const data = await addTowishList(req.authUser, req.body);
    return res.ok(data)
}));

router.post('/list', asyncHandler(async function _fetchWishlist(req, res, next) {
    const data = await fetchWishlist(req.authUser, req.body);
    return res.ok(data)
}));

router.delete('/remove/:wishlistId', validate(validation.REMOVE_WISHLIST), asyncHandler(async function _removeWishlist(req, res, next) {
    const data = await removeWishlist(req.authUser, req.params);
    return res.ok(data)
}));
    
module.exports = router;