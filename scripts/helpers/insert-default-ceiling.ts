import { OperationTypeLabel } from 'modules/index';
import { getDatabase } from '../../src/database/mongodb';
import { isEmpty } from 'lodash';

export const inserDefaultVisaCeilings = async () => {

    console.log('----------------------------------------');
    console.log('-------  INSERT DEFAULTS VISA CEILINGS ------');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const { ATN_WITHDRAWAL, ONLINE_PAYMENT, ELECTRONIC_PAYMENT_TERMINAL } = OperationTypeLabel;

    const ceilings = [
        {
            type: 100,
            value: 5000000,
            description: `Voyages courtes durées (${ELECTRONIC_PAYMENT_TERMINAL} & ${ATN_WITHDRAWAL})`,
            date: {
                created: new Date().valueOf()
            }
        },
        {
            type: 200,
            value: 1000000,
            description: 'Paiement en ligne',
            date: {
                created: new Date().valueOf()
            }
        },
        {
            type: 300,
            value: 5000000,
            description: `Voyages longues durées (${ELECTRONIC_PAYMENT_TERMINAL}, ${ATN_WITHDRAWAL}, ${ONLINE_PAYMENT})`,
            date: {
                created: new Date().valueOf()
            }
        },
        {
            type: 400,
            value: 2000000,
            description: `Plafond pour les étudiants hors zone CEMAC relevant d'un ménage de la CEMAC lors des voyages courtes et longues durées`,
            date: {
                created: new Date().valueOf()
            }
        },
    ]
    console.log('insert default ceilings  collection');

    const collectionsExists = await db.listCollections({name:'visa_transactions_ceillings'}).toArray();
    console.log('collectionsExists', collectionsExists[0]?.name || 'not exists');

    if (!isEmpty(collectionsExists)) {
        const respDelete = await db.collection("visa_transactions_ceillings").drop();
        console.log('response delete', respDelete);
    }

    const response = await db.collection('visa_transactions_ceillings').insertMany(ceilings);
    console.log(response.insertedIds);
};