const Category = require("../../models/Category");

async function deleteCategory(params) {
    const categoryId = params?.categoryId;
    const category = await Category.findByIdAndDelete(categoryId);
    return category;
}

module.exports = deleteCategory;