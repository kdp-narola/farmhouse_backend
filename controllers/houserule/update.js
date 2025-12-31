const createHttpError = require("http-errors");
const { ERRORS } = require("../../constants/errors.constants");
const cretaSlug = require("../../utils/createSlug");
const HouseRule = require("../../models/HouseRule");

async function updateHouseRule(body, params) {
    const label = body?.label;
    const ruleId = params?.ruleId;
    const slug = cretaSlug(label);
    const houserule = await HouseRule.findById(ruleId);
    if (!houserule || houserule.deletedAt) throw new createHttpError[400](ERRORS?.HOUSERULE_NOTEXIST);

    const checkSlug = await HouseRule.findOne({ _id: { $ne: houserule?.id }, slug });
    if (checkSlug) throw new createHttpError[400](ERRORS?.HOUSERULE_EXIST);

    houserule.label = label;
    houserule.slug = slug;
    await houserule.save()
    return { _id: houserule?.id, label: label }
}

module.exports = updateHouseRule;