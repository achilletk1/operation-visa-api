import { isEmpty } from "lodash";
import { ObjectId } from "mongodb";
import { TravelMonth } from "../models/travel";
import { getDatabase } from "./config";

const collectionName = 'visa_operations_travel_months';

export const travelMonthsCollection = {

    getTravelMonthsBy: async (filters: any): Promise<TravelMonth[]> => {
        const database = await getDatabase();
        const query = { ...filters };
        return await database.collection(collectionName).find(query).toArray();
    },

    getTravelMonthById: async (id: any): Promise<TravelMonth> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ _id: new ObjectId(id) });
    },

    getTravelMonthBy: async (fields: any): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne(fields);
    },

    updateTravelMonthsById: async (id: string, set: TravelMonth) => {
        const database = await getDatabase();
        delete set._id;
        const query = { $set: {} };
        delete set._id;
        if (!isEmpty(set)) {
            query.$set = { ...set };
        }

        return await database
            .collection(collectionName)
            .updateOne({ _id: new ObjectId(id.toString()) }, query);
    },


    getTravelMonths: async (params: any, offset: any, limit: any): Promise<any> => {
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
        
        const total = await database.collection(collectionName).find(query).count();
        const data = await database.collection(collectionName).find(query).sort({ currentMonth: 1 }).skip(startIndex).limit(limit).toArray();
        return { data, total };

    },

    insertVisaTravelMonth: async (data: TravelMonth): Promise<any> => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId.toString();
    },

}
