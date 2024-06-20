import { ObjectId } from 'mongodb';
import { getDatabase } from '../../src/database/mongodb';
import { isEmpty } from 'lodash';
import moment from 'moment';

export const inserDefaultLevelValidation = async () => {

    console.log('----------------------------------------');
    console.log('-------  INSERT DEFAULTS LEVEL VALIDATION ------');
    console.log('----------------------------------------');

    const db = await getDatabase();

    const levels = [
        {
            _id: new ObjectId(),
            level: 1,
            label: "N1",
            description: "Pré-validation",
            usersId: [],
            created_at: moment().valueOf(),
        },
        {
            _id: new ObjectId(),
            level: 2,
            label: "N2",
            description: "validation",
            usersId: [],
            created_at: moment().valueOf(),
        },
        {
            _id: new ObjectId(),
            level: 3,
            label: "N3",
            description: "Validation Administrative",
            usersId: [],
            created_at: moment().valueOf(),
        },
    ]
    console.log('insert default level validation  collection');

    const collectionsExists = await db.listCollections({ name: 'validation_level_settings' }).toArray();
    console.log('collectionsExists', collectionsExists[0]?.name || 'not exists');

    if (!isEmpty(collectionsExists)) {
        const respDelete = await db.collection("validation_level_settings").drop();
        console.log('response delete', respDelete);
    }

    const response = await db.collection('validation_level_settings').insertMany(levels);
    console.log(response.insertedIds);
};