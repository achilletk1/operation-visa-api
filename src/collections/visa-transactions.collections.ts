import { VisaTransaction } from './../models/visa-operations';
import { getDatabase } from './config';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';

const collectionName = 'visa_transactions';

export const visaTransactionsCollection = {

    getVisaTransactions: async (params: any, offset: any, limit: any): Promise<any> => {
        const database = await getDatabase();
        let query = {};
        const startIndex = (offset - 1) * limit;
        query = { ...params }
        const total = await database.collection(collectionName).find(query).count();
        const data = await database.collection(collectionName).find(query).sort({ userCode: 1 }).skip(startIndex).limit(limit).toArray();
        return { data, total };
    },

    insertTransaction: async (data: any): Promise<any> => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId;
    },

    insertTransactions: async (data: any[]): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).insertMany(data);
    },

    getVisaTransactionsById: async (id: string): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ _id: new ObjectId(id.toString()) });
        // try {
        // } catch (error) {
        //     return null;
        // }
    },

    updateVisaTransactionById: async (id: string, set: VisaTransaction): Promise<any> => {
        const database = await getDatabase();
        delete set._id;
        let query: any;
        delete set._id;
        if (!isEmpty(set)) { query.$set = { ...set }; }

        return await database.collection(collectionName).updateOne({ _id: new ObjectId(id.toString()) }, query);
    },

    getVisaTransactionsBy: async (params: any): Promise<any> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).find(params).toArray();
        return result
    },

    deleteVisaTransactionsMany: async (field: any): Promise<any> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteMany(field);
        return result
    },

    getVisaTransactionsForNotCustomersBy: async (params: any): Promise<any> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).findOne(params);
        return result
    },

};
