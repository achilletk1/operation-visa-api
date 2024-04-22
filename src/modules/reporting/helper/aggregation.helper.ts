import { Agencies } from 'modules/visa-operations/enum';
import { authorizations } from 'modules/auth/profile';
import httpContext from 'express-http-context';
import { logger } from "winston-config";
import { get, isArray } from "lodash";
import moment from "moment";
import { UserCategory } from 'modules/users';

const defaultQuery: any =
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
    ];

export const generateConsolidateData = (param: { status: any, start: number, end: number, travelType?: any }) => {
    const { start, end, status, travelType } = param

    const match: any = { '$match': {} }

    //const match: any = { '$match': { status: { $in: [status] } } }
    if (status) {
        match['$match']['status'] = { $in: [status] };
    }

    if (start && end) {
        match['$match']['dates.created'] = { $gte: start, $lte: end };
    }
    if (travelType) {
        match['$match']['travelType'] = travelType;
    }

    // match authorizations datas
    matchUserDatas(match);

    const query = [
        ...defaultQuery,
        {
            $facet: {
                nbTravel: [
                    { ...match },
                    { $count: '_' }
                ],
                travelStat: [
                    { ...match },
                    { '$unwind': '$transactions' },
                    {
                        $group: {
                            _id: null,
                            total: { '$sum': "$transactions.amount" },
                            count: { $sum: 1 },
                        }
                    }
                ]
            }
        },
        {
            $project: {
                total: "$nbTravel._",
                amountTransactions: "$travelStat.total",
                nbreTransactions: "$travelStat.count",
            }
        }
    ];

    return query;
};

export const statusOperation = (params: { filterStatus: any, start: number, end: number, travelType?: any, agencyCode: string, regionCode: string }) => {

    const { travelType, filterStatus, start, end, agencyCode, regionCode } = params

    const match: any = { '$match': {} }

    if (start && end) {
        match['$match']['dates.created'] = { $gte: start, $lte: end };
    }

    if (travelType) {
        match['$match']['travelType'] = travelType;
    }

    // if (filterStatus === 'NUMBER_STATUS') {
    //     let query = [
    //         {
    //             $group: {
    //                 _id: '$status',
    //                 valueResult: { '$sum': 1 }
    //             }
    //         }
    //     ]
    //     if (match['$match']) { query.unshift(match) }
    //     return query
    // } else {
    //     let query = [
    //         { $unwind: '$transactions' },
    //         {
    //             $group: {
    //                 _id: '$status',
    //                 valueResult: { '$sum': '$transactions.amount' }
    //             }
    //         }
    //     ]
    //     if (match['$match']) { query.unshift(match) }
    //     return query

    // }

    // match authorizations datas
    matchUserDatas(match);
    let query: any[] = [
        ...defaultQuery,
        { ...match },
    ];

    if (agencyCode || regionCode) {
        query.push(
            {
                $match: {
                    "user.age.code": ((!regionCode || regionCode.split(',').length <= 0) || (regionCode && agencyCode)) ? agencyCode : { $in: regionCode.split(',') }
                }
            }
        );
    }

    if (filterStatus === 'NUMBER_STATUS') {
        query.push(
            {
                $group: {
                    _id: '$status',
                    valueResult: { '$sum': 1 }
                }
            }
        );
    } else {
        query.push(
            { $unwind: '$transactions' },
            {
                $group: {
                    _id: '$status',
                    valueResult: { '$sum': '$transactions.amount' }
                }
            }
        );
    }
    // if (match && match['$match']) { query.unshift(match); }

    return query;

};

export const averageTimeJustifyTravelData = (params: { status: any, start: number, end: number, travelType?: any }) => {
    const { travelType, start, end } = params

    const match: any = { '$match': {} }

    if (start && end) {
        match['$match']['dates.created'] = { $gte: start, $lte: end };
    }
    if (travelType) {
        match['$match']['travelType'] = travelType;
    }

    // match authorizations datas
    matchUserDatas(match);

    let query = [
        ...defaultQuery,
        { ...match },
        {
            $project: {
                waitingTime: { $subtract: ['$dates.updated', '$dates.created'] }
            }
        },
        {
            $group: {
                _id: true,
                waitingTime: { $avg: '$waitingTime' }
            }
        },
        {
            $project: {
                _id: 0, time: '$waitingTime'
            }
        },
    ];

    return query;
};

