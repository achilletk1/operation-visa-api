import { Agencies, OpeVisaStatus as OVS } from 'modules/visa-operations';
import { matchUserAuthorizationsDatas } from 'common/helpers';
import { authorizations } from 'modules/auth/profile';
import httpContext from 'express-http-context';
import { UserCategory } from 'modules/users';
import { logger } from "winston-config";
import { get } from "lodash";
import moment from "moment";

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

    // match user authorizations datas
    matchUserAuthorizationsDatas(match);

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
    matchUserAuthorizationsDatas(match);
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
    matchUserAuthorizationsDatas(match);

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
    matchUserAuthorizationsDatas(match);

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
    matchUserAuthorizationsDatas(match);

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
    const authorizationsUser: string[] = httpContext.get('authorizations') || [];
    const { SUPER_ADMIN, ADMIN, SUPPORT, PERSONNEL_MANAGER, ACCOUNT_MANAGER, AGENCY_HEAD, HEAD_OF_PERSONNEL_AGENCY } = UserCategory;

    if (!authorizationsUser.length || [SUPER_ADMIN, ADMIN, SUPPORT].includes(user?.category)) { return; }

    match['$match']['user.age.code'] = { $nin: [`${Agencies.PERSONNAL}`] };

    (authorizationsUser.includes(
        authorizations.PERSONNEL_MANAGER_DATA_WRITE ||
        authorizations.PERSONNEL_MANAGER_DATA_VIEW ||
        authorizations.HEAD_OF_PERSONNEL_AGENCY_VIEW ||
        authorizations.HEAD_OF_PERSONNEL_AGENCY_WRITE
    )) && (match['$match']['user.age.code'] = `${Agencies.PERSONNAL}`);

    ([PERSONNEL_MANAGER, ACCOUNT_MANAGER].includes(user?.category)) && (match['$match']['user.userGesCode'] === `${user?.gesCode}`);
    ([HEAD_OF_PERSONNEL_AGENCY, AGENCY_HEAD].includes(user?.category)) && (match['$match']['user.age.code'] = `${user?.age?.code}`);

};

const groupFormalNoticeAndBlockedClientCodes = {
    $group: {
        _id: '',
        formalNoticeClientCodes: {
            $push: {
                $cond: {
                    if: { $lte: ['$$CURRENT.maxDaysDifference', 8] },
                    then: "$_id",
                    else: '$$REMOVE'
                }
            }
        },
        blockedClientCodes: {
            $push: {
                $cond: {
                    if: { $gt: ['$$CURRENT.maxDaysDifference', 8] },
                    then: "$_id",
                    else: '$$REMOVE'
                }
            }
        }
    }
};

export function listOfUntimelyClientCodesProofTravelAggregation(filter: any = {}) {
    return [
        {
            $match: {
                isUntimely: true, 'proofTravel.status': { $nin: [OVS.JUSTIFY, OVS.CLOSED] }, ...filter
                // $and: [
                //     { isUntimely: true, ...filter },
                //     {
                //         $or: [
                //             { 'proofTravel.status': { $nin: [OpeVisaStatus.JUSTIFY, OpeVisaStatus.CLOSED] } },
                //             {
                //                 $and: [
                //                     { 'transactions.isExceed': true },
                //                     { status: { $nin: [OpeVisaStatus.JUSTIFY, OpeVisaStatus.CLOSED] } },
                //                 ]
                //             }
                //         ]
                //     }
                // ]
            },
        },
        {
            $project: {
                _id: { $toString: '$_id' },
                transactions: [{ date: { $arrayElemAt: ['$transactions.date', 0] } }],
                travelType: 1,
                clientCode: '$user.clientCode'
            }
        },
        { // join first transactions date on travel if it exists
            $lookup: {
                from: 'visa_operations_travel_months',
                localField: '_id',
                foreignField: 'travelId',
                let: { id: '$_id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$$id', '$travelId'] } } },
                    { $sort: { month: -1 } },
                    { $limit: 1 },
                    { $project: { _id: 0, date: { $first: '$transactions.date' } } }
                ],
                as: 'joinTransactions'
            }
        },
        {
            $project: {
                _id: 0,
                clientCode: 1,
                transactions: { $cond: [{ $eq: ['$travelType', 100] }, '$transactions', '$joinTransactions'] }
            }
        },
        {
            $match: { $expr: { $eq: [{ $type: { $first: '$transactions.date' } }, 'string'] } }
        },
        {
            $addFields: {
                differenceInDays: {
                    $subtract: [
                        {
                            $dateDiff: {
                                startDate: { $dateFromString: { dateString: { $arrayElemAt: ['$transactions.date', 0] }, format: '%d/%m/%Y %H:%M:%S' } },
                                endDate: new Date(),
                                unit: 'day'
                            }
                        },
                        30
                    ]
                }
            }
        },
        { $group: { _id: '$clientCode', maxDaysDifference: { $max: '$differenceInDays' } } },
        { ...groupFormalNoticeAndBlockedClientCodes },
    ];
}

