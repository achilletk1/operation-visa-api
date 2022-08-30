import { isEmpty } from "lodash";
import { ObjectId } from "mongodb";
import { getDatabase } from "./config";

const collectionName = 'settings_files';

export const settingsFilesCollection = {

    getSettingsFilesBy: async (filters: any) => {
        const database = await getDatabase();
        const { types } = filters;
        if (types) {
            delete filters.types;
            filters = { ...filters, type: { $in: [...types] } };
        }
        const query = { ...filters };

        return await database.collection(collectionName).find(query).toArray();

    },

    getSettingsFilesArray: async (filters: any, offset: any, limit: any) => {
        const database = await getDatabase();
        const { types } = filters;
        if (types) {
            delete filters.types;
            filters = { ...filters, type: { $in: [...types] } };
        }
        const query = { ...filters };
        const startIndex = (offset - 1) * limit;
        const total = await database.collection(collectionName).find(query).count();
        const data = await database.collection(collectionName).find(query).skip(startIndex).limit(limit || 40).toArray();

        return { data, total };
    },

    updateSettingsFilesById: async (id, set) => {
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

}
