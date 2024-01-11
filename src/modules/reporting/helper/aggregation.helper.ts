import { logger } from "winston-config";
import { get, isArray } from "lodash";
import moment from "moment";

export const generateConsolidateData = (param: { status: any, start: number, end: number, travelType?: any }) => {

    const { start, end, status, travelType } = param

    const match: any = { '$match': { status: { $in: [status] } } }

    if (start && end) {
        match['$match']['dates.created'] = { $gte: start, $lte: end };
    }
    if (travelType) {
        match['$match']['travelType'] = travelType;
    }

    return [{
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
    }, {
        $project: {
            total: "$nbTravel._",
            amountTransactions: "$travelStat.total",
            nbreTransactions: "$travelStat.count",
        }
    }]
};

export const statusOperation = (params: { filterStatus: any, start: number, end: number, travelType?: any, agencyCode: string,regionCode:[] }) => {

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
    let query = [];
    if (agencyCode || regionCode) {
        query.push(
            {
                $lookup: {
                    from: "user",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $match: {
                    "userDetails.age.code": ((!regionCode  || regionCode.join(',').length <= 0) || (regionCode && agencyCode) ) ? agencyCode : { $in: regionCode.join(',') }
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
    if (match && match['$match']) { query.unshift(match); }

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

    return [
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

    ]

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
    let query = [];
    let matchValue: any = {};
    // let matchDate = {};

    const { travelType } = params

    // Add date filter
    // if (param.start && param.end) { query.push({ $match: { 'dates.created': { $gte: param.start, $lte: param.end } } }); }

    if (+travelType) {
        matchValue['$match'] = {}
        matchValue['$match'].travelType = +travelType;
    }
    if (matchValue['$match']) { query.unshift(matchValue); }
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

export const reportingFilterQuery = (range: any, type: number): any => {


    const query = [];
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

        const matchObj = {
            $match: {
                'dates.created': { $gte: _start, $lte: _end }
            }
        }
        query.push(matchObj);

    }


    let facet = { totalAmount: {}, statusAmount: {} }

    // Add amount per operations (btw, wtb, multi_transfer) query
    // facet.totalAmount = getAmountPerOperationsType();

    // Add amount per status query
    // facet.statusAmount = getAmountPerStatus(type);
    query.push({ $facet: facet });

    return query;
};
