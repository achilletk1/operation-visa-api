import { logger } from "winston-config";

const classPath = 'oracle-daos.helper.clients';

export const helper = {

    getMockClientData: async (cli: any) => {
        const methodPath = `${classPath}.getMockClientData()`
        logger.info(`mock data used from ${methodPath}`);

        const mapping: any = {
            '70053102': {
                NOMREST: 'BRALICO',
                NRC: 'AZERTYUIOPLKJHGF    ',
                NIDF: '23456789IURTYUHGE   ',
                AGE: '01100   ',
                SOLDE: 1000000
            },
            '70071770': {
                NOMREST: 'LONDO TECHNOLOGY',
                NRC: 'AZERTYUIOPLKJHGF    ',
                NIDF: '234567UHG89IERTYU   '
            },
            '02478800': {
                NOMREST: 'MUNYENGUE SARL',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   '
            },
            '70030525': {
                NOMREST: 'MUNYENGUE SARL',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   '
            },
            '12598000': {
                NOMREST: 'MTN CONGO SA',
                NRC: 'GWB5O3RPI4WWUCJHGFV    ',
                NIDF: 'TGUZF1UGDT9KLO   '
            },
            '70089549': {
                NOMREST: 'MVOGO Dominique',
                NOM: 'MVOGO',
                PRE: 'Dominique    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14456   '
            },
            '70017185': {
                NOMREST: 'TACHUM Achille',
                NOM: 'TACHUM',
                PRE: 'Achille',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14456   ',
                SEXT: 'm'
            },
            '87654321': {
                NOMREST: 'TACHUM Achille',
                NOM: 'TACHUM',
                PRE: 'Achille',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14456   ',
                SEXT: 'm'
            },
            '70052448': {
                NOMREST: 'ESSIAKOU BALLA Saïd',
                NOM: 'ESSIAKOU BALLA',
                PRE: 'SAID    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   '
            },
            '02478803': {
                NOMREST: 'PORT AUTONOME DE KRIBI (PAK)',
                NOM: 'LIBAM',
                PRE: 'FRANCK    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   '
            },
            '70089548': {
                NOMREST: 'SIGNE KARL-DIMITRI',
                NOM: 'SIGNE SIGNE',
                PRE: 'KARL-DIMITRI    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   ',

            },
            '70089547': {
                NOMREST: 'FOMAZOU Idriss Stellor',
                NOM: 'FOMAZOU',
                PRE: 'Stellor    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70030524': {
                NOMREST: 'Henri MAKAKI',
                NOM: 'MAKAKI',
                PRE: 'Henri    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089523': {
                NOMREST: 'Henri MAKAKI',
                NOM: 'MAKAKI',
                PRE: 'Henri    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089528': {
                NOMREST: 'Kevin MOUTASSI',
                NOM: 'MOUTASSI',
                PRE: 'Kevin    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   ',

            },
            '70089525': {
                NOMREST: 'Brice LETUTOUR',
                NOM: 'Brice',
                PRE: 'LETUTOUR    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089578': {
                NOMREST: 'Brice LETUTOUR',
                NOM: 'Brice',
                PRE: 'LETUTOUR    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089545': {
                NOMREST: 'Welisane MANGA',
                NOM: 'Welisane',
                PRE: 'MANGA    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089546': {
                NOMREST: 'Rolain KONO',
                NOM: 'Rolain',
                PRE: 'KONO    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089587': {
                NOMREST: 'MOUTASSI NZOGUE Armel Kevin',
                NOM: 'MOUTASSI NZOGUE',
                PRE: 'Armel Kevin',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70060244': {
                NOMREST: 'TANTIE FOODS S.A.',
                NRC: 'GWB5O3RPI4WWUOJ/LT    ',
                NIDF: 'TGUZF1UGDTvKAJ   ',
            },
            '70060149': {
                NOMREST: 'CHOCOCAM S.A.',
                NRC: 'GWB5O3RPI4WWUOJ/GR    ',
                NIDF: 'TGUZF1UGDTvKAK   ',
            },
            '70056585': {
                NOMREST: 'NEWTELNET CONSULTING SARL',
                NRC: 'B5O3RPI4WWUOJ/AD    ',
                NIDF: 'TGUZF1UGDTvKAM   ',
            }
        }

        const result = mapping[cli] ? [mapping[cli]] : [];

        return Promise.resolve(result);
    },

    getMockClientAccounts: (cli: any) => {
        const methodPath = `${classPath}.getMockClientAccounts()`

        logger.info(`mock data used from ${methodPath}`);

        return [
            {
                NCP: '37207027067',
                INTI: 'Compte de chèque              ',
                AGE: '01400',
                CHA: '372100',
                CLC: '18'
            },
            {
                NCP: '37307027068',
                INTI: 'Compte sur livret                     ',
                AGE: '01400',
                CHA: '373100',
                CLC: '19'
            },
            {
                NCP: '37207012337',
                INTI: 'Compte de chèque              ',
                AGE: '01800',
                CHA: '372100',
                CLC: '20'
            },
            {
                NCP: '37307012338',
                INTI: 'Compte sur livret                     ',
                AGE: '01800',
                CHA: '373100',
                CLC: '21'
            },
            {
                NCP: '37107096755',
                INTI: 'Compte sur livret                     ',
                AGE: '01100',
                CHA: '373100',
                CLC: '21'
            },
        ];
    },

    getMockClientDatas: async (ncp: any) => {
        const methodPath = `${classPath}.getMockClientData()`

        logger.info(`mock data used from ${methodPath}`);

        const mapping2 = {

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
                ADDRESS: 'Kinshasa ',
                TEL: '242068207839 ',
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
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '01400   ',
                NCP: '37207027067',
                CLC: '19 ',
                CIVILITY: 'Camerounaise',
                ADDRESS: 'Ange rafael ',
                TEL: '242068207839 ',
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

    getMockClientRetail: async (clientCodes: any[]) => {
        const methodPath = `${classPath}.getMockClientRetail()`
        logger.info(`mock data used from ${methodPath}`);

        const mapping: any = {
            '70017185': {
                NOMREST: 'TACHUM Achille',
                NOM: 'TACHUM',
                PRE: 'Achille',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14456   ',
                SEXT: 'm'
            },
            '87654321': {
                NOMREST: 'TACHUM Achille',
                NOM: 'TACHUM',
                PRE: 'Achille',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14456   ',
                SEXT: 'm'
            },
            '70052448': {
                NOMREST: 'ESSIAKOU BALLA Saïd',
                NOM: 'ESSIAKOU BALLA',
                PRE: 'SAID    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   '
            },
            '02478803': {
                NOMREST: 'LIBAM FRANCK',
                NOM: 'LIBAM',
                PRE: 'FRANCK    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   '
            },
            '33333333': {
                NOMREST: 'ONGOUO Hordanh',
                NOM: 'ONGOUO',
                PRE: 'Hordanh    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12003   '
            },
            '44444444': {
                NOMREST: 'MAKAKI Henri',
                NOM: 'MAKAKI',
                PRE: 'Henri    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14503   '
            },
            '55555555': {
                NOMREST: 'MAMOUDOU Manssourou',
                NOM: 'MAMOUDOU',
                PRE: 'Manssourou    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14503   '
            },
            '66666666': {
                NOMREST: 'AMOGO Fabrice',
                NOM: 'AMOGO',
                PRE: 'Fabrice    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14502   '
            },
            '77777777': {
                NOMREST: 'MOUNGUENGUE Rajiv',
                NOM: 'MOUNGUENGUE',
                PRE: 'Rajiv    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14501   '
            },
            '75023431': {
                NOMREST: 'SIGNE KARL-DIMITRI',
                NOM: 'SIGNE SIGNE',
                PRE: 'KARL-DIMITRI    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   '
            },
            '88888888': {
                NOMREST: 'DOUMOUNOU Hermann Christ Olivier',
                NOM: 'DOUMOUNOU',
                PRE: 'Fabrice    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14504   '
            },
            '12345678': {
                NOMREST: 'FOMAZOU Idriss Stellor',
                NOM: 'FOMAZOU',
                PRE: 'Stellor    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70030524': {
                NOMREST: 'Henri MAKAKI',
                NOM: 'MAKAKI',
                PRE: 'Henri    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089523': {
                NOMREST: 'Henri MAKAKI',
                NOM: 'MAKAKI',
                PRE: 'Henri    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089528': {
                NOMREST: 'Kevin MOUTASSI',
                NOM: 'MOUTASSI',
                PRE: 'Kevin    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089525': {
                NOMREST: 'Brice LETUTOUR',
                NOM: 'Brice',
                PRE: 'LETUTOUR    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089578': {
                NOMREST: 'Brice LETUTOUR',
                NOM: 'Brice',
                PRE: 'LETUTOUR    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089545': {
                NOMREST: 'Welisane MANGA',
                NOM: 'Welisane',
                PRE: 'MANGA    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089546': {
                NOMREST: 'Rolain KONO',
                NOM: 'Rolain',
                PRE: 'KONO    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089547': {
                NOMREST: ' ',
                NOM: '  ',
                PRE: '    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089548': {
                NOMREST: ' ',
                NOM: '  ',
                PRE: '    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089549': {
                NOMREST: ' ',
                NOM: '  ',
                PRE: '    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70089587': {
                NOMREST: 'MOUTASSI NZOGUE Armel Kevin',
                NOM: 'MOUTASSI NZOGUE',
                PRE: 'Armel Kevin',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   '
            },
            '70060244': {
                NOMREST: 'TANTIE FOODS S.A.',
                NRC: 'GWB5O3RPI4WWUOJ/LT    ',
                NIDF: 'TGUZF1UGDTvKAJ   ',
            },
            '70060149': {
                NOMREST: 'CHOCOCAM S.A.',
                NRC: 'GWB5O3RPI4WWUOJ/GR    ',
                NIDF: 'TGUZF1UGDTvKAK   ',
            },
            '70056585': {
                NOMREST: 'NEWTELNET CONSULTING SARL',
                NRC: 'B5O3RPI4WWUOJ/AD    ',
                NIDF: 'TGUZF1UGDTvKAM   ',
            }
        };
        let result = clientCodes.filter(e => { return !!mapping[e] });
        if (result.length === 0) { return [] }
        result = result.map((e) => { return { CLI: e } });
        return Promise.resolve(result);
    },

    getMockClientsTels: async (clientCodes: any[]) => {
        const methodPath = `${classPath}.getMockClientsTels()`
        logger.info(`mock data used from ${methodPath}`);

        const mapping: any = {
            '70017185': {
                CLI: '87654321',
                TYP: '11',
                NUM: '+242069894986',
                NOMREST: 'TACHUM Achille',
                SEXT: 'm'
            },
            '87654321': {
                CLI: '87654321',
                TYP: '11',
                NUM: '+24069894986',
                NOMREST: 'TACHUM Achille',
                SEXT: 'm'
            },
            '70052448': {
                CLI: '70052448',
                TYP: '12',
                NUM: '+242068669500',
                NOMREST: 'ESSIAKOU BALLA Saïd',
            },
            '02478803': {
                CLI: '02478803',
                TYP: '11',
                NUM: '242055791126',
                NOMREST: 'LIBAM FRANCK',
            },
            '55555555': {
                CLI: '55555555',
                TYP: '10',
                NUM: '242055791126',
                NOMREST: 'MAMOUDOU Manssourou',
            },
            '66666666': {
                CLI: '66666666',
                TYP: '11',
                NUM: '242699949789',
                NOMREST: 'AMOGO Fabrice',
            },
            '75023431': {
                CLI: '75023431',
                TYP: '12',
                NUM: '24265231245',
                NOMREST: 'SIGNE KARL-DIMITRI',
            },
            '70089528': {
                CLI: '70089528',
                TYP: '11',
                NUM: '24265522332',
                NOMREST: 'Kevin MOUTASSI',
            },
        }
        let result = clientCodes.filter(e => { return !!mapping[e] });
        if (result.length === 0) { return [] }
        result = result.map((e) => mapping[e]);
        return Promise.resolve(result);
    },

    getMoackClientsEmails: async (clientCodes: any[]) => {
        const methodPath = `${classPath}.getMoackClientsEmails()`
        logger.info(`mock data used from ${methodPath}`);

        const mapping: any = {
            '70017185': {
                CLI: '87654321',
                TYP: '11',
                EMAIL: 'achille.tachum@londo.io',
                NOMREST: 'TACHUM Achille',
                SEXT: 'm'
            },
            '87654321': {
                CLI: '87654321',
                TYP: '11',
                EMAIL: 'achille.tachum@londo.io',
                NOMREST: 'TACHUM Achille',
                SEXT: 'm'
            },
            '70052448': {
                CLI: '70052448',
                TYP: '12',
                EMAIL: 'said.essiakou@londo.io',
                NOMREST: 'ESSIAKOU BALLA Saïd',
            },
            '02478803': {
                CLI: '02478803',
                TYP: '11',
                EMAIL: 'franck.libam@londo.io',
                NOMREST: 'LIBAM FRANCK',
            },
            '66666666': {
                CLI: '66666666',
                TYP: '11',
                EMAIL: 'fabrice.amogo@londo.io',
                NOMREST: 'AMOGO Fabrice',
            },
            '75023431': {
                CLI: '75023431',
                TYP: '12',
                EMAIL: 'dimitri.signe@londo.io',
                NOMREST: 'SIGNE KARL-DIMITRI',
            },
            '70089528': {
                CLI: '70089528',
                TYP: '11',
                EMAIL: 'kevin.moutassi@londo.io',
                NOMREST: 'Kevin MOUTASSI',
            },
        }
        let result = clientCodes.filter(e => { return !!mapping[e] });
        if (result.length === 0) { return [] }
        result = result.map((e) => mapping[e]);
        return Promise.resolve(result);
    },

    getMockClientAccountBalanceByNcp: () => { return [{ SOLDE: 500000000 }]; },

    getMockClientAccountBalanceByNcpAndAge: () => { return [{ DATE: '30/11/2020', SOLDE: 500000000 }]; },

    getMockClientCards: () => {
        return [{
            "AGE": "01700",
            "CODE_CLIENT": "70017464       ",
            "NOMREST": "ABONI OLANDA JERRY                                                 ",
            "NUM_CARTE": "604855******7233",
            "DATE_FIN_VALIDITE": "2022-02-28",
            "NUM_CPTE": "37307077836",
            "INTITULE_CMPTE": "COMPTES SUR LIVRETS           ",
            "LIBELLE_TYPE": "CARTE LEADER EMV  "
        },
        {
            "AGE": "01700",
            "CODE_CLIENT": "70017464       ",
            "NOMREST": "ABONI OLANDA JERRY                                                 ",
            "NUM_CARTE": "604855******6537",
            "DATE_FIN_VALIDITE": "2022-02-28",
            "NUM_CPTE": "37207077837",
            "INTITULE_CMPTE": "COMPTES DE CHEQUES            ",
            "LIBELLE_TYPE": "CARTE EXPRESS EMV             "
        }
        ]
    },

};