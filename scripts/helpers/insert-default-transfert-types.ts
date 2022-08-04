import * as moment from 'moment'
import { getDatabase } from '../config';

export const inserDefaultTransfertTypes = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS TRANSFERTS TYPES');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const transfertTypes= [
        {
            type: 100,
            code:'DEF100',
            label: 'Transfert émis par défaut',
            date: { created: moment().valueOf() }
        },
        {
            type: 200,
            code: 'DEF200',
            label: 'Transfert reçu par défaut',
            date: { created: moment().valueOf() }
        }
    ]

    console.log('insert default transfertTypesinto transferts_types collection');
    const response = await db.collection('transferts_types').insertMany(transfertTypes);
    console.log(response.insertedIds);
    console.log('');

};