import { Notification } from "../models/notification";
import { getDatabase } from "./config";
import { ObjectId } from "mongodb";
import { isEmpty } from "lodash";

const collectionName = 'notifications';

export const notificationsCollection = {

    getNotifications: async (params: any, offset: any, limit: any, range: any) => {

        const database = await getDatabase();
        let query = { ...params };

        const startIndex = (offset - 1) * limit;
        if (range) { query['dates.createdAt'] = { $gte: range?.start, $lte: range?.end }; }
        if (offset & limit) {
            const total = await database.collection(collectionName).find(query).count();
            const data = await database.collection(collectionName).find(query).skip(startIndex).limit(limit).toArray();
            return { data, total };
        }
        const total = await database.collection(collectionName).find(query).count();
        const data = await database.collection(collectionName).find(query).toArray();
        return { data, total };
    },

    getNotificationBy: async (filters: any): Promise<Notification | any> => {
        const database = await getDatabase();
        if (filters?._id) { filters._id = new ObjectId(filters?._id) }
        return database.collection(collectionName).findOne({ ...filters });
    },

    insertNotifications: async (data: any) => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return { insertedId };
    },
    updateNotification: async (id: string, set: any) => {
        const database = await getDatabase();
        delete set?._id;
        let query: any = {$set:{}};
        delete set?._id;
        if (!isEmpty(set)) { query.$set = { ...set }; }

        return await database.collection(collectionName).updateOne({ _id: new ObjectId(id.toString()) }, query);
    },
}
