import moment from 'moment'
import { getDatabase } from '../config';

export const inserDefaultVouchers = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS VOUCHERS');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const vouchers = [
        {
            label: `Carte d'identité`,
            description: `Carte d'identité de l'utilisateur`,
            date: { created: moment().valueOf() }
        },
        {
            label: `Passeport`,
            description: `Passeport de l'utilisateur`,
            date: { created: moment().valueOf() }
        },
        {
            label: `Visa`,
            description: `Visa de l'utilisateur`,
            date: { created: moment().valueOf() }
        },
        {
            label: `Ordre de mission`,
            description: `Ordre de mission`,
            date: { created: moment().valueOf() }
        },
        {
            label: `Contrat de travail`,
            description: `Contrat de travail`,
            date: { created: moment().valueOf() }
        }
    ]

    console.log('Insert default vouchers into vouchers collection');
    db.dropCollection("visa_operations_vouchers", function (err, result) { console.log("Collection droped"); });
    const response = await db.collection('visa_operations_vouchers').insertMany(vouchers);
    console.log(response.insertedIds);
    console.log('');

};