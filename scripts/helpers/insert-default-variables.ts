import moment from 'moment'
import { getDatabase } from '../config';

export const inserDefaultVaraibles= async () => {

    console.log('----------------------------------------');
    console.log('-------  INSERT DEFAULTS VARIABLES ------');
    console.log('----------------------------------------');

    const db = await getDatabase();

    const Variables = [        {
            key: 'max_upload_file_size',
            maxUpladFileSize: 5,
            dateCreated: moment().valueOf(),
            dateUpdated: [ ],
            users: []
        },
    ]
    console.log('insert default Variables  collection');   
    // db.dropCollection("variables",function(err, result) { console.log("Collection droped");});
    // const response = await db.collection('settings').insertMany(Variables);
    // console.log(response.insertedIds);
};