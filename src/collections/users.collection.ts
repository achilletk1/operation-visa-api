import { InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { User, UserCategory } from '../models/user';
import { getDatabase } from './config';
import { isEmpty } from 'lodash';

export interface Datas {
    data?: any[];
    total?: any;
}

const collectionName = 'users';

export const usersCollection = {

    getUsers: async (fields: any, offset?: any, limit?: any, range?: any): Promise<Datas> => {
        const database = await getDatabase();
        const startIndex = (offset - 1) * limit;
        const endIndex = offset * limit;

        let query = { ...fields };
        if (range) { query['dates.created'] = { $gte: range.start, $lte: range.end }; }

        if (query) {

            if (query.enabled) { query.enabled = (query.enabled === 'true') ? true : false; }

            if (query.enableWallet) { query.enableWallet = (query.enableWallet === 'true') ? true : false; }

        } else {
            query = { enabled: true };
        }

        let total: any; let data: any[];

        if (query?.nameFilter) {

            const filter = query.nameFilter;
            delete query.nameFilter;
            const totalData = await database.collection(collectionName).find(query).toArray();
            total = totalData.map((doc) => { return `${doc.lname} ${doc.fname}`.toLowerCase().includes(`${filter}`.toLowerCase()) ? doc : null; })?.filter((elt: any) => elt).length;
            data = await database.collection(collectionName).find(query).sort({ 'userCode': -1 }).skip(startIndex).limit(limit).toArray();
            data = data.map((doc) => { return `${doc.lname} ${doc.fname}`.toLowerCase().includes(`${filter}`.toLowerCase()) ? doc : null; })?.filter((elt: any) => elt);
            return { data, total };
        }

        total = await database.collection(collectionName).countDocuments(query);
        data = await database.collection(collectionName).find(query).sort({ 'userCode': -1 }).skip(startIndex).limit(limit).toArray();
        return { data, total };
    },

    insertUser: async (user: User | any): Promise<InsertOneResult<Document>> => {
        const database = await getDatabase();
        user.enabled = true;
        return database.collection(collectionName).insertOne(user);
    },

    getUserById: async (id: string): Promise<User | any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ _id: new ObjectId(id) });
    },

    getUserBy: async (filters: any): Promise<User | any> => {
        const database = await getDatabase();
        if (filters?._id) { filters._id = new ObjectId(filters?._id) }
        return database.collection(collectionName).findOne({ ...filters });
    },

    getUsersBy: async (filters: any, project?: any): Promise<any> => {
        const database = await getDatabase();
        if (filters._id) { filters._id = new ObjectId(filters._id) }
        if (filters?.category && filters?.category === 100499) { filters.category = { '$in': [100, 499] }; }
        return await database.collection(collectionName).find({ ...filters }).sort({ 'userCode': -1 }).project({ ...project }).toArray();
    },

    getUsersByIds: async (usersId: any[]): Promise<any> => {
        const database = await getDatabase();
        usersId = usersId.map((elt) => { return new ObjectId(elt?._id?._id.toString()) });
        return await database.collection(collectionName).find({ _id: { $in: usersId } }).project({
            _id: 1, category: 1, clientCode: 1, dates: 1, email: 1, fname: 1, lname: 1, tel: 1, userCode: 1, enabled: 1
        }).sort({ 'userCode': -1 }).toArray();
    },

    getUserByCode: async (userCode: any): Promise<User | any> => {
        const database = await getDatabase();
        return await database.collection(collectionName).findOne({ userCode });
    },


    getMaxValidationLevel: async (): Promise<User | any> => {
        const database = await getDatabase();

        const query = [
            { $match: { visaOpValidation: { $exists: true }, 'visaOpValidation.enabled': true, } },
            { $group: { _id: null, level: { $max: "$visaOpValidation.level" } } }
        ]
        return await database.collection(collectionName).aggregate(query).toArray();
    },

    checkUsersExist: async (emails): Promise<any> => {
        const database = await getDatabase();
        const filter = { email: { $in: emails } };
        const projection = { _id: 0, email: 1 };
        return await database.collection(collectionName).find(filter).project(projection).toArray();
    },

    checkUsersExistAdmin: async (): Promise<any> => {
        const database = await getDatabase();
        const filter = { category: { $in: [600] } };
        return await database.collection(collectionName).find(filter).toArray();
    },

    getUsersAdministrators: async () => {
        const database = await getDatabase();
        const filters = { category: { $in: [UserCategory.ADMIN, UserCategory.VALIDATOR] }, };
        const projection = { _id: 0, email: 1, fname: 1, lname: 1, fullName: 1, category: 1 };

        return await database.collection(collectionName).find(filters).project(projection).toArray()
    },

    updateUser: async (id: string, set: User, unset?: User): Promise<UpdateResult> => {
        const database = await getDatabase();
        const query: any = {};
        delete set._id;

        if (!isEmpty(set)) { query.$set = { ...set } }
        if (!isEmpty(unset)) { query.$unset = { ...unset } }

        return await database.collection(collectionName).updateOne({ _id: new ObjectId(id) }, query);
    },

    updateUsers: async (filter: any, set: User, unset?: User): Promise<any> => {
        const database = await getDatabase();
        const query: any = {};
        delete set._id;

        if (!isEmpty(set)) { query.$set = { ...set } }
        if (!isEmpty(unset)) { query.$unset = { ...unset } }

        if (filter?._id) { filter._id = new ObjectId(filter?._id?.toString()); }
        return await database.collection(collectionName).updateMany({ ...filter }, query);
    },

    // get partners informations like GIMAC, MTN, AIRTEL...
    getPartnerBy: async (filters: any): Promise<any> => {
        const database = await getDatabase();
        if (filters._id) { filters._id = new ObjectId(filters._id) }
        return database.collection('members').findOne({ ...filters });
    },

    getAllPartner: async (): Promise<any> => {
        const database = await getDatabase();
        return await database.collection('members').find().toArray();
    },

    getClientCodes: async (): Promise<any> => {
        const database = await getDatabase();
        const query = [{ $match: { category: { '$nin': [600, 500] } } }, { $project: { _id: 0, clientCode: { $trim: { input: "$clientCode" } } } }];
        return await database.collection('users').aggregate(query).toArray();
    },

    getMerchantsBy: async (filters: any): Promise<User | any> => {
        const database = await getDatabase();
        if (filters._id) { filters._id = new ObjectId(filters._id) }
        return database.collection('merchants').findOne({ ...filters });
    },

}