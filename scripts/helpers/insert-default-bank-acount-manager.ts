import { getDatabase } from '../../src/database/mongodb';
import { ObjectId } from 'mongodb';

export const inserDefaultBankAccountManager = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS BANK ACCOUNT MANAGER');
    console.log('----------------------------------------');
    const collectionName = 'bank_account_manager';
    const db = await getDatabase();
    const users = [
        {
            _id: new ObjectId(),
            AGE_UTI:'zozorAge1',
            FULLNAME: 'zozor',
            CODE_GES: 'GES001',
            AGE: '20',
            autoMode: true,
            EMAIL: 'zozor@gmail.com',
            TEL: '657421002',
            CODE_PROFILE:'FG21242JFH'
        },
        {
            _id: new ObjectId(),
            AGE_UTI:'zozorAge2',
            FULLNAME: 'zozora',
            CODE_GES: 'GES002',
            AGE: '20',
            autoMode: true,
            EMAIL: 'zozora@gmail.com',
            TEL: '657421002',
            CODE_PROFILE:'FG21242JFH'
        },
        {
            _id: new ObjectId(),
            AGE_UTI:'zozorAge3',
            FULLNAME: 'zozor',
            CODE_GES: 'GES003',
            AGE: '20',
            autoMode: true,
            EMAIL: 'zozor@gmail.com',
            TEL: '657421002',
            CODE_PROFILE:'FG21242JFH'
        },
    ]

    console.log('Insert default bank users into users collection');

    const collectionsExists = await db.listCollections({ name: collectionName }).toArray();
    console.log('collectionsExists', collectionsExists[0]?.name || 'not exists');

    const response = await db.collection(collectionName).insertMany(users);
    console.log(response.insertedIds);

};