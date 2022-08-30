import { getDatabase } from './config';

const collectionName = 'files';

export const filesCollection = {

    getFile: async (fields: any) => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne(fields);
    },

    saveFile: async (data: any): Promise<any> => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId;
    },
    updateFile: async (code: any, data: any): Promise<any> => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).updateOne({ key: code }, { $set: data });
        return result;
    },

    deleteFile: async (key: any) => {
        const database = await getDatabase();
        return await database.collection(collectionName).deleteOne({ key });
    },

};
