const pagination = require("../../helpers/pagination");
const HouseRule = require("../../models/HouseRule");

async function listHouseRule(body) {
    body.filter = {
        ...body.filter,
        deletedAt: null
    }
    const category = await pagination(HouseRule, body.filter, body.population, body)
    return category;
}
module.exports = listHouseRule;