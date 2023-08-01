import { getDatabase } from '../config';
import moment from 'moment'

export const inserDefaultPropertyType = async () => {

  console.log('----------------------------------------');
  console.log('INSERT DEFAULTS PROPERTY AND SERVICES TYPES');
  console.log('----------------------------------------');

  const db = await getDatabase();
  const propertyType = [
    {
      label: "Paiement hors zone CEMAC",
      vouchers: [],
      dates: {
        created: { created: moment().valueOf() }
      }
    },
    {
      label: "Règlement frais de scolarité",
      vouchers: [],
      dates: {
        created: { created: moment().valueOf() }
      }
    },
    {
      label: "Règlement frais de santé",
      vouchers: [],
      dates: {
        created: { created: moment().valueOf() }
      }
    },
    {
      label: "Règlement frais d'hôtel",
      vouchers: [],
      dates: {
        created: { created: moment().valueOf() }
      }
    }
  ];

  console.log('insert default property-type vouchers collection');

  const respDelete = await db.collection("visa_operations_property_and_services_types").drop();
  console.log('response delete', respDelete);

  const response = await db.collection('visa_operations_property_and_services_types').insertMany(propertyType);
  console.log(response.insertedIds);

};