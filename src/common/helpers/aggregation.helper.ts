import { Agencies } from 'modules/visa-operations/enum';
import { authorizations } from 'modules/auth/profile';
import { UserCategory } from 'modules/users/enum';
import httpContext from 'express-http-context';
import { isEmpty } from "lodash";



export const getAgenciesQuery = (params: any) => {
    const user = httpContext.get('user');
    const authorizationsUser: string[] = httpContext.get('authorizations')  ?? [];

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
            {
                $set: {
                    'user.age': '$userInfos.age',
                    'user.cbsCategory': '$userInfos.cbsCategory',
                }
            },
            { $unset: ['userId', 'userInfos'] },
            { $sort: { _id: -1 } },
        ];

    // match['$match']['user.age.code'] = { $nin: [`${Agencies.PERSONNAL}`] }

    if (authorizationsUser.includes(
        authorizations.PERSONNEL_MANAGER_DATA_WRITE ||
        authorizations.PERSONNEL_MANAGER_DATA_VIEW ||
        authorizations.HEAD_OF_PERSONNEL_AGENCY_VIEW ||
        authorizations.HEAD_OF_PERSONNEL_AGENCY_WRITE
    )) {
        match['$match']['user.age.code'] = `${Agencies.PERSONNAL}`
    }
    if (user.category === UserCategory.SUPER_ADMIN) { match['$match']['user.age.code'] = null }

    // example of ageLabel = 'BICEC BASSA';
    if (filter['user.age.label']) { match['$match']['user.age.label'] = { $regex: `${filter['user.age.label']}` }; }
    if (filter['user.cbsCategory']) { match['$match']['user.cbsCategory'] = `${filter['user.cbsCategory']}` }
    if (!isEmpty(match['$match'])) { query.push(match); }

    if (offset && limit) {
        query.push({ '$skip': ((offset || 1) - 1) * (limit || 0) });
        query.push({ '$limit': limit });
    }

    return query;
}