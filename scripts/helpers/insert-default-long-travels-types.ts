import * as moment from 'moment'
import { getDatabase } from '../config';

export const inserDefaultLongTravelsTypes = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS TRANSFERTS TYPES');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const transfertTypes = [
        {
            label: `Chefs de missions diplomatiques`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Diplomates`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Corps diplomate`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Membres de famille d'un diplomate`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Malades en soins à l'extérieur  de la CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Personnes qui accompagnent un malade hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Etudiants à l'étranger dépendant d'un ménage résident en zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Fonctionnaires des Etats CEMAC employés hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Militiares participant à une missions hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Travailleurs saisonniers résident de la CEMAC qui exerce leur activité hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Employés de la CEMAC en formation hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Employés de la CEMAC en stage hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Employés de la CEMAC en mission hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Employés de la CEMAC en travaillant en alternance hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC membres d'équipage des navires hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC membres d'équipage des aéronefs hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC membres d'équipage des plateformes pétrolières hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC en pélérinage hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC en participant à une foire hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC en participant à une activité sportive hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC en participant à une activité culturelle hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC en participant à une activité quelconque hors zone CEMAC`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Autres`,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },

    ]

    console.log('insert default transfertTypesinto visa_operations_long_travel_types collection');
    const response = await db.collection('visa_operations_long_travel_types').insertMany(transfertTypes);
    console.log(response.insertedIds);
    console.log('');

};