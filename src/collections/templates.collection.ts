import { getDatabase } from './config';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';
import { TemplateForm } from '../models/templates';

const collectionName = 'visa_operations_templates';
export const templatesCollection = {
    getTemplates: async (params: any, offset?: any, limit?: any) => {
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
        const data = await database.collection(collectionName).findOne(query);
        return { data, total };

    },
    getAllTemplates: async (params: any, offset: any, limit: any) => {
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
        const data = await database.collection(collectionName).find(query).sort({ userCode: 1 }).skip(startIndex).limit(limit).toArray();
        return { data, total };

    },

    insertTemplate: async (data: any) => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return { insertedId };
    },
    getTemplateById: async (id: string): Promise<any> => {
        const database = await getDatabase();
        try {
            return await database.collection(collectionName)
                .findOne({ _id: new ObjectId(id.toString()) });
        } catch (error) {
            return null;
        }
    },
    updateTemplateById: async (id: any, set: TemplateForm, unset?: TemplateForm) => {
        const database = await getDatabase();
        delete set._id;
        let query: any;
        delete set._id;
        if (!isEmpty(set)) { query = { $set: set }; }
        if (!isEmpty(unset)) { query = { ...query, $unset: unset }; }


        return await database.collection(collectionName).updateOne({ _id: new ObjectId(id.toString()) }, query);
    },
    getTemplatesBy: async (params: any) => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).find(params).toArray();
        return result
    },
    getTemplateBy: async (params: any) => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).findOne(params);
        return result
    },

    deleteTemplate: async (id: string) => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
        return result
    },

    deleteTemplateMany: async (field: any) => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteMany(field);
        return result
    },

};
