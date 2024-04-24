import { ObjectId } from 'mongodb';
import { getDatabase } from '../../src/database/mongodb';
import { isEmpty } from 'lodash';

export const inserDefaultSuppliersVouchers = async () => {

  console.log('----------------------------------------');
  console.log('INSERT SUPPLIERS VOUCHERS');
  console.log('----------------------------------------');

  const db = await getDatabase();
  const suppliersVouchers = [

    {
      label: 'La fiche KYC',
      extension: '*',
      description: 'KYC (connaissance du client etablie par la banque)',
      isRequired: false,
      supplierType: 'travel',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Plan de localisation du domicile',
      extension: '*',
      description: 'Plan de localisation du domicile',
      isRequired: false,
      supplierType: 'travel',
      dates: { created: new Date().valueOf() }
    },
    {
      label: "Justification de domice",
      extension: '*',
      description: "Justification de domice  (facture d'eau, electricite etc)",
      isRequired: false,
      supplierType: 'travel',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Copie de la CNI ou du passport',
      extension: '*',
      description: 'Copie de la CNI ou du passport',
      isRequired: false,
      supplierType: 'travel',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Attestation d\'identification fiscale',
      extension: '*',
      description: 'Attestation d\'identification fiscale indiquant le numero d\'identification unique ou tout autre document en tenant lieu',
      isRequired: false,
      supplierType: 'travel',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Declaration sur l\'honneur',
      extension: '*',
      description: 'Declaration sur l\'honneur certifiant l\'exactitude des documents et informations transmises et engageant le donneur d\'ordre a informer l\'etablissement de credit en cas de tout changement',
      isRequired: false,
      supplierType: 'travel',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'La fiche KYC',
      extension: '*',
      description: 'KYC (connaissance du client etablie par la banque)',
      isRequired: false,
      supplierType: 'transfer',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Plan de localisation du siege sociale',
      extension: '*',
      description: 'Plan de localisation du siege sociale',
      isRequired: false,
      supplierType: 'transfer',
      dates: { created: new Date().valueOf() }
    },
    {
      label: "Justification du siege social",
      extension: '*',
      description: "Justification du siege social  (facture d'eau, electricite etc)",
      isRequired: false,
      supplierType: 'transfer',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Extrait du RCCM',
      extension: '*',
      description: 'Extrait du registre de commerce et du credit mobilier(RCCM) le plus recent ou tout document en tenant lieu',
      isRequired: false,
      supplierType: 'transfer',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Copie de la CNI ou du passport des signataires',
      extension: '*',
      description: 'Copie de la carte nationale d\'identite ou du passport des signataires agissant pour le compte du donneur d\'ordre personne morale',
      isRequired: false,
      supplierType: 'transfer',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Copie des statuts authentifies par une par une autorite habiletée',
      extension: '*',
      description: 'Copie des statuts authentifies par une par une autorite habiletée', 
      isRequired: false,
      supplierType: 'transfer',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Attestation d\'identification fiscale',
      extension: '*',
      description: 'Attestation d\'identification fiscale indiquant le numero d\'identification unique ou tout autre document en tenant lieu',
      isRequired: false,
      supplierType: 'transfer',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Copie du proces verbal',
      extension: '*',
      description: 'Copie du proces verbal nommant les dirigeants ou tout autre document en tenant lieu',
      isRequired: false,
      supplierType: 'transfer',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Copie de la CNI ou du passport des dirigeants',
      extension: '*',
      description: 'Copie de la carte nationale d\'identite ou du passport des dirigeants',
      isRequired: false,
      supplierType: 'transfer',
      dates: { created: new Date().valueOf() }
    },
    {
      label: "Etats financiers certifies des trois derniers exercices",
      extension: '*',
      description: 'Etats financiers certifies des trois derniers exercices ou declaration statistique et fiscale (DSF) des trois derniers exercices lorsque les etats financiers certifies ne sont pas disponibles',
      isRequired: false,
      supplierType: 'transfer',
      dates: { created: new Date().valueOf() }
    },
    {
      label: 'Declaration sur l\'honneur',
      extension: '*',
      description: 'Declaration sur l\'honneur certifiant l\'exactitude des documents et informations transmises et engageant le donneur d\'ordre a informer l\'etablissement de credit en cas de tout changement' ,
      isRequired: false,
      supplierType: 'transfer',
      dates: { created: new Date().valueOf() }
    }
    
  ];

  console.log('insert default suppliers vouchers collection');

  const collectionsExists = await db.listCollections({ name: 'visa_operations_suppliers_vouchers' }).toArray();
  console.log('collectionsExists', collectionsExists[0]?.name || 'not exists');

  if (!isEmpty(collectionsExists)) {
    const respDelete = await db.collection('visa_operations_suppliers_vouchers').drop();
    console.log('response delete', respDelete);
  }

  const response = await db.collection('visa_operations_suppliers_vouchers').insertMany(suppliersVouchers);
  console.log(response.insertedIds);

};