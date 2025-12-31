const createHttpError = require("http-errors");
const HouseRule = require("../../models/HouseRule");
const { ERRORS } = require("../../constants/errors.constants");
const moment = require('moment');

async function deleteHouseRule(params) {
    const ruleId = params?.ruleId;
    const houseRule = await HouseRule.findById(ruleId);
    if (!houseRule || houseRule.deletedAt) throw new createHttpError(400, ERRORS.HOUSERULE_NOTEXIST);

    const currentTime = moment().utc();
    houseRule.deletedAt = currentTime.toISOString();
    await houseRule.save();
    return { ...houseRule, deletedAt: currentTime.format('LLL') };
}

module.exports = deleteHouseRule;