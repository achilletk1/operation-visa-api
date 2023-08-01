import { getDatabase } from '../config';
import  moment from 'moment'

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
            label: `Diplomates et assimilés`,
            code: 101,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Corps diplomatique`,
            code: 102,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Membre de la famille d'un diplomate issus des pays de la CEMAC`,
            code: 103,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Malade en soins à l'extérieur  de la CEMAC`,
            code: 200,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Personne qui accompagne un malade hors zone CEMAC`,
            code: 201,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Etudiant à l'étranger relevant d'un ménage résident de la CEMAC`,
            code: 300,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Fonctionnaire des Etats CEMAC employé à l'extérieur de ceux-ci dans des enclaves térritoriales`,
            code: 400,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Militiare participant à une missions hors zone CEMAC`,
            code: 401,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Travailleur saisonnier résident de la CEMAC qui exerce leur activité hors zone CEMAC`,
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
            label: `Employés de la CEMAC travaillant en alternance hors zone CEMAC`,
            vouchers: [],
            code: 406,
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC membre d'équipage des navires hors zone CEMAC`,
            code: 600,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC membre d'équipage des aéronefs hors zone CEMAC`,
            code: 601,
            vouchers: [],
            description: ``,
            dates: { created: moment().valueOf() }
        },
        {
            label: `Résident de la CEMAC membre d'équipage des plateformes pétrolières hors zone CEMAC`,
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
    ]

    console.log('insert default transfertTypesinto visa_operations_long_travel_types collection');

    const respDelete = await db.collection("visa_operations_long_travel_types").drop();
    console.log('response delete', respDelete);

    const response = await db.collection('visa_operations_long_travel_types').insertMany(transfertTypes);
    console.log(response.insertedIds);

};