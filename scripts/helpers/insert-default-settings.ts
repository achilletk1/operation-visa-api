import { getDatabase } from '../../src/database/mongodb';
import moment from 'moment'

export const inserDefaultSetting = async () => {

  console.log('----------------------------------------');
  console.log('-------  INSERT DEFAULTS SETTINGS ------');
  console.log('----------------------------------------');

  const db = await getDatabase();

  const Settings = [
    {
      key: 'max_upload_file_size',
      label: 'Taille maximale des fichier à importer',
      created_at: moment().valueOf(),
      updated_at: [],
      data: 5
    },
    {
      key: 'ttl_value',
      label: 'Parametrage du TTL',
      created_at: moment().valueOf(),
      updated_at: [],
      data: 40
    },
    {
      key: 'otp_status',
      label: "Parametrage globale de l'authentification avec OTP",
      created_at: moment().valueOf(),
      updated_at: [],
      data: true
    },
    {
      key: 'mail_gateway',
      label: 'Parametrage de la paserelle de mail',
      created_at: moment().valueOf(),
      updated_at: [],
      data: 10
    }
  ]
  console.log('insert default max size file  collection');

  const respDelete = await db.collection("settings").deleteOne({ key: 'max_upload_file_size' });
  console.log('response delete', respDelete);

  const response = await db.collection('settings').insertMany(Settings);
  console.log(response.insertedIds);
};