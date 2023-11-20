import { getDatabase } from '../config';
import { ObjectId } from 'mongodb';
import { isEmpty } from 'lodash';
import moment from 'moment'

export const inserDefaultVouchers = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS VOUCHERS');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const vouchers = [
        {
            _id: new ObjectId('63187ce69bbd2f516303b171'),
            label: `Facture`,
            extension: '*',
            description: `Facture ou ticket de caisse`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('63187c8c9bbd2f516303b16e'),
            label: `Facture proforma`,
            extension: '*',
            description: `Facture proforma`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('63187c9c9bbd2f516303b16f'),
            label: `Preuve d'appels de fonds`,
            extension: '*',
            description: `Preuve d'appels de fonds en vue d'un paiement`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('63187d259bbd2f516303b172'),
            label: `Contrat`,
            extension: '*',
            description: `Contrat`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('65534e1eb2ccd46cc6bdef08'),
            label: `Ordre de mission`,
            extension: '*',
            description: `Ordre de mission`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('63187ac69bbd2f516303b168'),
            label: `Certificat de scolarité`,
            extension: '*',
            description: `Certificat de scolarité`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('63187ad29bbd2f516303b169'),
            label: `Carte étudiant`,
            extension: '*',
            description: `Carte étudiant`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('63187af79bbd2f516303b16a'),
            label: 'Copie du passeport du bénéficiaire',
            extension: '*',
            description: 'Copie du passeport du bénéficiaire (élève, étudiant)',
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('63187b439bbd2f516303b16b'),
            label: `Justificatif lien entre titulaire carte et bénéficiaire`,
            extension: '*',
            description: `Justification du lien entre le titulaire de l'instrument de paiement élèctronique et le bénéficiaire du paiement`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('63187bf09bbd2f516303b16c'),
            label: 'Facture/Document attestant prestation de santé sur résident CEMAC',
            extension: '*',
            description: "Les Factures ou tout document attestant de la prestation de santé en faveur d'un résidant de la CEMAC",
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('63187c1a9bbd2f516303b16d'),
            label: 'Preuve de voyage futur hors CEMAC',
            extension: '*',
            description: "Preuve de voyage futur à l'extérieur de la CEMAC",
            dates: { created: moment().valueOf() }
        },  
        {
            _id: new ObjectId('65535116b2ccd46cc6bdef09'),
            label: 'Carte de séjour en cours de validité',
            extension: '*',
            description: "Carte de séjour en cours de validité pour les risidents étrangers",
            dates: { created: moment().valueOf() }
        },  
        {
            _id: new ObjectId('6553512cb2ccd46cc6bdef0b'),
            label: 'Tout document attestant le statut de non (visa, etc, ..)',
            extension: '*',
            description: "Tout document attestant le statut de non (visa, etc, ..) pour les non résidents",
            dates: { created: moment().valueOf() }
        },  
        {
            _id: new ObjectId('631853085a430f5fac5c503d'),
            label: `Visa`,
            extension: '*',
            description: `Visa`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('65534d5cb2ccd46cc6bdef07'),
            label: `Passeport`,
            extension: '*',
            description: `Passeport`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('655330adb2ccd46cc6bdef04'),
            label: `Tampon d'entrée du passesport`,
            extension: '*',
            description: `Cachet appliqué sur le passesport donnant autorisation d'entrée dans le térittoire de destination`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('65533259b2ccd46cc6bdef05'),
            label: `Tampon de sortie du passesport`,
            extension: '*',
            description: `Cachet appliqué sur le passesport donnant autorisation de sortir de la zone CEMAC`,
            dates: { created: moment().valueOf() }
        },
        {
            _id: new ObjectId('631852ff5a430f5fac5c503c'),
            label: `Document de transport`,
            extension: '*',
            description: `Billet d'avion, Ticket de train, ticket de bus`,
            dates: { created: moment().valueOf() }
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