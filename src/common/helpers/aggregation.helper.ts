import { Agencies } from 'modules/visa-operations/enum';
import { authorizations } from 'modules/auth/profile';
import { UserCategory } from 'modules/users/enum';
import httpContext from 'express-http-context';
import { isEmpty } from "lodash";



export const getAgenciesQuery = (params: any) => {
    let { offset, limit, filter, start, end } = params;

    const match = { $match: filter || {} };

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
                    'user.userGesCode': '$userInfos.userGesCode',
                }
            },
            { $unset: ['userId', 'userInfos'] },
            { $sort: { _id: -1 } },
        ];

    // match user authorizations datas
    matchUserAuthorizationsDatas(match);

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


export function matchUserAuthorizationsDatas(match: any): void {
    const authUser = httpContext.get('user');
    const authorizationsUser: string[] = httpContext.get('authorizations');
    const { SUPER_ADMIN, ADMIN, SUPPORT, PERSONNEL_MANAGER, ACCOUNT_MANAGER, AGENCY_HEAD, HEAD_OF_PERSONNEL_AGENCY } = UserCategory;

    if ([SUPER_ADMIN, ADMIN, SUPPORT].includes(authUser?.category)) { return; }

    match['$match']['user.age.code'] = { $nin: [`${Agencies.PERSONNAL}`] };

    (authorizationsUser.includes(
        authorizations.PERSONNEL_MANAGER_DATA_WRITE ||
        authorizations.PERSONNEL_MANAGER_DATA_VIEW ||
        authorizations.HEAD_OF_PERSONNEL_AGENCY_VIEW ||
        authorizations.HEAD_OF_PERSONNEL_AGENCY_WRITE
    )) && (match['$match']['user.age.code'] = `${Agencies.PERSONNAL}`);

    ([PERSONNEL_MANAGER, ACCOUNT_MANAGER].includes(authUser?.category)) && (match['$match']['user.userGesCode'] === `${authUser?.gesCode}`);
    ([HEAD_OF_PERSONNEL_AGENCY, AGENCY_HEAD].includes(authUser?.category)) && (match['$match']['user.age.code'] = `${authUser?.age?.code}`);
}
