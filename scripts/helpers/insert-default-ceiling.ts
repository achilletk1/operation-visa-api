import  moment from 'moment'
import { getDatabase } from '../config';

export const inserDefaultVisaCeilings = async () => {

    console.log('----------------------------------------');
    console.log('-------  INSERT DEFAULTS VISA CEILINGS ------');
    console.log('----------------------------------------');

    const db = await getDatabase();

    const ceilings = [
        {
            type: 100,
            value: 5000000,
            description: 'Voyages courtes durées (PAIEMENT TPE & RETRAIT GAB)',
            date: {
                created: moment().valueOf()
            }
        },
        {
            type: 200,
            value: 1000000,
            description: 'Paiement en ligne ou élèctronique',
            date: {
                created: moment().valueOf()
            }
        },
        {
            type: 300,
            value: 5000000,
            description: 'Voyages longues durées (PAIEMENT TPE, RETRAIT GAB, paiement élèctronique)',
            date: {
                created: moment().valueOf()
            }
        },
        {
            type: 400,
            value: 2000000,
            description: 'Plafond pour les étudiants lors des voyages courtes et longues durées',
            date: {
                created: moment().valueOf()
            }
        },
    ]
    console.log('insert default ceilings  collection');
    await db.collection("visa_transactions_ceillings").drop();
    const response = await db.collection('visa_transactions_ceillings').insertMany(ceilings);
    console.log(response.insertedIds);
};