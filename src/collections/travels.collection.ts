import { isEmpty } from "lodash";
import { ObjectId } from "mongodb";
import { Travel, TravelType } from "../models/travel";
import { getDatabase } from "./config";
import { AverageTimeJustifyTravelData, generateConsolidateData, statusOperation } from "./helpers/reporting.collection.helper";

const collectionName = 'visa_operations_travels';

export const travelsCollection = {

    getTravelsBy: async (filters: any): Promise<Travel[]> => {
        const database = await getDatabase();
        const query = { ...filters };
        return await database.collection(collectionName).find(query).toArray();
    },

    getTravelById: async (id: any): Promise<Travel> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ _id: new ObjectId(id) });
    },

    getTravelBy: async (filters: any): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ ...filters});
    },

    updateTravelsById: async (id: string, set: Travel, unset?: Travel): Promise<any> => {
        const database = await getDatabase();
        const query: any = {};
        delete set._id;
        if (!isEmpty(set)) { query.$set = { ...set } }

        if (!isEmpty(unset)) { query.$unset = { ...unset } }

        const result = await database.collection(collectionName).updateOne({ _id: new ObjectId(id) }, query);
        return result.upsertedId;
    },


    getTravels: async (params: any, offset: any, limit: any): Promise<any> => {
        const database = await getDatabase();
        let { end, start } = params;
        let query = {};

        if (end && start) {
            end = parseInt(end);
            start = parseInt(start);
            query = { 'dates.created': { $gte: start, $lte: end } };
            delete params.end;
            delete params.start;
        }

        const startIndex = (offset - 1) * limit;

        query = { ...query, ...params }
        console.log(query);

        const total = await database.collection(collectionName).find(query).count();
        const data = await database.collection(collectionName).find(query).sort({ currentMonth: 1 }).skip(startIndex).limit(limit).toArray();
        return { data, total };

    },


    getTravelReport: async (params: any) => {

        const database = await getDatabase();
        const query = generateConsolidateData(params)
        return await database.collection(collectionName).aggregate(query).toArray();
    },

    getStatusOperationTravelReport: async (params: any) => {
        const database = await getDatabase();

        const query = statusOperation(params);

        return await database.collection(collectionName).aggregate(query).toArray();

    },

    getAverageTimeJustifyTravelReport: async (params: any) => {
        const database = await getDatabase();

       const query = AverageTimeJustifyTravelData(params);

        return await database.collection(collectionName).aggregate(query).toArray();

    },

    getChartDataTravel: async (params?: any): Promise<any> => {
        const database = await getDatabase();

        let query = [];
        let matchValue:any = {'$match': {status: 200}};
        // let matchDate = {};

        const { travelType } = params

        // Add date filter
        // if (param.start && param.end) { query.push({ $match: { 'dates.created': { $gte: param.start, $lte: param.end } } }); }

        if (+travelType) {
            matchValue['$match'].travelType =   +travelType ;
        }

        query = [
            matchValue,
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


        const data = await database.collection(collectionName).aggregate(query).toArray();
        return data;
    },
    insertTravel: async (data: Travel): Promise<any> => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId.toString();
    },

    getUsersTravelId: async (travelType: TravelType): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).aggregate([{ $match: { travelType } }, { $group: { _id: '$user' } }]).toArray();
    },
    deleteTravels: async (field: any): Promise<any> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteMany(field);
        return result
    },

    getAllTravelsList: async (fields: any) => {
        const database = await getDatabase();
        const query = { ...fields };
        return await database.collection(collectionName).find(query).sort({ 'dates.created': -1 }).toArray();
    },

    getTravelsList: async (id: string): Promise<any> => {
        const database = await getDatabase();        
       return await database.collection(collectionName).findOne({ _id: new ObjectId(id) });

    },

   

}
