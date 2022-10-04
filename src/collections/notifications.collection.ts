import { Notification } from "../models/notification";
import { ObjectId } from "mongodb";
import { getDatabase } from "./config";

const collectionName = 'notifications';

export const notificationsCollection = {

    getNotifications: async (params: any, offset: any, limit: any,range: any) => {
        const database = await getDatabase();
        let query = {...params};
        const startIndex = (offset - 1) * limit;
        if (range) { query['dates.createdAt'] = { $gte: range?.start, $lte: range?.end }; }

        const total = await database.collection(collectionName).find(query).count();
        const data = await database.collection(collectionName).find(query).skip(startIndex).limit(limit).toArray();
        return { data, total };

    },

    getNotificationBy: async (filters: any): Promise<Notification | any> => {
        const database = await getDatabase();
        if (filters?._id) { filters._id = new ObjectId(filters?._id) }
        return database.collection(collectionName).findOne({ ...filters });
    },
    
    insertNotifications: async (data: any) => {
        const database = await getDatabase();
        console.log("Insertion de la notification dans l'API");
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return { insertedId };
    },


}
