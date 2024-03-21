import { getDatabase } from '../../src/database/mongodb';
import { config } from '../../src/convict-config';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

export const inserDefaultBankUsers = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS VOUCHERS');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const users = [
        {
            _id: new ObjectId(),
            userCode: "c_ndong",
            clientCode: "386729",
            fname: "Christine Mecale",
            lname: "NDONG",
            fullName: "NDONG Christine Mecale",
            email: "christine.ndong@bicec.com",
            tel: "237699807917",
            category: 600,
            function: "Organisateur",
            password: await bcrypt.hash('123456', config.get('saltRounds')),
            enabled: true,
            pwdReseted: true,
            gender: "F",
            option: 3,
            dates: {
                created: new Date().valueOf(),
            },
            lang: 'fr',
            visaOpeCategory: 500,
            otp2fa: true,
            gesCode: null,
            age: { label: 'DIRECTION GENERALE', code: '06815' },
            bankUserCode: '4029',
            bankProfileCode: 'S130',
            bankProfileName: 'ORGANISATEUR',
            cbsCategory: '1',
        },
    ]

    console.log('Insert default bank users into users collection');

    const collectionsExists = await db.listCollections({ name: 'users' }).toArray();
    console.log('collectionsExists', collectionsExists[0]?.name || 'not exists');

    // if (!isEmpty(collectionsExists)) {
    //     const respDelete = await db.collection("users").drop();
    //     console.log('response delete', respDelete);
    // }

    const response = await db.collection('users').insertMany(users);
    console.log(response.insertedIds);

};