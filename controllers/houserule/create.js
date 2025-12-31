const createHttpError = require("http-errors");
const { ERRORS } = require("../../constants/errors.constants");
const cretaSlug = require("../../utils/createSlug");
const HouseRule = require("../../models/HouseRule");

async function createHouseRule(body) {
    let { label } = body;
    const slug = cretaSlug(label);

    const findHouseRule = await HouseRule.findOne({ slug });
    if (findHouseRule && !findHouseRule?.deletedAt) throw new createHttpError[400](ERRORS?.HOUSERULE_EXIST);

    const findQuery = { slug };
    const updateQuery = { label, deletedAt: null };
    const optionQuery = { upsert: true, new: true, runValidators: true };
    const select = 'label slug';
    const houseRule = await HouseRule.findOneAndUpdate(findQuery, updateQuery, optionQuery).select(select);
    return houseRule;
}
module.exports = createHouseRule;