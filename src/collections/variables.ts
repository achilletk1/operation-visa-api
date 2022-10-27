import { getDatabase } from './config';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';


const collectionName = 'variables';
export const VariableCollection = {
    getVariables: async (params: any, offset: any, limit: any) => {
        const database = await getDatabase();
        let { end, start } = params;
        let query = {};
        const startIndex = (offset - 1) * limit;

        query = { ...params }
        const total = await database.collection(collectionName).find(query).count();
        const data = await database.collection(collectionName).find(query).toArray();
        return { data, total };

    },

    insertVariable: async (data: any) => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return { insertedId };
    },


    deleteVariable: async (id: string) => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
        return result
    },
};
