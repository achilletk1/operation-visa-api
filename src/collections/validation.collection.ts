import { isEmpty } from "lodash";
import { ObjectId } from "mongodb";
import { getDatabase } from "./config";
import { UserValidator } from "../models/user-validator";

const collectionName = 'visa_operations_validators';

export const validationsCollection = {

    getUserValidatorsBy: async (filters: any): Promise<UserValidator[]> => {
        const database = await getDatabase();
        const query = { ...filters };
        return await database.collection(collectionName).find(query).sort({ 'dates.created': -1 }).toArray();
    },


    getUserLevelListBy: async (userId: string): Promise<UserValidator[]> => {
        const database = await getDatabase();
        return await database.collection(collectionName).find({ userId: { $ne: userId }, enabled: true }).project({ _id: 0, level: 1 }).toArray();
    },

    getUserValidatorById: async (id: any): Promise<UserValidator> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ _id: new ObjectId(id) });
    },

    getUserValidatorBy: async (filters: any): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ ...filters });
    },

    updateUserValidatorsById: async (id: string, set: any, unset?: UserValidator): Promise<any> => {
        const database = await getDatabase();
        const query: any = {};
        delete set._id;
        if (!isEmpty(set)) { query.$set = { ...set } }

        if (!isEmpty(unset)) { query.$unset = { ...unset } }

        const result = await database.collection(collectionName).updateOne({ _id: new ObjectId(id) }, query);
        return result;
    },


    getUserValidators: async (params: any, offset: any, limit: any, range: any): Promise<any> => {
        const database = await getDatabase();
        let { end, start } = range;
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
        const data = await database.collection(collectionName).find(query).sort({ 'dates.created': -1 }).skip(startIndex).limit(limit).toArray();
        return { data, total };

    },

    insertUserValidator: async (data: UserValidator): Promise<any> => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId.toString();
    },

    deleteUserValidators: async (field: any): Promise<any> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteMany(field);
        return result
    },

    getMaxValidationLevel: async (): Promise<any> => {
        const database = await getDatabase();

        const query = [
            { $match: { enabled: true, } },
            { $group: { _id: null, level: { $max: "$level" } } }
        ]
        return await database.collection(collectionName).aggregate(query).toArray();
    },

}