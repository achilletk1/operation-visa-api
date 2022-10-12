import { isEmpty } from "lodash";
import { ObjectId } from "mongodb";
import { OnlinePaymentMonth } from "../models/online-payment";
import { getDatabase } from "./config";

const collectionName = 'visa_operations_online_payments';

export const onlinePaymentsCollection = {

    getOnlinePaymentsBy: async (filters: any): Promise<OnlinePaymentMonth[]> => {
        const database = await getDatabase();
        const query = { ...filters };
        return await database.collection(collectionName).find(query).toArray();
    },

    getOnlinePaymentById: async (id: any): Promise<OnlinePaymentMonth> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ _id: new ObjectId(id) });
    },

    getOnlinePaymentBy: async (fields: any): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne(fields);
    },

    updateOnlinePaymentsById: async (id: string, set: OnlinePaymentMonth) => {
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


    getOnlinePayments: async (params: any, offset: any, limit: any): Promise<any> => {
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

    insertVisaOnlinePayment: async (data: OnlinePaymentMonth): Promise<any> => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId.toString();
    },

    getUsersOnlinepaymentId: async (): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).aggregate([{ $group: { _id: '$userId' } }]).toArray();
    },

}
