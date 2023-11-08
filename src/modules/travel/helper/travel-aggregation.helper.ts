import { TravelType } from "../enum";

export const travelsForPocessingQuery = (params: { date: number; cli: string; travelType?: TravelType; }) => {
    const { date, cli, travelType } = params;
    const query = [];

    if (travelType) { query.push({ $match: { travelType } }) }
    query.push(...[
        {
            $project:
            {
                cli: "$user.clientCode",
                startDate: "$proofTravel.dates.start",
                endDate: "$proofTravel.dates.end",

                calcEndDate: {
                    $subtract: [
                        {
                            $dateSubtract: {
                                startDate: {
                                    $dateSubtract: {
                                        startDate: {
                                            $dateSubtract: {
                                                startDate: {
                                                    $dateSubtract: {
                                                        startDate: {
                                                            $dateAdd: {
                                                                startDate: {
                                                                    $toDate:
                                                                        "$proofTravel.dates.start",
                                                                },
                                                                unit: "month",
                                                                amount: "$proofTravel.nbrefOfMonth",
                                                            },
                                                        },
                                                        unit: "day",
                                                        amount: {
                                                            $subtract: [
                                                                {
                                                                    $dayOfMonth: {
                                                                        $toDate:
                                                                            "$proofTravel.dates.start",
                                                                    },
                                                                },
                                                                1,
                                                            ],
                                                        },
                                                    },
                                                },
                                                unit: "hour",
                                                amount: {
                                                    $hour: {
                                                        $toDate:
                                                            "$proofTravel.dates.start",
                                                    },
                                                },
                                            },
                                        },
                                        unit: "minute",
                                        amount: {
                                            $minute: {
                                                $toDate:
                                                    "$proofTravel.dates.start",
                                            },
                                        },
                                    },
                                },
                                unit: "second",
                                amount: {
                                    $add: [
                                        {
                                            $second: {
                                                $toDate:
                                                    "$proofTravel.dates.start",
                                            },
                                        },
                                        1,
                                    ],
                                },
                            },
                        },
                        new Date("1970-01-01"),
                    ],
                },
            },
        },
        {
            $project:
            {
                start: "$startDate",
                cli: 1,
                end: {
                    $cond: {
                        if: {
                            $lte: ["$endDate", null],
                        },
                        then: "$calcEndDate",
                        else: "$endDate",
                    },
                },
            },
        },
        {
            $match:
            {
                cli,
                start: { $lte: date },
                end: { $gte: date }
            }
        }]);

    return query;
}

export const getNotficationsQuery = [
    {
        $match:
        {
            notifications: {
                $exists: true,
            },
        },
    },
    {
        $unwind:
        {
            path: "$notifications",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $group:
        {
            _id: null,
            notifications: {
                $push: "$notifications",
            },
        },
    },

    {
        $project: {
            _id: 0,
            notifications: 1
        }
    },

]