export function listOfUntimelyClientCodesTransactionsAggregation(filter: any = {}, usersClientCodeOrId: string[] = [], scope: 'travel' | 'online-payment' | 'travel-month') {
    let selectFilter: any = { 'user.clientCode': { $nin: usersClientCodeOrId } };
    (scope === 'travel-month') && (selectFilter = { 'userId': { $nin: usersClientCodeOrId } });

    return [
        { $match: { isUntimely: true, 'transactions.isExceed': true, status: { $nin: [OVS.JUSTIFY, OVS.CLOSED] }, ...filter, ...selectFilter } },
        {
            $project: {
                _id: 0,
                clientCode: { $first: '$transactions.clientCode' },
                daysDifferenceArray: {
                    $map: {
                        input: '$transactions',
                        as: 'transaction',
                        in: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $eq: ['$$transaction.isExceed', true] },
                                        { $eq: [{ $type: '$$transaction.date' }, 'string'] },
                                        {
                                            $and: [
                                                { $ne: ['$$transaction.status', 200] },
                                                { $ne: ['$$transaction.status', 600] }
                                            ]
                                        }
                                    ]
                                },
                                then: {
                                    $subtract: [
                                        {
                                            $dateDiff: {
                                                startDate: { $dateFromString: { dateString: '$$transaction.date', format: '%d/%m/%Y %H:%M:%S' } },
                                                endDate: new Date(),
                                                unit: 'day'
                                            }
                                        },
                                        30
                                    ]
                                }, // Calculer la différence de date si la transaction correspond aux critères
                                else: '$$REMOVE' // Supprimer si la transaction ne correspond pas aux critères
                            }
                        }
                    }
                }
            }
        },
        { $unwind: { path: '$daysDifferenceArray' } },
        { $group: { _id: '$clientCode', maxDaysDifference: { $max: '$daysDifferenceArray' } } },
        { ...groupFormalNoticeAndBlockedClientCodes },
    ];
}

export function generateImportationUntimelyAggregation() {
    return [
        {
            $match: {
                isUntimely: true, status: { $nin: [OVS.JUSTIFY, OVS.CLOSED] }, finalPayment: true
            }
        }
    ];
}

const t =
{
    "user": {
        "_id": "658296ce22170059383e5991",
        "code": "70017",
    },
    "transactions": [
        {
            "_id": {
                "$oid": "6645ffdd3f46bb7384ddc845"
            },
            "date": "16/05/2024 12:26:07"
        },
        {
            "_id": {
                "$oid": "6645ffdd3f46bb7384ddc847"
            },
            "date": "16/05/2024 21:32:42",
            "status": 200,
            "isExceed": true
        },
        {
            "_id": {
                "$oid": "6645ffdd3f46bb7384ddc83b"
            },
            "date": "17/05/2024 00:15:02",
            "status": 200,
            "isExceed": true
        },
        {
            "_id": {
                "$oid": "6645ffdd3f46bb7384ddc83a"
            },
            "date": "17/05/2024 09:20:50",
            "status": 100,
            "isExceed": true
        },
        {
            "_id": {
                "$oid": "6645ffdd3f46bb7384ddc848"
            },
            "date": "17/05/2024 09:44:03",
            "status": 100,
            "isExceed": true
        },
    ]
};