export const chartDataOnlinePayment = (param: { start: number, end: number }) => {
    let query = [];

    // Add date filter
    // if (param.start && param.end) { query.push({ $match: { 'dates.created': { $gte: param.start, $lte: param.end } } }); }

    query = [
        { $unwind: '$transactions' },
        {
            $project: {
                yearMonthDate: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: { $toDate: { $toLong: '$dates.created' } }
                    }
                },
                amount: '$transactions.amount'
            }
        },
        { $group: { _id: { date: '$yearMonthDate' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { '_id.date': 1 } },
        { $project: { _id: 0, date: '$_id.date', total: '$total', nbrTransactions: '$count' } }
    ];

    return query;
};

export const chartDataTravel = (params: { start: number, end: number, travelType?: any }) => {
    let match: any = { '$match': {} }

    const { travelType } = params

    // Add date filter
    // if (param.start && param.end) { query.push({ $match: { 'dates.created': { $gte: param.start, $lte: param.end } } }); }

    if (+travelType) {
        match['$match'].travelType = +travelType;
    }

    // match authorizations datas
    matchUserDatas(match);

    const query = [
        ...defaultQuery,
        { ...match },
        { $unwind: '$transactions' },
        {
            $project: {
                yearMonthDate: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: { $toDate: { $toLong: '$dates.created' } }
                    }
                },
                amount: '$transactions.amount'
            }
        },
        { $group: { _id: { date: '$yearMonthDate' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { '_id.date': 1 } },
        { $project: { _id: 0, date: '$_id.date', total: '$total', nbrTransactions: '$count' } }
    ]
    return query;
};

export const reportingFilterQuery = (range: any, type: number): any => {

    let match: any = { '$match': {} }
    // match authorizations datas
    matchUserDatas(match);

    const query = [...defaultQuery, { ...match }];
    const start = get(range, 'start');
    const end = get(range, 'end')

    if (start && end) {
        const _start = !start || !moment(start).isValid() ?
            moment().startOf('year').valueOf() :
            moment(start).startOf('day').valueOf();
        let _end = !end || !moment(end).isValid() ?
            moment().endOf('year').valueOf() :
            moment(end).endOf('day').valueOf();
        if (_start === _end) {
            _end = moment(_end).endOf('day').valueOf();
        }


        logger.info(`get reporting Query  Params ***** _start: ${_start}; _end: ${_end}`);

        match = {
            $match: {
                'dates.created': { $gte: _start, $lte: _end }
            }
        }
        query.push(match);

    }


    let facet = { totalAmount: {}, statusAmount: {} }

    // Add amount per operations (btw, wtb, multi_transfer) query
    // facet.totalAmount = getAmountPerOperationsType();

    // Add amount per status query
    // facet.statusAmount = getAmountPerStatus(type);
    query.push({ $facet: facet });

    return query;
};

export function matchUserDatas(match: any): any {
    const user = httpContext.get('user');
    const authorizationsUser: string[] = httpContext.get('authorizations');

    match['$match']['user.age.code'] = { $nin: [`${Agencies.PERSONNAL}`] }

    if (authorizationsUser.includes(
        authorizations.PERSONNEL_MANAGER_DATA_WRITE ||
        authorizations.PERSONNEL_MANAGER_DATA_VIEW ||
        authorizations.HEAD_OF_PERSONNEL_AGENCY_VIEW ||
        authorizations.HEAD_OF_PERSONNEL_AGENCY_WRITE
    )) {
        match['$match']['user.age.code'] = `${Agencies.PERSONNAL}`
    }
    if (user.category === UserCategory.SUPER_ADMIN) { match['$match']['user.age.code'] = null }
}
