import { getDatabase } from '../config';
import moment from 'moment'

export const inserDefaultSetting = async () => {

  console.log('----------------------------------------');
  console.log('-------  INSERT DEFAULTS SETTINGS ------');
  console.log('----------------------------------------');

  const db = await getDatabase();

    const Settings = [        {
            key: 'max_upload_file_size',
            maxUpladFileSize: 5,
            dateCreated: moment().valueOf(),
            dateUpdated: [ ],
            users: []
        },
    ]
    console.log('insert default max size file  collection');   

    const respDelete = await db.collection("settings").deleteOne({key: 'max_upload_file_size'});
    console.log('response delete', respDelete);

    const response = await db.collection('settings').insertMany(Settings);
    console.log(response.insertedIds);
};