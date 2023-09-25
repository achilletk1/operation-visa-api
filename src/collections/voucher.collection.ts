import { getDatabase } from './config';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';
import { Voucher } from '../models/settings';

const collectionName = 'visa_operations_vouchers';
export const voucherCollection = {
    getVouchers: async (params: any, offset: any, limit: any) => {
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

    insertVoucher: async (data: any) => {
        const database = await getDatabase();
        const { insertedId } = await database.collection(collectionName).insertOne(data);
        return { insertedId };
    },
    getVoucherById: async (id: string): Promise<any> => {
        const database = await getDatabase();
        try {
            return await database.collection(collectionName)
                .findOne({ _id: new ObjectId(id.toString()) });
        } catch (error) {
            return null;
        }
    },
    updateVoucherById: async (id: any, set: Voucher, unset?: Voucher) => {
        const database = await getDatabase();
        delete set._id;
        let query: any;
        delete set._id;
        if (!isEmpty(set)) { query = { $set: set }; }
        if (!isEmpty(unset)) { query = { ...query, $unset: unset }; }


        return await database.collection(collectionName).updateOne({ _id: new ObjectId(id.toString()) }, query);
    },
    getVoucherBy: async (params: any) => {
        const database = await getDatabase();

        const result = await database.collection(collectionName).find(params).toArray();
        return result
    },

    deleteVoucher: async (id: string) => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
        return result
    },

    deleteVoucherMany: async (field: any) => {
        const database = await getDatabase();
        const result = await database.collection(collectionName).deleteMany(field);
        return result
    },

};
