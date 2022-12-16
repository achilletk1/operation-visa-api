import { getDatabase } from './config';
import { ObjectID } from 'mongodb';

const collectionName = 'queue';

export const queueCollection = {

    add: async (data: any) => {
        const database = await getDatabase();
        return await database.collection(collectionName).insertOne(data);
    },

    addTransInAfb160Queue: async (data: any) => {
        const database = await getDatabase();
        return await database.collection('queue_afb160').insertOne(data);
    },

}