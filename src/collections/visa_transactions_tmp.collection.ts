import { ObjectId } from 'mongodb';
import { getDatabase } from './config';

const collectionName = 'visa_transactions_tmp';

export const visaTransactinnsTmpCollection = {

    getAllVisaTransactionTmps: async (fields?: any): Promise<any[]> => {
        const database = await getDatabase();
        return await database.collection(collectionName).find(fields || {}).sort({ _id: -1 }).toArray();
    },

    getVisaTransactionTmpBy: async (filters: any): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne(filters || {});
    },

    insertVisaTransactionTmp: async (transaction: any): Promise<any> => {
        const database = await getDatabase();
        if (!transaction) { return; }
        return await database.collection(collectionName).insertOne(transaction);
    },

    insertVisaTransactionTmps: async (transactions: any[]): Promise<any> => {
        const database = await getDatabase();
        if (!transactions || transactions.length === 0) { return; }
        return await database.collection(collectionName).insertMany(transactions);
    },

    updateVisaTransactionTmpById: async (id: string, transaction: any): Promise<any> => {
        const database = await getDatabase();
        delete transaction._id;
        return await database.collection(collectionName).updateOne(
            { _id: new ObjectId(id), },
            { $set: { ...transaction } }
        );
    },

    deleteVisaTransactionTmpById: async (id: any): Promise<any> => {
        if (!id) { return; }
        const database = await getDatabase();
        return database.collection(collectionName).deleteOne({ _id: new ObjectId(id.toString()) });
    },
    deleteManyVisaTransactionsTmpById: async (ids: any[]): Promise<any> => {
        if (!ids) { return; }
        const database = await getDatabase();
        return database.collection(collectionName).deleteMany({ _id: { $in: ids } });
    },

}