const createHttpError = require("http-errors");
const Category = require("../../models/Category");
const { ERRORS } = require("../../constants/errors.constants");
const cretaSlug = require("../../utils/createSlug");

async function createCategory(body) {
    let { label } = body;
    const slug = cretaSlug(label);

    const findCategory = await Category.findOne({ slug });
    if (findCategory) throw new createHttpError[400](ERRORS?.CATEGORY_EXIST);


    const category = await Category.create({ label, slug });
    return category;
}
module.exports = createCategory;