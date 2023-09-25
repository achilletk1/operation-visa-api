import { Visafile } from '../models/visa-file';
import { getDatabase } from './config';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';

const collectionName = 'visa_transactions_files';

export const visaTransactionsFilesCollection = {

    getVisaTransactionsFiles: async (filter: any, offset: any, limit: any): Promise<{ data: any[], total: number }> => {
        const database = await getDatabase();
        const startIndex = (offset - 1) * limit;
        let query = {};

        query = { ...filter };
        const total = await database.collection(collectionName).countDocuments(query);
        const data = await database.collection(collectionName).find(query).sort({ userCode: 1 }).skip(startIndex).limit(limit).toArray();
        return { data, total };
    },

    insertVisaTransactionsFiles: async (data: any): Promise<any> => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId.toString();
    },

    getVisaTransactionsFilesById: async (id: string): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ _id: new ObjectId(id.toString()) });
        // try {
        // } catch (error) {
        //     return null;
        // }
    },

    updateVisaTransactionsFilesById: async (id: any, set: Visafile, unset?: any): Promise<any> => {
        const database = await getDatabase();
        delete set._id;
        let query = { $set: {}, $unset: {} };
        delete set._id;
        if (!isEmpty(set)) { query.$set = { ...set }; }
        if (!isEmpty(unset)) { query.$unset = { ...unset }; }

        return await database.collection(collectionName).updateOne({ _id: new ObjectId(id.toString()) }, query);
    },

    getVisaTransactionsFilesBy: async (params: any): Promise<any> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).find(params).toArray();
        return result
    },

    getVisaTransactionsFileBy: async (params: any): Promise<any> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).findOne(params);
        return result
    },

    deleteVisaTransactionsFile: async (id: string): Promise<any> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
        return result
    },

    deleteVisaTransactionsFileMany: async (field: any): Promise<any> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteMany(field);
        return result
    },

};
