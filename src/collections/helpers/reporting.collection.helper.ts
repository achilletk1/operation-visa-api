import { get, isEmpty } from "lodash";
import moment = require("moment");
import { logger } from "../../winston";

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
}

// const getAmountPerOperationsType = () => {
//     return [
//         { $match: { type: { $in: [102, 103, 201, 202, 203, 204, 205, 206, 301, 302, 303] } } }, {
//             $group: {
//                 _id: "$type",
//                 amount: { "$sum": "$amounts.amount" }

//             }
//         }, {
//             $project: {
//                 _id: 0,
//                 type: "$_id",
//                 total: "$amount"
//             }
//         }
//     ]
// }

// const getAmountPerStatus = (type?: number) => {
//     const query = [];

//     if (type) {
//         query.push({
//             $match: {
//                 type
//             }
//         })
//     }
//     query.push(
//         {
//             $match: {
//                 status: { $in: [200, 300, 400] }
//             }
//         }, {
//         $group: {
//             _id: "$status",
//             amount: { "$sum": "$amounts.amount" }

//         }
//     }, {
//         $project: {
//             _id: 0,
//             status: "$_id",
//             total: "$amount"
//         }
//     });
//     return query
// }

export const generateChartByType = (data: any) => {
    const mapped = data.map(elt => {
        return {
            ...elt,
            dayOfWeek: moment(elt.date).day(),
            dayOfMonth: moment(elt.date).month(),
            monthOfYear: moment(elt.date).year()
        }
    });

    // Calculate week chart
    const week = generateChartWeekData(mapped);

    // Calculate month chart
    const month = generateChartMonthData(mapped);

    // Calculate year chart
    const year = generateChartYearData(mapped);

    return { week, month, year };
}

export const generateConsolidateData = (param: any) => {

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
}
export const statusOperation = (params: any) => {

    const { travelType, filterStatus, start, end } = params

    const match: any = { '$match': {} }

    if (start && end) {
        match['$match']['dates.created'] = { $gte: start, $lte: end };
    }
    if (travelType) {
        match['$match']['travelType'] = travelType;
    }

    if (filterStatus === 'NUMBER_STATUS') {
        let query = [
            {
                $group: {
                    _id: '$status',
                    valueResult: { '$sum': 1 }
                }
            }
        ]
        if (match['$match']) { query.unshift(match) }
        return query
    } else {
        let query = [
            { $unwind: '$transactions' },
            {
                $group: {
                    _id: '$status',
                    valueResult: { '$sum': '$transactions.amount' }
                }
            }
        ]
        if (match['$match']) { query.unshift(match) }
        return query

    }

}

export const AverageTimeJustifyTravelData = (params: any) => {

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

}



const generateChartWeekData = (figures: any) => {
    const arrLun = figures.filter(elt => elt.dayOfWeek === 1);
    const Lun = avg(arrLun, 'total');

    const arrMar = figures.filter(elt => elt.dayOfWeek === 2);
    const Mar = avg(arrMar, 'total');

    const arrMer = figures.filter(elt => elt.dayOfWeek === 3);
    const Mer = avg(arrMer, 'total');

    const arrJeu = figures.filter(elt => elt.dayOfWeek === 4);
    const Jeu = avg(arrJeu, 'total');

    const arrVen = figures.filter(elt => elt.dayOfWeek === 5);
    const Ven = avg(arrVen, 'total');

    const arrSam = figures.filter(elt => elt.dayOfWeek === 6);
    const Sam = avg(arrSam, 'total');

    const arrDim = figures.filter(elt => elt.dayOfWeek === 0);
    const Dim = avg(arrDim, 'total');

    return {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        data: [Lun, Mar, Mer, Jeu, Ven, Sam, Dim]
    };
}

const generateChartMonthData = (figures: any) => {
    const labels = [];
    const data = [];

    for (let index = 1; index <= 31; index++) {
        const arr = figures.filter(elt => elt.dayOfMonth === index);
        const total = avg(arr, 'total')
        labels.push(`${index}`);
        data.push(total);
    }

    return { labels, data };
}

const generateChartYearData = (figures: any) => {
    const arrJan = figures.filter(elt => elt.monthOfYear === 0);
    const Jan = avg(arrJan, 'total');

    const arrFev = figures.filter(elt => elt.monthOfYear === 1);
    const Fev = avg(arrFev, 'total');

    const arrMar = figures.filter(elt => elt.monthOfYear === 2);
    const Mar = avg(arrMar, 'total');

    const arrAvr = figures.filter(elt => elt.monthOfYear === 3);
    const Avr = avg(arrAvr, 'total');

    const arrMai = figures.filter(elt => elt.monthOfYear === 4);
    const Mai = avg(arrMai, 'total');

    const arrJun = figures.filter(elt => elt.monthOfYear === 5);
    const Jun = avg(arrJun, 'total');

    const arrJul = figures.filter(elt => elt.monthOfYear === 6);
    const Jul = avg(arrJul, 'total');

    const arrAou = figures.filter(elt => elt.monthOfYear === 7);
    const Aou = avg(arrAou, 'total');

    const arrSep = figures.filter(elt => elt.monthOfYear === 8);
    const Sep = avg(arrSep, 'total');

    const arrOct = figures.filter(elt => elt.monthOfYear === 9);
    const Oct = avg(arrOct, 'total');

    const arrNov = figures.filter(elt => elt.monthOfYear === 10);
    const Nov = avg(arrNov, 'total');

    const arrDec = figures.filter(elt => elt.monthOfYear === 11);
    const Dec = avg(arrDec, 'total');

    return {
        labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [Jan, Fev, Mar, Avr, Mai, Jun, Jul, Aou, Sep, Oct, Nov, Dec]
    };
}

const sum = (arr: any, key: any) => {
    let result = 0;
    arr.forEach(elt => result += elt[key]);
    return result;
}

const avg = (arr: any, key: any) => {
    const result = (sum(arr, key) / arr.length) / 1000000 || 0;
    return Math.ceil(result);
}
