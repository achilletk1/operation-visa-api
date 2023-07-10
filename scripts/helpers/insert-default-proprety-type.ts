import moment from 'moment'
import { getDatabase } from '../config';
import { ObjectId } from 'mongodb';

export const inserDefaultPropertyType = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS PROPERTY AND SERVICES TYPES');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const propertyType =[{
        "_id": new ObjectId('6319fa3ba6c09525b3ff4b36'),
        "label": "Paiement hors zone CEMAC",
        "vouchers": [
          {
            "_id": "6319f936a6c09525b3ff4b29",
            "label": "Facture",
            "extension": "*",
            "description": "Facture"
          },
          {
            "_id": "6319f94ca6c09525b3ff4b2a",
            "label": "Preuve d'appels de fonds",
            "extension": "*",
            "description": "Preuve d'appels de fonds"
          },
          {
            "_id": "6319f95ca6c09525b3ff4b2b",
            "label": "Contrat",
            "extension": "*",
            "description": "Contrat"
          }
        ],
        "dates": {
          "created": { created: moment().valueOf() }
        }
      },{
        "_id":new ObjectId('6319fa4fa6c09525b3ff4b37'),
        "label": "Règlement frais de scolarité",
        "vouchers": [
          {
            "_id": "6319f977a6c09525b3ff4b2c",
            "label": "Certificat de scolarité",
            "extension": "*",
            "description": "Certificat de scolarité"
          },
          {
            "_id": "6319f995a6c09525b3ff4b2e",
            "label": "Passeport du bénéficiaire",
            "extension": "*",
            "description": "Passeport du bénéficiaire"
          },
          {
            "_id": "6319f97ea6c09525b3ff4b2d",
            "label": "Carte d'étudiant",
            "extension": "*",
            "description": "Carte d'étudiant"
          },
          {
            "_id": "6319f9b7a6c09525b3ff4b2f",
            "label": "Justificatif lien entre titulaire carte et bénéficiaire",
            "extension": "*",
            "description": "Justificatif lien entre titulaire carte et bénéficiaire"
          }
        ],
        "dates": {
          "created": { created: moment().valueOf() }
        }
      },{
        "_id":new ObjectId('6319fa96a6c09525b3ff4b3a'),
        "label": "Règlement frais de santé",
        "vouchers": [
          {
            "_id": "6319fa83a6c09525b3ff4b39",
            "label": "Document attestant prestation de santé",
            "extension": "*",
            "description": "Document attestant prestation de santé"
          },
          {
            "_id": "6319fa71a6c09525b3ff4b38",
            "label": "Facture proforma",
            "extension": "*",
            "description": "Facture proforma"
          },
          {
            "_id": "6319f9b7a6c09525b3ff4b2f",
            "label": "Justificatif lien entre titulaire carte et bénéficiaire",
            "extension": "*",
            "description": "Justificatif lien entre titulaire carte et bénéficiaire"
          }
        ],
        "dates": {
          "created": { created: moment().valueOf() }
        }
      },{
        "_id":new ObjectId('6319fabba6c09525b3ff4b3b'),
        "label": "Règlement frais d'hôtel",
        "vouchers": [
          {
            "_id": "6319f936a6c09525b3ff4b29",
            "label": "Facture",
            "extension": "*",
            "description": "Facture",
            "isRequired": true
          },
          {
            "_id": "6319f9d9a6c09525b3ff4b30",
            "label": "Preuve de voyage futur hors CEMAC",
            "extension": "*",
            "description": "Preuve de voyage futur hors CEMAC",
            "isRequired": true
          },
          {
            "_id": "6319fa71a6c09525b3ff4b38",
            "label": "Facture proforma",
            "extension": "*",
            "description": "Facture proforma"
          },
          {
            "_id": "6319f9e9a6c09525b3ff4b31",
            "label": "Document de transport",
            "extension": "*",
            "description": "Document de transport",
            "isRequired": true
          },
          {
            "_id": "6319f905a6c09525b3ff4b28",
            "label": "Passeport",
            "extension": "*",
            "description": "Passeport",
            "isRequired": true
          },
          {
            "_id": "6319fa10a6c09525b3ff4b35",
            "label": "VISA",
            "extension": "*",
            "description": "VISA",
            "isRequired": true
          }
        ],
        "dates": {
          "created": { created: moment().valueOf() }
        }
      }];

    console.log('insert default property-type vouchers collection');
    db.dropCollection("visa_operations_property_and_services_types", function (err, result) { console.log("property-type Collection droped"); });
    const response = await db.collection('visa_operations_property_and_services_types').insertMany(propertyType);
    console.log(response.insertedIds);
    console.log('');

};