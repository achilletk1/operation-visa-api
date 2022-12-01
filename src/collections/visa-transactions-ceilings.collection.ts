import { getDatabase } from './config';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';

const collectionName = 'visa_transactions_ceillings';
export const visaTransactionsCeillingsCollection = {

    getVisaTransactionsCeillings: async (params: any, offset: any, limit: any) => {
        const database = await getDatabase();
        let { end, start } = params;
        let query = {};
        const startIndex = (offset - 1) * limit;

        if (end && start) {
            end = parseInt(end);
            start = parseInt(start);
            delete params.end;
            delete params.start;
        }

        query = { ...params }
        const total = await database.collection(collectionName).find(query).count();
        const data = await database.collection(collectionName).find(query).skip(startIndex).limit(limit).toArray();
        return { data, total };

    },

    insertVisaTransactionsCeillings: async (data: any) => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId;
    },
    getVisaTransactionsCeillingsById: async (id: string) => {
        const database = await getDatabase();
        try {
            return await database.collection(collectionName)
                .findOne({ _id: new ObjectId(id.toString()) });
        } catch (error) {
            return null;
        }
    },
    updateVisaTransactionsCeillingsById: async (id: string, set: any) => {
        const database = await getDatabase();
        delete set._id;
        let query: any;
        delete set._id;
        if (!isEmpty(set)) { query.$set = { ...set }; }

        return await database.collection(collectionName).updateOne({ _id: new ObjectId(id.toString()) }, query);
    },
    getVisaTransactionsCeillingsBy: async (params: any) => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).find(params).toArray();
        return result
    },

    getVisaTransactionsCeilingBy: async (params: any): Promise<any> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).findOne(params);
        return result
    },

    deleteVisaTransactionsCeiling: async (id: string) => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
        return result
    },
};
