import { RequestCeilingIncrease } from "../models/request-ceiling-increase";
import { ObjectID } from "mongodb";
import { getDatabase } from "./config";
import { isEmpty } from "lodash";

const collectionName = 'request_ceilling_increase';

export const requestCeillingIncreaseCollection = {

    insertRequestCeilling: async (data: any) => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return insertedId;
    },

    getRequestCeillingIncrease: async (fields: any, offset: any, limit: any, range: any) => {
        const database = await getDatabase();
        const startIndex = (offset - 1) * limit;
        const query = { ...fields };
        if (range) {
            query['dates.created'] = { $gte: range.start, $lte: range.end };
        }

        let total: any; let data: any[];

        if (query?.nameFilter) {

            const filter = query.nameFilter;
            delete query.nameFilter;
            const totalData = await database.collection(collectionName).find(query).toArray();
            total = totalData.map((doc) => { return `${doc.user.fullName}`.toLowerCase().includes(`${filter}`.toLowerCase()) ? doc : null; })?.filter((elt: any) => elt).length;
            data = await database.collection(collectionName).find(query).skip(startIndex).limit(limit).toArray();
            data = data.map((doc) => { return `${doc.user.fullName}`.toLowerCase().includes(`${filter}`.toLowerCase()) ? doc : null; })?.filter((elt: any) => elt);
            return { data, total };
        }
        total = await database.collection(collectionName).find(query).count();
        data = await database.collection(collectionName)
            .find(query).skip(startIndex).limit(limit).toArray();

        return { data, total };
    },

    getRequestBy: async (ceiling: RequestCeilingIncrease): Promise<any> => {

        const query = { ...ceiling };
        const account = { ...query.account };
        const ncp = { account }

        const database = await getDatabase();
        const data = await database.collection(collectionName).find(ncp).toArray();
        return data;
    },

    getCeilingById: async (id: string): Promise<any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ _id: new ObjectID(id) });
    },

    updateCeiling: async (id: string, set: any, unset?: any): Promise<any> => {

        const database = await getDatabase();
        const query: any = {};
        delete set._id;
        if (!isEmpty(set)) { query.$set = { ...set } }

        if (!isEmpty(unset)) { query.$unset = { ...unset } }

        return await database.collection(collectionName).updateOne({ _id: new ObjectID(id) },
            query
        );
    },

    getRequestCeilingBy: async () => {
        const database = await getDatabase();
        return await database.collection(collectionName).find({ status: { $in: [100, 400] } }).toArray();
    }

};