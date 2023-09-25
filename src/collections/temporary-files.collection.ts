import { getDatabase } from './config';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';
import { TemporaryFile } from '../models/settings';

const collectionName = 'visa_operations_tempory_files';
export const temporaryFilesCollection = {

    insertTemporaryFile: async (data: any) => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return { insertedId };
    },
    getTemporaryFileById: async (id: string): Promise<any> => {
        const database = await getDatabase();
        try {
            return await database.collection(collectionName)
                .findOne({ _id: new ObjectId(id.toString()) });
        } catch (error) {
            return null;
        }
    },
    updateTemporaryFileById: async (id: any, set: TemporaryFile, unset?: TemporaryFile) => {
        const database = await getDatabase();
        delete set._id;
        let query: any;
        delete set._id;
        if (!isEmpty(set)) { query = { $set: set }; }
        if (!isEmpty(unset)) { query = { ...query, $unset: unset }; }


        return await database.collection(collectionName).updateOne({ _id: new ObjectId(id.toString()) }, query);
    },
    getTemporaryFilesBy: async (params: any) => {
        const database = await getDatabase();

        const result = await database.collection(collectionName).find(params).toArray();
        return result
    },

    deleteTemporaryFile: async (id: string) => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
        return result
    },

    deleteTemporaryFileMany: async (field: any) => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteMany(field);
        return result
    },

};
