import { isEmpty } from "lodash";


export const getAgenciesQuery = (params: any) => {
    let { offset, limit, filter, start, end } = params;

    const match = { $match: filter };

    if (start && end) {
        match['$match']['dates.created'] = { $gte: start, $lte: end };
    }

    const query: any =
        [
            {
                $addFields: {
                    userId: { $toObjectId: '$user._id' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userInfos'
                }
            },
            {
                $unwind: {
                    path: '$userInfos',
                    preserveNullAndEmptyArrays: true
                }
            },
            { $set: { 'user.age': '$userInfos.age' } },
            { $unset: ['userId', 'userInfos'] },
            { $sort: { _id: -1 } },
        ];

    // example of ageLabel = 'BICEC BASSA';
    if (filter['user.age.label']) { match['$match']['user.age.label'] = { $regex: `${filter['user.age.label']}` }; }
    if (!isEmpty(match['$match'])) { query.push(match); }

    if (offset && limit) {
        query.push({ '$skip': ((offset || 1) - 1) * (limit || 0) });
        query.push({ '$limit': limit });
    }

    return query;
}