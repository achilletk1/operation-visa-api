import { isEmpty } from "lodash";
import { ObjectId, UpdateResult, WithId } from "mongodb";
import { Setting } from "../models/setting";
import { getDatabase } from "./config";

const collectionName = 'settings';

export const settingCollection = {

    getSettingsBy: async (filters: any): Promise<Setting[]> => {
        const database = await getDatabase();
        const query = { ...filters };
        return await database.collection(collectionName).find(query).toArray();
    },

    getSettingsByKey: async (key: any): Promise<WithId<Setting>> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({key});
    },

    updateSettingsById: async (id: string, set: Setting): Promise<UpdateResult> => {
        const database = await getDatabase();
        delete set._id;
        const query = { $set: {} };
        if (!isEmpty(set)) {
            query.$set = { ...set };
        }

        return await database
            .collection(collectionName)
            .updateOne({ _id: new ObjectId(id.toString()) }, query);
    },


    getSettings: async (params: any, offset: any, limit: any): Promise<{ data: Setting[], total: number }> => {
        const database = await getDatabase();
        let { end, start } = params;
        let query = {};

        if (end && start) {
            query = { 'dates.created': { $gte: +start, $lte: +end } };
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

    insertSetting: async (data: Setting): Promise<ObjectId> => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId;
    },
    deleteSetting: async (key:string): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).deleteOne({key});
    },

}
