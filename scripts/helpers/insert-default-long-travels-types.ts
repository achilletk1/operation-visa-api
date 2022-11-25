import  moment from 'moment'
import { getDatabase } from '../config';

export const inserDefaultLongTravelsTypes = async () => {

    console.log('----------------------------------------');
    console.log('INSERT DEFAULTS TRANSFERTS TYPES');
    console.log('----------------------------------------');

    const db = await getDatabase();
    const transfertTypes = [
        {
            label: `Chefs de missions diplomatiques`,
            code: 100,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Diplomates`,
            code: 101,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Corps diplomate`,
            code: 102,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Membres de famille d'un diplomate`,
            code: 103,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Malades en soins à l'extérieur  de la CEMAC`,
            code: 200,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Personnes qui accompagnent un malade hors zone CEMAC`,
            code: 201,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Etudiants à l'étranger dépendant d'un ménage résident en zone CEMAC`,
            code: 300,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Fonctionnaires des Etats CEMAC employés hors zone CEMAC`,
            code: 400,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Militiares participant à une missions hors zone CEMAC`,
            code: 401,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Travailleurs saisonniers résident de la CEMAC qui exerce leur activité hors zone CEMAC`,
            code: 402,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Employés de la CEMAC en formation hors zone CEMAC`,
            code: 403,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Employés de la CEMAC en stage hors zone CEMAC`,
            code: 404,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Employés de la CEMAC en mission hors zone CEMAC`,
            code: 405,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Employés de la CEMAC en travaillant en alternance hors zone CEMAC`,
            vouchers: [],
            code: 406,
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC membres d'équipage des navires hors zone CEMAC`,
            code: 600,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC membres d'équipage des aéronefs hors zone CEMAC`,
            code: 601,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC membres d'équipage des plateformes pétrolières hors zone CEMAC`,
            code: 602,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC en pélérinage hors zone CEMAC`,
            code: 603,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC en participant à une foire hors zone CEMAC`,
            code: 604,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC en participant à une activité sportive hors zone CEMAC`,
            code: 605,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC en participant à une activité culturelle hors zone CEMAC`,
            code: 606,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC en participant à une activité quelconque hors zone CEMAC`,
            code: 607,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Autres`,
            code: 500,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },

    ]

    console.log('insert default transfertTypesinto visa_operations_long_travel_types collection');
    db.dropCollection("visa_operations_long_travel_types",function(err, result) { console.log("Collection droped");});
    const response = await db.collection('visa_operations_long_travel_types').insertMany(transfertTypes);
    console.log(response.insertedIds);
    console.log('');

};