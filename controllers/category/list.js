const pagination = require("../../helpers/pagination");
const Category = require("../../models/Category");

async function listCategory(body) {
    const category = await pagination(Category, filter = {}, population = [], body)
    return category;
}
module.exports = listCategory;