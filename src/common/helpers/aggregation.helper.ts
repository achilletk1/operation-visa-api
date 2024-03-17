import { isEmpty } from "lodash";


export const getAgenciesQuery = (params: any) => {
    let { offset, limit, travelType, clientCode, fullName, status, ageLabel, start, end, importType } = params;

    const match: any = { $match: {} };

    if (travelType) { match['$match']['travelType'] = travelType };
    if (status) { match['$match']['status'] = status };
    if (clientCode) { match['$match']['user.clientCode'] = clientCode };
    if (fullName) { match['$match']['user.fullName'] = fullName };
    if (importType) { match['$match']['type.code'] = importType };
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
                    preserveNullAndEmptyArrays: false
                }
            },
            { $set: { 'user.age': '$userInfos.age' } },
            { $unset: ['userInfos'] },
            { $sort: { _id: -1 } },
        ];

    // ageLabel = 'BICEC BASSA';
    if (ageLabel) { match['$match']['user.age.label'] = { $regex: ageLabel } };
    if (!isEmpty(match['$match'])) { query.push(match) }

    if (offset && limit) {
        query.push({ '$skip': offset });
        query.push({ '$limit': limit })
    };
    
    return query
}