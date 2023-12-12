import { logger } from "winston-config";

const classPath = 'oracle-daos.helper.clients';

export const helper = {

    getMockClientDatas: async (ncp: any) => {
        const methodPath = `${classPath}.getMockClientData()`

        logger.info(`mock data used from ${methodPath}`);

        const mapping2: any = {

            '37207027067': {
                NOMREST: 'MOUTASSI NZOGUE Kevin Armel',
                NOM: 'MOUTASSI NZOGUE',
                PRE: 'Kevin Armel',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '01400   ',
                NCP: '37207027067',
                CLC: '18',
                CLI: '70089528',
                CIVILITY: '178',
                DOB: '02/01/1987',
                POB: 'BRAZZAVILLE',
                DEPARTEMENT_NAISSANCE: 'BRAZZAVILLE',
                PAYS_NAISSANCE: '178',
                IDTYPE: 'CNIDT',
                IDNUM: 'BZ0614LCDMUAW',
                SEXT: 'M',
                DATE_DELIVRANCE_PIECE_IDENTITE: '10/09/2014',
                DATE_VALIDITE_PIECE_IDENTITE: '10/08/2024',
                LIEU_DELIVRANCE_PIECE_IDENTITE: 'BRAZZAVILLE',
                ORGANISME_DELIVRANCE_PIECE_IDENTITE: 'DIC',
            },
            '37307027068': {
                NOMREST: 'TACHUM KAMGA Achille',
                NOM: 'TACHUM KAMGA',
                PRE: 'Achille',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '01400   ',
                NCP: '37307027068',
                CLC: '19',
                CLI: '87654321',
                SEXT: 'm',
                CIVILITY: '356',
                DOB: '02/12/1988',
                POB: 'JAIPUR',
                DEPARTEMENT_NAISSANCE: 'JAIPUR',
                PAYS_NAISSANCE: '356',
                IDTYPE: 'AUPAS',
                IDNUM: 'Z5547779',
                DATE_DELIVRANCE_PIECE_IDENTITE: '27/12/2019',
                DATE_VALIDITE_PIECE_IDENTITE: '26/12/2029',
                LIEU_DELIVRANCE_PIECE_IDENTITE: 'KINSHASA',
                ORGANISME_DELIVRANCE_PIECE_IDENTITE: 'CONSULAT',
                CHA: '372100',
            },
        }

        const mapping: any = {
            '37207027067': {
                NOMREST: 'MOUTASSI NZOGUE Kevin Armel',
                NOM: 'MOUTASSI NZOGUE',
                PRE: 'Kevin Armel',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '01400   ',
                CLC: '19 ',
                CIVILITY: 'Congolaise',
                ADDRESS: 'Kinshasa',
                TEL: '242068207839',
                EMAIL: 'armel@test.com',
                POB: 'DOUALA ',
                DOB: '11/04/1995',
                IDTYPE: 'CNI',
                IDNUM: '002589634785',
                CLI: '00000000',
                CHA: '372100',
            },
            '37307027068': {
                NOMREST: 'TACHUM KAMGA Achille',
                NOM: 'TACHUM KAMGA',
                PRE: 'Achille',
                NRC: 'GWB5O3RPI4WWUCJ/DV',
                NIDF: 'TGUZF1UGDT9KAQ',
                AGE: '01400',
                NCP: '37207027067',
                CLC: '19 ',
                CIVILITY: 'Camerounaise',
                ADDRESS: 'Ange rafael',
                TEL: '242068207839',
                EMAIL: 'test@test.com',
                POB: 'Kinshasa ',
                DOB: '11/04/1988',
                IDTYPE: 'PASSEPORT',
                IDNUM: '00258963',
                CHA: '372100',
                CLI: '70017185'
            },
        }

        const result = mapping[ncp] ? [mapping[ncp]] : [];

        return Promise.resolve(result);
    },

}