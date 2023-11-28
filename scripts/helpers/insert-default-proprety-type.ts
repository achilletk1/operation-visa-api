import { getDatabase } from '../../src/database/mongodb';
import { isEmpty } from 'lodash';
import moment from 'moment'

export const inserDefaultPropertyType = async () => {

  console.log('----------------------------------------');
  console.log('INSERT DEFAULTS PROPERTY AND SERVICES TYPES');
  console.log('----------------------------------------');

  const db = await getDatabase();
  const propertyType = [
    {
      label: 'Paiement hors zone CEMAC',
      vouchers: [
        {
          _id: '63187ce69bbd2f516303b171',
          label: 'Facture',
          extension: '*',
          description: 'Facture',
          isRequired: true
        },
        {
          _id: '63187c8c9bbd2f516303b16e',
          label: 'Facture proforma',
          extension: '*',
          description: 'Facture proforma',
          isRequired: false
        },
        {
          _id: '63187c9c9bbd2f516303b16f',
          label: "Preuve d'appels de fonds",
          extension: '*',
          description: "Preuve d'appels de fonds en vue d'un paiement",
          isRequired: false
        },
        {
          _id: '63187d259bbd2f516303b172',
          label: 'Contrat',
          extension: '*',
          description: 'Contrat',
          isRequired: false
        }
      ],
      dates: { created: moment().valueOf() }
    },
    {
      label: 'Règlement frais de scolarité',
      vouchers: [
        {
          _id: '63187ac69bbd2f516303b168',
          label: 'Certificat de scolarité ',
          extension: '*',
          description: 'Certificat de scolarité',
          isRequired: true
        },
        {
          _id: '63187ad29bbd2f516303b169',
          label: "Carte d'étudiant",
          extension: '*',
          description: "Carte d'étudiant",
          isRequired: false
        },
        {
          _id: '63187af79bbd2f516303b16a',
          label: 'Copie du passeport du bénéficiaire',
          extension: '*',
          description: 'Copie du passeport du bénéficiaire (élève, étudiant)',
          isRequired: true
        },
        {
          _id: '63187b439bbd2f516303b16b',
          label: 'Justificatif lien entre titulaire carte et bénéficiaire',
          extension: '*',
          description: "Justificatif du lien entre titulaire de l'instrument de paiement électronique et bénéficiaire du paiement",
          isRequired: true
        }
      ],
      dates: { created: moment().valueOf() }
    },
    {
      label: 'Règlement frais de santé',
      vouchers: [
        {
          _id: '63187bf09bbd2f516303b16c',
          label: 'Facture/Document attestant prestation de santé sur résident CEMAC',
          extension: '*',
          description: "Les Factures ou tout document attestant de la prestation de santé en faveur d'un résidant de la CEMAC",
          isRequired: true
        },
        {
          _id: '63187b439bbd2f516303b16b',
          label: 'Justificatif lien entre titulaire carte et bénéficiaire',
          extension: '*',
          description: "Justificatif du lien entre titulaire de l'instrument de paiement électronique et bénéficiaire du paiement",
          isRequired: false
        }
      ],
      dates: { created: moment().valueOf() }
    },
    {
      label: "Règlement frais d'hôtel",
      vouchers: [
        {
          _id: '63187ce69bbd2f516303b171',
          label: 'Facture',
          extension: '*',
          description: 'Facture ou ticket de caisse',
          isRequired: true
        },
        {
          _id: '63187c1a9bbd2f516303b16d',
          label: 'Preuve de voyage futur hors CEMAC',
          extension: '*',
          description: "Preuve de voyage futur à l'extérieur de la CEMAC",
          isRequired: false
        },  
        {
          _id: '631852ff5a430f5fac5c503c',
          label: 'Document de transport',
          extension: '*',
          description: "Billet d'avion, Ticket de train, ticket de bus",
          isRequired: false
        }
      ],
      dates: { created: moment().valueOf() }
    }
  ];

  console.log('insert default property-type AND SERVICES TYPES vouchers collection');

  const collectionsExists = await db.listCollections({ name: 'visa_operations_property_and_services_types' }).toArray();
  console.log('collectionsExists', collectionsExists[0]?.name || 'not exists');

  if (!isEmpty(collectionsExists)) {
    const respDelete = await db.collection('visa_operations_property_and_services_types').drop();
    console.log('response delete', respDelete);
  }

  const response = await db.collection('visa_operations_property_and_services_types').insertMany(propertyType);
  console.log(response.insertedIds);

};