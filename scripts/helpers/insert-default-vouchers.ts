import { isEmpty } from 'lodash';
import { getDatabase } from '../config';
import moment from 'moment'

export const inserDefaultVouchers = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS VOUCHERS');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const vouchers = [
        {
            label: `Facture proforma`,
            description: ``,
            date: { created: moment().valueOf() }
        },
        {
            label: `Preuve d'appels de fonds`,
            description: `Preuve d'appels de fonds en vue d'un paiement`,
            date: { created: moment().valueOf() }
        },
        {
            label: `Contrat(s)`,
            description: ``,
            date: { created: moment().valueOf() }
        },
        {
            label: `Certificat de scolarité`,
            description: ``,
            date: { created: moment().valueOf() }
        },
        {
            label: `Carte étudiant`,
            description: `Contrat de travail`,
            date: { created: moment().valueOf() }
        },
        {
            label: `Preuve de parenté`,
            description: `Justification du lien entre le titulaire de l'instrument de paiement élèctronique et le bénéficiaire du paiement`,
            date: { created: moment().valueOf() }
        },
        {
            label: `Facture(s)`,
            description: ``,
            date: { created: moment().valueOf() }
        },
        {
            label: `Visa`,
            description: ``,
            date: { created: moment().valueOf() }
        },
        {
            label: `Tampon d'entrée du passesport`,
            description: `Cachet appliqué sur le passesport donnant autorisation d'entrée dans le térittoire de destination`,
            date: { created: moment().valueOf() }
        },
        {
            label: `Tampon de sortie du passesport`,
            description: `Cachet appliqué sur le passesport donnant autorisation de sortir du térittoire`,
            date: { created: moment().valueOf() }
        },
        {
            label: `Ticket de transport`,
            description: ``,
            date: { created: moment().valueOf() }
        }
    ]

    console.log('Insert default vouchers into vouchers collection');

    const collectionsExists = await db.listCollections({ name: 'visa_operations_vouchers' }).toArray();
    console.log('collectionsExists', collectionsExists[0]?.name || 'not exists');

    if (!isEmpty(collectionsExists)) {
        const respDelete = await db.collection("visa_operations_vouchers").drop();
        console.log('response delete', respDelete);
    }

    const response = await db.collection('visa_operations_vouchers').insertMany(vouchers);
    console.log(response.insertedIds);

};