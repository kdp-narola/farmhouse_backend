const pagination = require("../../helpers/pagination");
const Wishlist = require("../../models/Wishlist");

async function fetchWishlist(authUser, body) {
    body.filter = { ...body?.filter, user: authUser?._id }
    const wishlist = await pagination(Wishlist, body.filter, body?.population, body);
    return wishlist;
}
module.exports = fetchWishlist;