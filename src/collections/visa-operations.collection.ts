import * as helper from './../services/helpers/visa-operations.service.helper';
import { getDatabase } from './config';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';

const collectionName = 'visa_operations';

export const visaOperationsCollection = {

    getVisaOperations: async (params: any, offset: any, limit: any) => {
        const database = await getDatabase();
        let { end, start } = params;
        let query = {};

        if (end && start) {
            end = parseInt(end);
            start = parseInt(start);
            query = { 'currentMonth': { $gte: start, $lte: end } };
            delete params.end;
            delete params.start;
        }

        const startIndex = (offset - 1) * limit;

        query = { ...query, ...params }
        const total = await database.collection(collectionName).find(query).count();
        const data = await database.collection(collectionName).find(query).sort({ currentMonth: 1 }).skip(startIndex).limit(limit).toArray();
        return { data, total };

    },

    getVisaOperationsUsersId: async () => {
        const database = await getDatabase();
        return await database.collection(collectionName).aggregate([{
            $group: {
                _id: '$userId'
            }
        }]).toArray();
    },

    getNotSubscriberCLientsCodes: async () => {
        const database = await getDatabase();
        return await database.collection(collectionName).aggregate([{
            $match: {
                userId: { $exists: false }
            }
        },
        {
            $group: {
                _id: '$clientCode'
            }
        }]).toArray();
    },

    insertOperations: async (data: any) => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId;
    },

    getVisaOperationsById: async (id: string) => {
        const database = await getDatabase();
        try {
            return await database.collection(collectionName)
                .findOne({ _id: new ObjectId(id.toString()) });
        } catch (error) {
            return null;
        }
    },

    getVisaOperationBy: async (filter: any): Promise<any> => {
        const database = await getDatabase();
        try {
            return await database.collection(collectionName)
                .findOne(filter);
        } catch (error) {
            return null;
        }
    },

    getAttachementsByOperationId: async (id: string): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ _id: new ObjectId(id.toString()) });
        // try {
        // } catch (error) {
        //     return null;
        // }
    },

    updateVisaOperationById: async (id: any, set: any) => {
        const database = await getDatabase();
        await helper.updateOperationStatus(set);
        delete set._id;
        const query = { $set: {} };
        delete set._id;
        if (!isEmpty(set)) { query.$set = { ...set }; }

        return await database.collection(collectionName).updateOne({ _id: new ObjectId(id.toString()) }, query);
    },

    updateVisaOperationStatus: async (id: any, operation: any) => {
        const database = await getDatabase();
        const query = { $set: operation };
        return await database.collection(collectionName).updateOne({ _id: new ObjectId(id.toString()) }, query);
    },

    getVisaOperationByMonth: async (params: any) => {
        const database = await getDatabase();
        try {
            let { end, start } = params;
            let query = {};
            if (end && start) {
                end = parseInt(end);
                start = parseInt(start);
                query = { 'date.operation': { $gte: start, $lte: end } };
                delete params.end;
                delete params.start;
            }
            return await database.collection(collectionName).findOne(query);
        } catch (error) {
            return null;
        }

    },

    getVisaOperationsBy: async (params: any): Promise<any[]> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).find(params).toArray();
        return result;
    },

};