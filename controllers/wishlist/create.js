const createHttpError = require("http-errors");
const { ERRORS } = require("../../constants/errors.constants");
const Property = require("../../models/Property");
const Wishlist = require("../../models/Wishlist");

async function addTowishList(authUser, body) {
    const { propertyId } = body;
    const findProperty = await Property.findById(propertyId);
    if (!findProperty) throw new createHttpError[404](ERRORS.PROPERTY_NOTEXIST);

    const query = { user: authUser._id, property: propertyId };
    const checkWishlist = await Wishlist.findOne(query);
    if (checkWishlist) throw new createHttpError[400](ERRORS.WISHLIST_EXIST);

    const wishlist = await Wishlist.create(query);
    return wishlist;
}

module.exports = addTowishList;