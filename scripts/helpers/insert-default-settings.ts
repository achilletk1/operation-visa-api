import { getDatabase } from '../config';
import moment from 'moment'

export const inserDefaultSetting = async () => {

  console.log('----------------------------------------');
  console.log('-------  INSERT DEFAULTS SETTINGS ------');
  console.log('----------------------------------------');

  const db = await getDatabase();

  const Settings = [
    {
      key: 'max_upload_file_size',
      maxUpladFileSize: 5,
      dateCreated: moment().valueOf(),
      dateUpdated: [],
      users: []
    },
    {
      key: 'service_parameter',
      label: 'parametrage de service',
      dateCreated: moment().valueOf(),
      maxUpladFileSize: 5,
      data: { value: 40 },
      dateUpdated: [],
      users: []
    },
    {
      key: 'validation_level',
      label: 'parametrage du niveau de validation',
      dateCreated: moment().valueOf(),
      maxUpladFileSize: 5,
      data: { value: 3 },
      dateUpdated: [],
      users: []
    },
    {
      key: 'ttl_value',
      label: 'parametrage du TTL',
      dateCreated: moment().valueOf(),
      data: { value: 40 },
      maxUpladFileSize: 5,
      dateUpdated: [],
      users: []
    },
    {
      key: 'otp_status',
      label: 'parametrage OTP' ,
      dateCreated: moment().valueOf(),
      maxUpladFileSize: 5,
      dateUpdated: [],
      users: []
    },
    {
      key: 'mail_gateway',
      label: 'parametrage de la paserelle de mail',
      dateCreated: moment().valueOf(),
      maxUpladFileSize: 5,
      dateUpdated: [],
      users: []
    }
  ]
  console.log('insert default max size file  collection');

  const respDelete = await db.collection("settings").deleteOne({ key: 'max_upload_file_size' });
  console.log('response delete', respDelete);

  const response = await db.collection('settings').insertMany(Settings);
  console.log(response.insertedIds);
};