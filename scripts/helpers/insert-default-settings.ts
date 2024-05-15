import { settingsKeys } from '../../src/modules/settings/model';
import { getDatabase } from '../../src/database/mongodb';

export const inserDefaultSetting = async () => {

  console.log('----------------------------------------');
  console.log('-------  INSERT DEFAULTS SETTINGS ------');
  console.log('----------------------------------------');

  const db = await getDatabase();

  const Settings = [
    {
      key: settingsKeys.MAX_UPLOAD_FILE_SIZE,
      label: 'Taille maximale des fichier à importer',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: 5
    },
    {
      key: settingsKeys.TTL_VALUE,
      label: 'Parametrage du TTL',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: 40
    },
    {
      key: settingsKeys.OTP_STATUS,
      label: "Parametrage globale de l'authentification avec OTP",
      created_at: new Date().valueOf(),
      updated_at: [],
      data: true
    },
    {
      key: settingsKeys.MAIL_GATEWAY,
      label: 'Parametrage de la paserelle de mail',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: 10
    },
    {
      key: settingsKeys.EMAIL_BANK,
      label: 'Parametrage de l\'adresse mail qui recevra les mails de la banque',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: 'achille.tachum@londo-tech.com'
    },
    {
      key: settingsKeys.SHORT_TRAVEL_DEADLINE_PROOF_TRAVEL,
      label: 'Délais de justification de la preuve de voyage pour un voyage de courte durée (en jours)',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: 10
    },
    {
      key: settingsKeys.SHORT_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES,
      label: 'Délais de justification de l\'etat détaillé des dépenses pour un voyage de courte durée (en jours)',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: 10
    },
    {
      key: settingsKeys.LONG_TRAVEL_DEADLINE_PROOF_TRAVEL,
      label: 'Délais de justification de la preuve de voyage pour un voyage de longue durée (en jours)',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: 10
    },
    {
      key: settingsKeys.LONG_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES_MONTH,
      label: 'Délais de justification de l\'état détaillé des dépenses d\'un mois en dépassement du voyage de longue durée (en jours)',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: 10
    },
    {
      key: settingsKeys.ONLINE_PAYMENT_DEADLINE_JUSTIFY,
      label: 'Délais de justification d\'un paiement en ligne',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: {value: 10, dataPeriod: 'days'}
    },
    {
      key: settingsKeys.IMPORT_GOODS_DEADLINE_JUSTIFY,
      label: 'Délais de justification d\'une importation de biens',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: 30
    },
    {
      key: settingsKeys.IMPORT_SERVICE_DEADLINE_JUSTIFY,
      label: 'Délais de justification d\'une importation de services',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: 30
    },
    {
      key: settingsKeys.SENSITIVE_CUSTOMER_CODES,
      label: 'Liste des codes profils des clients sensibles',
      created_at: new Date().valueOf(),
      updated_at: [],
      data: '115, 117, 118, 119, 122, 123, 124, 125, 126, 127'
    }
  ]
  console.log('insert default max size file  collection');

  const respDelete = await db.collection("settings").deleteOne({ key: 'max_upload_file_size' });
  console.log('response delete', respDelete);

  const response = await db.collection('settings').insertMany(Settings);
  console.log(response.insertedIds);
};