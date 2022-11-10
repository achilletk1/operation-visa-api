import { isEmpty } from "lodash";
import { ObjectId } from "mongodb";
import { Travel, TravelType } from "../models/travel";
import { getDatabase } from "./config";

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

    insertTravel: async (data: Travel): Promise<any> => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId.toString();
    },

    getUsersTravelId: async (travelType: TravelType): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).aggregate([{ $match: { travelType } }, { $group: { _id: '$user' } }]).toArray();
    },

}
