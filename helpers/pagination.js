
async function pagination(model, filter, population, body) {
    const page = (parseInt(body?.options?.page) <= 0) ? 1 : parseInt(body?.options?.page) || 1;
    const limit = (parseInt(body?.options?.limit) <= 0) ? 25 : parseInt(body?.options?.limit) || 25;
    const search = body?.options?.search || {}
    const select = body?.options?.select || '-__v -createAt ';
    const sort = body?.options?.sort || '-createdAt';
    const skip = (page - 1) * limit;
    const $or = [];
    
    const isPagination = (body?.options?.pagination) ? true : false;

    if (search && search.value && Array.isArray(search.keys)) {
        search.keys.forEach(field => {
            $or.push({ [field]: { $regex: `${search.value}`, $options: 'i' } });
        });
    }
    filter = { ...filter, $or };

    let dbQuery = model.find(filter).select(select).sort(sort).lean();

    if (isPagination) dbQuery = dbQuery.limit(limit).skip(skip)
    if (population) dbQuery = dbQuery.populate(population);

    const data = await dbQuery.exec();

    const totalData = await model.countDocuments(filter);
    const pagination = { limit: limit, totalData: totalData, currentPage: page, totalPages: Math.ceil(totalData / limit) };

    return { data, pagination };
}

module.exports = pagination;
