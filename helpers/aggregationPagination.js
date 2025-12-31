async function paginationAggregation(model, filter, population, body) {
    const page = (parseInt(body?.options?.page) <= 0) ? 1 : parseInt(body?.options?.page) || 1;
    const limit = (parseInt(body?.options?.limit) <= 0) ? 25 : parseInt(body?.options?.limit) || 25;
    const search = body?.options?.search || {};
    const select = body?.options?.select || '-__v -createAt';
    const sort = body?.options?.sort || '-createdAt';
    const skip = (page - 1) * limit;
    const isPagination = (body?.options?.pagination) ? true : false;
    // const calAverage = body?.options?.avergae || [];

    const $or = [];
    if (search && search.value && Array.isArray(search.keys)) {
        search.keys.forEach(field => {
            $or.push({ [field]: { $regex: `${search.value}`, $options: 'i' } });
        });
    }

    const finalFilter = $or.length > 0 ? { ...filter, $or } : filter;

    const pipeline = [];

    pipeline.push({ $match: finalFilter });

    if (population && Array.isArray(population)) {
        population.forEach(pop => {
            pipeline.push({
                $lookup: {
                    from: pop.path,
                    localField: pop?.localField || pop.path,
                    foreignField: pop?.foreignField || '_id',
                    as: pop?.path,
                    pipeline: pop?.pipeline || [],
                }
            });
            if (pop?.unwind) pipeline.push({
                $unwind: {
                    path: `$${pop.path}`,
                    preserveNullAndEmptyArrays: true
                }
            });
            if (pop?.addPipeline) pipeline.push(pop?.addPipeline);
        });
    }

    // if (calAverage) {
    //     calAverage.forEach((averageObj) => {
    //         const { feild, newFeildName } = averageObj;
    //         pipeline.push({ $addFields: { [newFeildName]: { $avg: feild } } });
    //     })
    // }

    const facetStage = { $facet: { metadata: [{ $count: 'totalData' }], data: [] } };

    facetStage.$facet.data.push({ $sort: buildSortObject(sort) });

    if (isPagination) {
        facetStage.$facet.data.push({ $skip: skip });
        facetStage.$facet.data.push({ $limit: limit });
    }

    const projectFields = buildProjectObject(select);
    if (Object.keys(projectFields).length > 0) facetStage.$facet.data.push({ $project: projectFields });

    pipeline.push(facetStage);

    pipeline.push({
        $project: {
            data: '$data',
            totalData: { $arrayElemAt: ['$metadata.totalData', 0] }
        }
    });

    const result = await model.aggregate(pipeline).exec();
    const { data = [], totalData = 0 } = result[0] || {};

    const pagination = {
        limit,
        totalData,
        currentPage: page,
        totalPages: Math.ceil(totalData / limit)
    };

    return { data, pagination };
}

function buildSortObject(sortStr) {
    const sortObj = {};
    const fields = sortStr.trim().split(/\s+/);

    fields.forEach(field => {
        if (field.startsWith('-')) {
            sortObj[field.substring(1)] = -1;
        } else {
            sortObj[field] = 1;
        }
    });

    return sortObj;
}

function buildProjectObject(selectStr) {
    const projectObj = {};
    const fields = selectStr.trim().split(/\s+/);

    fields.forEach(field => {
        if (field.startsWith('-')) {
            projectObj[field.substring(1)] = 0;
        } else {
            projectObj[field] = 1;
        }
    });

    return projectObj;
}

module.exports = paginationAggregation;