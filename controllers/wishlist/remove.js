const createHttpError = require("http-errors");
const Wishlist = require("../../models/Wishlist");
const { ERRORS } = require("../../constants/errors.constants");

async function removeWishlist(authUser, params) {
    const wishlistId = params?.wishlistId;
    const wishlist = await Wishlist.findOneAndDelete({ _id: wishlistId, user: authUser._id });
    if (!wishlist) throw new createHttpError[404](ERRORS.WISHLIST_NOTEXIST);
    return wishlist;
}
module.exports = removeWishlist;