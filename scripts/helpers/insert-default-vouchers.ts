import * as  moment from 'moment'
import { getDatabase } from '../config';

export const inserDefaultVouchers= async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS VOUCHERS');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const vouchers= [
        {
            label: 'Carte d\'identité',
            description:'',
            date: { created: moment().valueOf() }
        },
        {
            label: 'Passeport',
            description: '',
            date: { created: moment().valueOf() }
        }
    ]

    console.log('insert default vouchersinto vouchers collection');
    const response = await db.collection('vouchers').insertMany(vouchers);
    console.log(response.insertedIds);
    console.log('');

};