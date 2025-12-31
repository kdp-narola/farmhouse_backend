const createHttpError = require("http-errors");
const Category = require("../../models/Category");
const { ERRORS } = require("../../constants/errors.constants");
const cretaSlug = require("../../utils/createSlug");

async function updateCategory(body, params) {
    const label = body?.label;
    const categoryId = params?.categoryId;
    const slug = cretaSlug(label);
    const category = await Category.findById(categoryId);
    if (!category) throw new createHttpError[400](ERRORS?.AMENITIES_NOTEXIST);

    const checkSlug = await Category.findOne({ _id: { $ne: category?.id }, slug });
    if (checkSlug) throw new createHttpError[400](ERRORS?.AMENITIES_EXIST);

    category.label = label;
    category.slug = slug;
    await category.save()
    return { _id: category?.id, label: label }
}

module.exports = updateCategory;