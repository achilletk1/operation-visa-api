import { CbsAccounts, CbsBankUser, CbsCard, CbsClientUser, CbsEmail, CbsPhone, CbsProduct } from "../../model";
import { logger } from "winston-config";

const classPath = 'oracle-daos.helper.clients';

export const helper = {

    getMockClientData: async (cli: any): Promise<(CbsClientUser | CbsBankUser)[]> => {
        const methodPath = `${classPath}.getMockClientData()`
        logger.info(`mock data used from ${methodPath}`);

        const mapping: any/*(CbsClientUser | CbsBankUser)[]*/ = {
            '37207027067': {
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
                NOMREST: 'TACHUM Achille    ',
                NOM: 'TACHUM   ',
                PRE: 'Achille  ',
                NID: 'OA0212971    ',
                VID: '28/10/29    ',
                SEXT: 'M',
                AGE: '06815   ',
                LANG: '001',
                CLI: '70017185',
                LIBELLE_AGENCE: 'DIRECTION GENERALE',
                TEL: '237693405447',
                EMAIL: 'achille.tachum@londo-tech.com',
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
            '02478804': {
                NOMREST: 'PORT AUTONOME DE KRIBI (PAK)',
                NOM: 'LIBAM',
                PRE: 'FRANCK    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   '
            },
            '02478805': {
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
                AGE: '12000   ',
                SEXT: 'M',
                LIBELLE_AGENCE: 'DIRECTION GENERALE',
                TEL: '237693405447',
                EMAIL: 'achille.tachum@londo-tech.com',
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

    getMockClientAccounts: (cli: any): Promise<CbsAccounts[]> => {
        const methodPath = `${classPath}.getMockClientAccounts()`

        logger.info(`mock data used from ${methodPath}`);

        const accounts: CbsAccounts[] = [
            {
                NCP: '37207027066',
                INTI: 'Compte de chèque              ',
                AGE: '01400',
                DEV: '001',
                CHA: '372100',
                CLC: '18',
                CURRENCY: 'XAF',
                LIB_AGE: 'BICEC AKWA              '
            },
            {
                NCP: '37307027068',
                INTI: 'Compte sur livret                     ',
                AGE: '01400',
                DEV: '001',
                CHA: '373100',
                CLC: '19',
                CURRENCY: 'XAF',
                LIB_AGE: 'BICEC EDEA            '
            },
            {
                NCP: '37207027066',
                INTI: 'Compte de chèque              ',
                AGE: '01800',
                DEV: '001',
                CHA: '372100',
                CLC: '20',
                CURRENCY: 'XAF',
                LIB_AGE: 'BICEC BASSA                    '
            },
            {
                NCP: '37307012338',
                INTI: 'Compte sur livret                     ',
                AGE: '01800',
                DEV: '001',
                CHA: '373100',
                CLC: '21',
                CURRENCY: 'XAF',
                LIB_AGE: 'DIRECTION GENERALE                            '
            },
            {
                NCP: '37107096755',
                INTI: 'Compte sur livret                     ',
                AGE: '01100',
                DEV: '001',
                CHA: '373100',
                CLC: '21',
                CURRENCY: 'XAF',
                LIB_AGE: 'BICEC BUEA UNIVERSITY                  '
            },
        ];
        return Promise.resolve(accounts);
    },

    getMockClientDatas: async (ncp: any): Promise<CbsClientUser[]> => {
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

        const clients: /*CbsClientUser*/any[] = [
            {
                NOMREST: 'TACHUM KAMGA Achille',
                NOM: 'TACHUM KAMGA',
                PRE: 'Achille',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '01400   ',
                NCP: '37207027066',
                CLC: '19 ',
                CIVILITY: 'Camerounaise',
                ADDRESS: 'Ange rafael ',
                TEL: '237693405447 ',
                POB: 'Kinshasa ',
                DOB: '11/04/1988',
                IDTYPE: 'PASSEPORT',
                IDNUM: '00258963',
                CHA: '372100',
                CLI: '70017185'
            },
            {
                NOMREST: 'MOUTASSI NZOGUE Kevin Armel',
                NOM: 'MOUTASSI NZOGUE',
                PRE: 'Kevin Armel',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '01400   ',
                NCP: '37207027067',
                CLC: '19 ',
                CIVILITY: 'Congolaise',
                ADDRESS: 'Kinshasa ',
                TEL: '242068207839 ',
                POB: 'DOUALA ',
                DOB: '11/04/1995',
                IDTYPE: 'CNI',
                IDNUM: '002589634785',
                CLI: '37207027067',
                CHA: '372100',
            },
            {
                NOMREST: 'MOUTASSI NZOGUE Kevin Armel',
                NOM: 'MOUTASSI NZOGUE',
                PRE: 'Kevin Armel',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '01400   ',
                NCP: '37207012337',
                CLC: '19 ',
                CIVILITY: 'Congolaise',
                ADDRESS: 'Kinshasa ',
                TEL: '242068207839 ',
                EMAIL: 'test@gmail.com',
                POB: 'DOUALA ',
                DOB: '11/04/1995',
                IDTYPE: 'CNI',
                IDNUM: '002589634785',
                CLI: '00000000',
                CHA: '372100',
            },
            {
                NOMREST: 'TACHUM KAMGA Achille',
                NOM: 'TACHUM KAMGA',
                PRE: 'Achille',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '01400   ',
                NCP: '37307012338',
                CLC: '19 ',
                CIVILITY: 'Camerounaise',
                ADDRESS: 'Ange rafael ',
                TEL: '237693405449',
                POB: 'Kinshasa ',
                DOB: '11/04/1988',
                IDTYPE: 'PASSEPORT',
                IDNUM: '00258963',
                CHA: '372100',
                CLI: '02478805'
            },
            {
                NOMREST: 'TACHUM KAMGA Achille',
                NOM: 'TACHUM KAMGA',
                PRE: 'Achille',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '01400   ',
                NCP: '37307012338',
                CLC: '19 ',
                CIVILITY: 'Camerounaise',
                ADDRESS: 'Ange rafael ',
                TEL: '242068207839 ',
                POB: 'Kinshasa ',
                DOB: '11/04/1988',
                IDTYPE: 'PASSEPORT',
                IDNUM: '00258963',
                CHA: '372100',
                CLI: '02478803'
            },
        ]

        const result = clients.filter(client => client.NCP == ncp);

        return Promise.resolve(result);
    },

    getMockClientsTels: async (clientCodes: any[]): Promise<CbsPhone[]> => {
        const methodPath = `${classPath}.getMockClientsTels()`
        logger.info(`mock data used from ${methodPath}`);

        const mapping: CbsPhone[] = [
            {
                CLI: '87654321',
                TYP: '11',
                NUM: '+242069894986',
                NOMREST: 'TACHUM Achille',
                // SEXT: 'm'
            },
            {
                CLI: '87654321',
                TYP: '11',
                NUM: '+24069894986',
                NOMREST: 'TACHUM Achille',
                // SEXT: 'm'
            },
            {
                CLI: '70052448',
                TYP: '12',
                NUM: '+242068669500',
                NOMREST: 'ESSIAKOU BALLA Saïd',
            },
            {
                CLI: '02478803',
                TYP: '11',
                NUM: '242055791126',
                NOMREST: 'LIBAM FRANCK',
            },
            {
                CLI: '55555555',
                TYP: '10',
                NUM: '242055791126',
                NOMREST: 'MAMOUDOU Manssourou',
            },
            {
                CLI: '66666666',
                TYP: '11',
                NUM: '242699949789',
                NOMREST: 'AMOGO Fabrice',
            },
            {
                CLI: '75023431',
                TYP: '12',
                NUM: '24265231245',
                NOMREST: 'SIGNE KARL-DIMITRI',
            },
            {
                CLI: '70089528',
                TYP: '11',
                NUM: '24265522332',
                NOMREST: 'Kevin MOUTASSI',
            },
        ];
        const result = mapping.filter(e => clientCodes.includes(e.CLI));
        // if (result.length === 0) { return [] }
        // result = result.map((e) => mapping[e]);
        return Promise.resolve(result);
    },

    getMoackClientsEmails: async (clientCodes: any[]): Promise<CbsEmail[]> => {
        const methodPath = `${classPath}.getMoackClientsEmails()`
        logger.info(`mock data used from ${methodPath}`);

        const mapping: CbsEmail[] = [
            {
                CLI: '87654321',
                TYP: '11',
                EMAIL: 'achille.tachum@londo.io',
                NOMREST: 'TACHUM Achille',
                // SEXT: 'm'
            },
            {
                CLI: '87654321',
                TYP: '11',
                EMAIL: 'achille.tachum@londo.io',
                NOMREST: 'TACHUM Achille',
                // SEXT: 'm'
            },
            {
                CLI: '70052448',
                TYP: '12',
                EMAIL: 'said.essiakou@londo.io',
                NOMREST: 'ESSIAKOU BALLA Saïd',
            },
            {
                CLI: '02478803',
                TYP: '11',
                EMAIL: 'franck.libam@londo.io',
                NOMREST: 'LIBAM FRANCK',
            },
            {
                CLI: '66666666',
                TYP: '11',
                EMAIL: 'fabrice.amogo@londo.io',
                NOMREST: 'AMOGO Fabrice',
            },
            {
                CLI: '75023431',
                TYP: '12',
                EMAIL: 'dimitri.signe@londo.io',
                NOMREST: 'SIGNE KARL-DIMITRI',
            },
            {
                CLI: '70089528',
                TYP: '11',
                EMAIL: 'kevin.moutassi@londo.io',
                NOMREST: 'Kevin MOUTASSI',
            },
        ];
        const result = mapping.filter(e => clientCodes.includes(e.CLI));
        // if (result.length === 0) { return [] }
        // result = result.map((e) => mapping[e]);
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

    getMockClientCards: async (): Promise<CbsCard[]> => {
        const cards: CbsCard[] = [
            {
                AGE: "01700",
                CPRO: '321',
                CODE_CLIENT: "70017464",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "445411******2849",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37307077836",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "GIMAC Express"
            },
            {
                AGE: "01700",
                CPRO: '430',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "445411******6600",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "GIMAC CONFORT"
            },
            {
                AGE: "01700",
                CPRO: '420',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "445411******8747",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "GIMAC MOOV"
            },
            {
                AGE: "01700",
                CPRO: '408',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "445411******7533",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "VISA Serenity"
            },
            {
                AGE: "01700",
                CPRO: '206',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "445411******5635",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "VISA Classic"
            },
            {
                AGE: "01700",
                CPRO: '207',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "445411******2849",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "VISA Gold"
            },
            {
                AGE: "01700",
                CPRO: '208',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "445411******9465",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "VISA Business"
            },
            {
                AGE: "01700",
                CPRO: '209',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "445411******6676",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "VISA Business Prem"
            },
            {
                AGE: "01700",
                CPRO: '948',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "445410******9441",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "VISA Platinum"
            },
            {
                AGE: "01700",
                CPRO: '958',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "445411******2652",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "VISA Infinite"
            },

            {
                AGE: "01700",
                CPRO: '185',
                CODE_CLIENT: "70017464",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "604855******7233",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37307077836",
                INTITULE_CMPTE: "COMPTES SUR LIVRETS",
                LIBELLE_TYPE: "CARTE LEADER EMV  "
            },
            {
                AGE: "01700",
                CPRO: '186',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "604855******6537",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "CARTE EXPRESS EMV"
            },
            {
                AGE: "01700",
                CPRO: '408',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "604855******6538",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "VISA Serenity"
            }
        ];
        return Promise.resolve(cards);
    },

    getMockCardTypes: async (productCode: string): Promise<any> => {
        const cartTypes = [
            {
                productCode: '185',
                label: "CARTE LEADER EMV ",
                cardTypeTransactions: [
                    {
                        label: 'Retrait',
                        maxAmountPerDay: 300000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Paiement',
                        maxAmountPerDay: 500000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 5,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 5,
                        amount : 6000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 15,
                        amount : 7000,
                    },
                    {
                        label: 'Profile 4 (400%)',
                        percentage: 400,
                        maxTransactionsPerDay: 15,
                        amount : 8000,
                    },
                ],
            },
            {
                productCode: '186',
                label: "CARTE EXPRESS EMV",
                cardTypeTransactions: [
                    {
                        label: 'Achat TPE',
                        maxAmountPerDay: 1000000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'E-Commerce',
                        maxAmountPerDay: 1000000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    },
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 5,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 5,
                        amount : 6000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 15,
                        amount : 7000,
                    },
                ],
            },
            {
                productCode: '321',
                label: "GIMAC Express",
                cardTypeTransactions: [
                    {
                        label: 'Retrait',
                        maxAmountPerDay: 300000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Paiement',
                        maxAmountPerDay: 500000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 5,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 5,
                        amount : 6000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 15,
                        amount : 7000,
                    },
                    {
                        label: 'Profile 4 (400%)',
                        percentage: 400,
                        maxTransactionsPerDay: 15,
                        amount : 10000,
                    },
                ],
            },
            {
                productCode: '430',
                label: "GIMAC CONFORT",
                cardTypeTransactions: [
                    {
                        label: 'Retrait',
                        maxAmountPerDay: 750000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    }
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 5,
                        amount : 4000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 5,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 15,
                        amount : 6000,
                    },
                    {
                        label: 'Profile 4 (400%)',
                        percentage: 400,
                        maxTransactionsPerDay: 15,
                        amount : 8000,
                    },
                ],
            },
            {
                productCode: '420',
                label: "GIMAC MOOV",
                cardTypeTransactions: [
                    {
                        label: 'Retrait',
                        maxAmountPerDay: 300000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    }
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 5,
                        amount : 3000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 5,
                        amount : 4000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 15,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 4 (400%)',
                        percentage: 400,
                        maxTransactionsPerDay: 15,
                        amount : 6000,
                    },
                ],
            },
            {
                productCode: '408',
                label: "VISA Serenity",
                cardTypeTransactions: [
                    {
                        label: 'Retrait',
                        maxAmountPerDay: 1000000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Achat TPE',
                        maxAmountPerDay: 1000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'E-Commerce',
                        maxAmountPerDay: 1000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Cash Advance',
                        maxAmountPerDay: 1000000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    }
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 5,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 5,
                        amount : 6000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 15,
                        amount : 7000,
                    },
                    {
                        label: 'Profile 4 (400%)',
                        percentage: 400,
                        maxTransactionsPerDay: 15,
                        amount : 9000,
                    },
                ],
            },
            {
                productCode: '206',
                label: "VISA Classic",
                cardTypeTransactions: [
                    {
                        label: 'Retrait',
                        maxAmountPerDay: 1500000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Achat TPE',
                        maxAmountPerDay: 2000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'E-Commerce',
                        maxAmountPerDay: 2000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Cash Advance',
                        maxAmountPerDay: 1500000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    }
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 5,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 5,
                        amount : 6000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 15,
                        amount : 7000,
                    },
                    {
                        label: 'Profile 4 (400%)',
                        percentage: 400,
                        maxTransactionsPerDay: 15,
                        amount : 9000,
                    },
                ],
            },
            {
                productCode: '207',
                label: "VISA Gold",
                cardTypeTransactions: [
                    {
                        label: 'Retrait',
                        maxAmountPerDay: 200000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Achat TPE',
                        maxAmountPerDay: 5000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'E-Commerce',
                        maxAmountPerDay: 5000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Cash Advance',
                        maxAmountPerDay: 2000000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    }
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 5,
                        amount : 4000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 5,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 15,
                        amount : 6000,
                    },
                    {
                        label: 'Profile 4 (400%)',
                        percentage: 400,
                        maxTransactionsPerDay: 15,
                        amount : 8000,
                    },
                ],
            },
            {
                productCode: '208',
                label: "VISA Business",
                cardTypeTransactions: [
                    {
                        label: 'Retrait',
                        maxAmountPerDay: 200000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Achat TPE',
                        maxAmountPerDay: 5000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'E-Commerce',
                        maxAmountPerDay: 5000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Cash Advance',
                        maxAmountPerDay: 2000000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    }
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 5,
                        amount : 4000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 5,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 15,
                        amount : 6000,
                    },
                    {
                        label: 'Profile 4 (400%)',
                        percentage: 400,
                        maxTransactionsPerDay: 15,
                        amount : 7000,
                    },
                ],
            },
            {
                productCode: '209',
                label: "VISA Business Prem",
                cardTypeTransactions: [
                    {
                        label: 'Retrait',
                        maxAmountPerDay: 400000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Achat TPE',
                        maxAmountPerDay: 10000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'E-Commerce',
                        maxAmountPerDay: 10000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 5,
                    },
                    {
                        label: 'Cash Advance',
                        maxAmountPerDay: 4000000,
                        frequency: 'week',
                        maxTransactionsPerDay: 5,
                    }
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 5,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 5,
                        amount : 6000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 15,
                        amount : 7000,
                    },
                    {
                        label: 'Profile 4 (400%)',
                        percentage: 400,
                        maxTransactionsPerDay: 15,
                        amount : 8000,
                    },
                ],
            },
            {
                productCode: '948',
                label: "VISA Platinum",
                cardTypeTransactions: [
                    {
                        label: 'Retrait',
                        maxAmountPerDay: 400000,
                        frequency: 'week',
                        maxTransactionsPerDay: 10,
                    },
                    {
                        label: 'Achat TPE',
                        maxAmountPerDay: 12000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 10,
                    },
                    {
                        label: 'E-Commerce',
                        maxAmountPerDay: 12000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 10,
                    },
                    {
                        label: 'Cash Advance',
                        maxAmountPerDay: 4000000,
                        frequency: 'week',
                        maxTransactionsPerDay: 10,
                    }
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 10,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 10,
                        amount : 6000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 30,
                        amount : 7000,
                    },
                    {
                        label: 'Profile 4 (400%)',
                        percentage: 400,
                        maxTransactionsPerDay: 30,
                        amount : 8500,
                    },
                ],
            },
            {
                productCode: '958',
                label: "VISA Infinite",
                cardTypeTransactions: [
                    {
                        label: 'Retrait',
                        maxAmountPerDay: 7000000,
                        frequency: 'week',
                        maxTransactionsPerDay: 15,
                    },
                    {
                        label: 'Achat TPE',
                        maxAmountPerDay: 15000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 15,
                    },
                    {
                        label: 'E-Commerce',
                        maxAmountPerDay: 15000000,
                        frequency: 'month',
                        maxTransactionsPerDay: 15,
                    },
                    {
                        label: 'Cash Advance',
                        maxAmountPerDay: 7000000,
                        frequency: 'week',
                        maxTransactionsPerDay: 15,
                    }
                ],
                profiles: [
                    {
                        label: 'Profile 1 (100%)',
                        percentage: 100,
                        maxTransactionsPerDay: 15,
                        amount : 5000,
                    },
                    {
                        label: 'Profile 2 (150%)',
                        percentage: 150,
                        maxTransactionsPerDay: 15,
                        amount : 6000,
                    },
                    {
                        label: 'Profile 3 (200%)',
                        percentage: 200,
                        maxTransactionsPerDay: 45,
                        amount : 7000,
                    },
                    {
                        label: 'Profile 4 (400%)',
                        percentage: 400,
                        maxTransactionsPerDay: 45,
                        amount : 8000,
                    },
                ],
            }  
        ];

        const result = cartTypes.find(cartType => cartType.productCode == productCode);
        return Promise.resolve(result);

    },

    getMockProductData: async (code: string): Promise<(CbsProduct | undefined)[]> => {
        const products: CbsProduct[] = [
            {
                CPRO: '321',
                LIB: 'GIMAC Express',
            },
            {
                CPRO: '430',
                LIB: 'GIMAC CONFORT',
            },
            {
                CPRO: '420',
                LIB: 'GIMAC MOOV',
            },
            {
                CPRO: '408',
                LIB: 'VISA Serenity',
            },
            {
                CPRO: '206',
                LIB: 'VISA Classic',
            },
            {
                CPRO: '207',
                LIB: 'VISA Gold',
            },
            {
                CPRO: '207',
                LIB: 'VISA Business',
            },
            {
                CPRO: '209',
                LIB: 'VISA Business Prem',
            },
            {
                CPRO: '948',
                LIB: 'VISA Platinum',
            },
            {
                CPRO: '958',
                LIB: 'VISA Infinite',
            },
            {
                CPRO: '185',
                LIB: "CARTE LEADER EMV ",
            },
            {
                CPRO: '186',
                LIB: "CARTE EXPRESS EMV             ",
            },
        ];
        return Promise.resolve([products.find(e => e.CPRO === code)]);
    },

};
