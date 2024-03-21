import { CbsAccounts, CbsBankAccountManager, CbsBankUser, CbsCard, CbsClientUser, CbsEmail, CbsPhone, CbsProduct } from "../../model";
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
                SOLDE: 1000000,
                TCLI: '2'
            },
            '70071770': {
                NOMREST: 'LONDO TECHNOLOGY',
                NRC: 'AZERTYUIOPLKJHGF    ',
                NIDF: '234567UHG89IERTYU   ',
                TCLI: '2'
            },
            '02478800': {
                NOMREST: 'MUNYENGUE SARL',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                TCLI: '2'
            },
            '70030525': {
                NOMREST: 'MUNYENGUE SARL',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                TCLI: '2'
            },
            '12598000': {
                NOMREST: 'MTN CONGO SA',
                NRC: 'GWB5O3RPI4WWUCJHGFV    ',
                NIDF: 'TGUZF1UGDT9KLO   ',
                TCLI: '2'
            },
            '70089549': {
                NOMREST: 'MVOGO Dominique',
                NOM: 'MVOGO',
                PRE: 'Dominique    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14456   ',
                TCLI: '1'
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
                TCLI: '1'
            },
            '87654321': {
                NOMREST: 'TACHUM Achille',
                NOM: 'TACHUM',
                PRE: 'Achille',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '14456   ',
                SEXT: 'm',
                TCLI: '1'
            },
            '70052448': {
                NOMREST: 'ESSIAKOU BALLA Saïd',
                NOM: 'ESSIAKOU BALLA',
                PRE: 'SAID    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   ',
                TCLI: '1'
            },
            '02478803': {
                NOMREST: 'PORT AUTONOME DE KRIBI (PAK)',
                NOM: 'LIBAM',
                PRE: 'FRANCK    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   ',
                TCLI: '2'
            },
            '02478804': {
                NOMREST: 'PORT AUTONOME DE KRIBI (PAK)',
                NOM: 'LIBAM',
                PRE: 'FRANCK    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   ',
                TCLI: '2'
            },
            '02478805': {
                NOMREST: 'PORT AUTONOME DE KRIBI (PAK)',
                NOM: 'LIBAM',
                PRE: 'FRANCK    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   ',
                TCLI: '1'
            },
            '70089548': {
                NOMREST: 'SIGNE KARL-DIMITRI',
                NOM: 'SIGNE SIGNE',
                PRE: 'KARL-DIMITRI    ',
                NRC: 'GWB5O3RPI4WWUCJ/DV    ',
                NIDF: 'TGUZF1UGDT9KAQ   ',
                AGE: '12023   ',
                TCLI: '1'
            },
            '70089547': {
                NOMREST: 'FOMAZOU Idriss Stellor',
                NOM: 'FOMAZOU',
                PRE: 'Stellor    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   ',
                TCLI: '1'
            },
            '70030524': {
                NOMREST: 'Henri MAKAKI',
                NOM: 'MAKAKI',
                PRE: 'Henri    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   ',
                TCLI: '1'
            },
            '70089523': {
                NOMREST: 'Henri MAKAKI',
                NOM: 'MAKAKI',
                PRE: 'Henri    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   ',
                TCLI: '1'
            },
            '70089528': {
                NOMREST: 'Kevin MOUTASSI',
                NOM: 'MOUTASSI',
                PRE: 'Kevin    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   ',
                TCLI: '1'
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
                TCLI: '1'
            },
            '70089578': {
                NOMREST: 'Brice LETUTOUR',
                NOM: 'Brice',
                PRE: 'LETUTOUR    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   ',
                TCLI: '1'
            },
            '70089545': {
                NOMREST: 'Welisane MANGA',
                NOM: 'Welisane',
                PRE: 'MANGA    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   ',
                TCLI: '1'
            },
            '70089546': {
                NOMREST: 'Rolain KONO',
                NOM: 'Rolain',
                PRE: 'KONO    ',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   ',
                TCLI: '1'
            },
            '70089587': {
                NOMREST: 'MOUTASSI NZOGUE Armel Kevin',
                NOM: 'MOUTASSI NZOGUE',
                PRE: 'Armel Kevin',
                NRC: 'GWB5O3RPI4WWUOJ/DV    ',
                NIDF: 'TGUZF1UGDTvKAQ   ',
                AGE: '12000   ',
                TCLI: '1'
            },
            '70060244': {
                NOMREST: 'TANTIE FOODS S.A.',
                NRC: 'GWB5O3RPI4WWUOJ/LT    ',
                NIDF: 'TGUZF1UGDTvKAJ   ',
                TCLI: '3'
            },
            '70060149': {
                NOMREST: 'CHOCOCAM S.A.',
                NRC: 'GWB5O3RPI4WWUOJ/GR    ',
                NIDF: 'TGUZF1UGDTvKAK   ',
                TCLI: '2'
            },
            '70056585': {
                NOMREST: 'NEWTELNET CONSULTING SARL',
                NRC: 'B5O3RPI4WWUOJ/AD    ',
                NIDF: 'TGUZF1UGDTvKAM   ',
                TCLI: '3'
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
                TCLI: '1'
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
                TCLI: '1'
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
                CLI: '70017185',
                TCLI: '1'
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
                TCLI: '1'
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
                TCLI: '1'
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
                CLI: '02478805',
                TCLI: '1'
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
                CLI: '02478803',
                TCLI: '1'
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
            },
            {
                AGE: "01700",
                CPRO: '550',
                CODE_CLIENT: "70017464       ",
                NOMREST: "ABONI OLANDA JERRY",
                NUM_CARTE: "604855******6538",
                DATE_FIN_VALIDITE: "2022-02-28",
                NUM_CPTE: "37207077837",
                INTITULE_CMPTE: "COMPTES DE CHEQUES",
                LIBELLE_TYPE: "VISA Achille"
            }
        ];
        return Promise.resolve(cards);
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
            {
                CPRO: '550',
                LIB: "VISA Achille             ",
            },
        ];
        const product = products.find(e => e.CPRO === code);
        return Promise.resolve(product ? [product] : []);
    },

    getMockBankAccountManagerData: async (): Promise<CbsBankAccountManager[]> => {
        const bankAccountManager: CbsBankAccountManager[] = [
            { AGE_UTI: '3536', FULLNAME: 'MBOLE JUSTIN', CODE_GES: '127', AGE: '06867', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3603', FULLNAME: 'NYANKENG MIRIAM', CODE_GES: '286', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '93405447' },
            { AGE_UTI: '3607', FULLNAME: 'EDIMO NGOUBE HENRI MARCEL', CODE_GES: '302', AGE: '06811', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3615', FULLNAME: 'MBOCK MBOCK ETIENNE', CODE_GES: '188', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '93405447' },
            { AGE_UTI: '3618', FULLNAME: 'MBENOUN NEE NGO NSOGA PHILOMEN', CODE_GES: '137', AGE: '06864', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3624', FULLNAME: 'NDONGO ALO O PROSPER', CODE_GES: '158', AGE: '06828', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3627', FULLNAME: 'NGWA FRANCIS SHU', CODE_GES: '169', AGE: '06842', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3671', FULLNAME: 'MANA BOUBA', CODE_GES: '176', AGE: '06872', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3672', FULLNAME: 'WANGSO', CODE_GES: '124', AGE: '06870', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3694', FULLNAME: 'NAMEKONG GUY', CODE_GES: '035', AGE: '06835', EMAIL: 'achille.tachum@londo-tech.com', TEL: '93405447' },
            { AGE_UTI: '3699', FULLNAME: 'KANSE CLEMENTINE T', CODE_GES: '130', AGE: '06803', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3738', FULLNAME: 'TSONGOUANG CARINE', CODE_GES: '154', AGE: '06805', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3750', FULLNAME: 'NDOME FIDELE', CODE_GES: '128', AGE: '06843', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3784', FULLNAME: 'YOUNOUSSA BOUBA DEWA', CODE_GES: '209', AGE: '06873', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3789', FULLNAME: 'NDJE MATHILDE', CODE_GES: '309', AGE: '06814', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3795', FULLNAME: 'MIMBANG CHRISTELE EPSE SIANKAM', CODE_GES: '261', AGE: '06861', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3803', FULLNAME: 'BENGONO FLAVIE EPSE BIFOUNOU', CODE_GES: '202', AGE: '06865', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3815', FULLNAME: 'ENDALE EPSE SOPPO MOUDIKI YVON', CODE_GES: '241', AGE: '06810', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3825', FULLNAME: 'OWE BONIFACE', CODE_GES: '240', AGE: '06812', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3848', FULLNAME: 'MBALIDAM ESTHER', CODE_GES: '278', AGE: '06808', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3851', FULLNAME: 'SOULEYMANOU OUMAROU', CODE_GES: '109', AGE: '06871', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3853', FULLNAME: 'EPESSE MOUNOUME RICHARD', CODE_GES: '192', AGE: '06838', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3857', FULLNAME: 'YUFENYUY MENGNJO ALPHONSE', CODE_GES: '157', AGE: '06850', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3862', FULLNAME: 'AYUK VIVIAN NKONGHO', CODE_GES: '044', AGE: '06840', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3871', FULLNAME: 'ETOUNDI LEONARD LANDRY', CODE_GES: '338', AGE: '06862', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3882', FULLNAME: 'ABEGA ETOGO GHISLAIN', CODE_GES: '106', AGE: '06866', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3885', FULLNAME: 'NONO FIRMIN AYMARD', CODE_GES: '145', AGE: '06807', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3890', FULLNAME: 'MAKANG MA YINDA MICHEL', CODE_GES: '147', AGE: '06868', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3922', FULLNAME: 'LYONGA MUANJE JOHN', CODE_GES: '165', AGE: '06841', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3928', FULLNAME: 'NGO NLONDOK PAULETTE SUZANNE', CODE_GES: '152', AGE: '06820', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3975', FULLNAME: 'AKUM MBAZE DERRICK', CODE_GES: '296', AGE: '06845', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3977', FULLNAME: 'BOUGHA SERGE', CODE_GES: '076', AGE: '06821', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3994', FULLNAME: 'NSOLO BOUELE JEAN SABIN', CODE_GES: '110', AGE: '06858', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4060', FULLNAME: 'ELLA ESSELEM ARMAND', CODE_GES: '103', AGE: '06863', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4069', FULLNAME: 'ZE NDONGO SIMON PIERRE', CODE_GES: '100', AGE: '06869', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3658', FULLNAME: 'OUMAROU DAWAYE', CODE_GES: '517', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3739', FULLNAME: 'MANGA ANNE', CODE_GES: '', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3918', FULLNAME: 'MAFOTET LADZOU JOSELINE JOELLE', CODE_GES: '511', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4007', FULLNAME: 'EBODE BENZOL ANTOINE VALERIE', CODE_GES: '510', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4068', FULLNAME: 'TCHAPMI KAMCHEU SANDRINE L', CODE_GES: '509', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4102', FULLNAME: 'CHARRE NJOYA LOUIS BENOIT', CODE_GES: '227', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4124', FULLNAME: 'NOAH JEAN GERARD', CODE_GES: '512', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '93405447' },
            { AGE_UTI: '4142', FULLNAME: 'NJOH DIPITA MANFRED', CODE_GES: '507', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4303', FULLNAME: 'DAMBA MBAGNA DORICE VIRGINIA', CODE_GES: '518', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4592', FULLNAME: 'MENGUE JOSEPHINE', CODE_GES: '', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4610', FULLNAME: 'NDJE SIMON', CODE_GES: '514', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4614', FULLNAME: 'ELESSA ETUMAN DANIEL ARCHIBALD', CODE_GES: '516', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4639', FULLNAME: 'NGO NDENHA THERESE ESPERANCE', CODE_GES: '519', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3427', FULLNAME: 'KEMKUGNING ALBERT', CODE_GES: '224', AGE: '06835', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3433', FULLNAME: 'MONTI EKANI CECILE CLEMENTINE', CODE_GES: '140', AGE: '06803', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3602', FULLNAME: 'NDONGO BESSALA LOUISE AGATHE', CODE_GES: '262', AGE: '06861', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3638', FULLNAME: 'DJEUTCHEU DIANE ELVIRE', CODE_GES: '119', AGE: '06805', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3643', FULLNAME: 'KEMPENI HENRIETTE', CODE_GES: '297', AGE: '06810', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3668', FULLNAME: 'MANI ZOGO CHARLES', CODE_GES: '107', AGE: '06821', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3670', FULLNAME: 'NGANPO DJANGA HILAIRE', CODE_GES: '245', AGE: '06803', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3675', FULLNAME: 'LAWANE DJADJI', CODE_GES: '208', AGE: '06870', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3680', FULLNAME: 'AWONG VALENTINE MARIANE', CODE_GES: '148', AGE: '06803', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3682', FULLNAME: 'ETABA Simone', CODE_GES: '303', AGE: '06811', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3689', FULLNAME: 'ESSAKA DOUMBE RUTH', CODE_GES: '285', AGE: '06803', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3700', FULLNAME: 'NDIEUPE CATHERINE V', CODE_GES: '239', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3719', FULLNAME: 'MERCY MANJU NGWA', CODE_GES: '180', AGE: '06850', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3741', FULLNAME: 'NGNINTEDEM NEGUE CHRISTIANE', CODE_GES: '177', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3743', FULLNAME: 'NYAMSI EYOUM LOUISE', CODE_GES: '307', AGE: '06807', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3769', FULLNAME: 'EKANE REINE SOLANGE', CODE_GES: '275', AGE: '06864', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3778', FULLNAME: 'NGO NGINJEL ALYDA EPSE MESSANG', CODE_GES: '281', AGE: '06808', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3781', FULLNAME: 'TITI HERMINE SABINE', CODE_GES: '104', AGE: '06805', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3790', FULLNAME: 'NOUBISSE GISELE EPSE MOUMPOU', CODE_GES: '304', AGE: '06811', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3816', FULLNAME: 'MBANGO DIKA PAULINE', CODE_GES: '114', AGE: '06805', EMAIL: 'achille.tachum@londo-tech.com', TEL: '93405447' },
            { AGE_UTI: '3826', FULLNAME: 'ENAMA ESSINDI FRANCOISE', CODE_GES: '288', AGE: '06862', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3831', FULLNAME: 'NGO OUM XAVIER EPSE BESOMBA', CODE_GES: '184', AGE: '06864', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3833', FULLNAME: 'MOPPE SANDRINE', CODE_GES: '279', AGE: '06808', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3838', FULLNAME: 'BITEBECK NGUI ALPHONSE', CODE_GES: '234', AGE: '06825', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3844', FULLNAME: 'DJON FIDELE EPSE OLGANE', CODE_GES: '170', AGE: '06864', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3847', FULLNAME: 'MAHOPP PAULE AURELIA', CODE_GES: '250', AGE: '06812', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3849', FULLNAME: 'IBRAHIMA SALI', CODE_GES: '332', AGE: '06873', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3860', FULLNAME: 'NWATCHOH ESSAMA SOLANGE', CODE_GES: '105', AGE: '06805', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3864', FULLNAME: 'FOKOUE FOYET PAUL', CODE_GES: '238', AGE: '06872', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3870', FULLNAME: 'NGWE JACKY J  EPSE MINKOULOU', CODE_GES: '258', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3873', FULLNAME: 'OUSMANE MEY ABALI', CODE_GES: '065', AGE: '06865', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3880', FULLNAME: 'BEKOLA EKENYA BABETTE', CODE_GES: '144', AGE: '06814', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3886', FULLNAME: 'NGO NONGA BRIGITTE', CODE_GES: '219', AGE: '06864', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3897', FULLNAME: 'IBRAHIMA KAIGAMA', CODE_GES: '255', AGE: '06870', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3898', FULLNAME: 'SEYTANG PAUL', CODE_GES: '284', AGE: '06872', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3924', FULLNAME: 'ETTA AGBOR KEVIN LIKUETTA', CODE_GES: '171', AGE: '06845', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3942', FULLNAME: 'OBEKANAK FIDELE', CODE_GES: '197', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3949', FULLNAME: 'NGO MBENOUN ESTHER', CODE_GES: '271', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3950', FULLNAME: 'KOUOGUE NOUBISSI ERIC', CODE_GES: '272', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3958', FULLNAME: 'KOTNA JACQUELINE', CODE_GES: '305', AGE: '06814', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3993', FULLNAME: 'NJOH BEBEY BRICE', CODE_GES: '320', AGE: '06803', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3995', FULLNAME: 'NGO NGAM EPSE SUNJO', CODE_GES: '348', AGE: '06863', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4004', FULLNAME: 'BITJOKA SANDRINE', CODE_GES: '129', AGE: '06812', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4006', FULLNAME: 'BONGA MAXIMILIENNE NADEGE', CODE_GES: '331', AGE: '06862', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4008', FULLNAME: 'ELENDA SERGE IVAN', CODE_GES: '299', AGE: '06820', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4009', FULLNAME: 'FOUDA NDI CALIXTE', CODE_GES: '346', AGE: '06861', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4010', FULLNAME: 'MBENOUN FREDERIQUE AUREL', CODE_GES: '199', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4013', FULLNAME: 'MAZO JODELE', CODE_GES: '143', AGE: '06814', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4016', FULLNAME: 'NGO NGAN MARIE SOLANGE PERPETU', CODE_GES: '189', AGE: '06820', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4019', FULLNAME: 'BILONG ERIC', CODE_GES: '', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4020', FULLNAME: 'BITO ELISE ARMELLE LAURE', CODE_GES: '108', AGE: '06807', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4025', FULLNAME: 'SOULEYE SADOU', CODE_GES: '322', AGE: '06873', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4033', FULLNAME: 'CLIFF STENDHALE LEA FEUMBA', CODE_GES: '223', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4036', FULLNAME: 'YOMBI A TIATI FIRMIN WILFRIED', CODE_GES: '123', AGE: '06835', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4038', FULLNAME: 'BILLONG JOSEPH ERIC', CODE_GES: '', AGE: '06812', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4040', FULLNAME: 'MOUNG NDONG REMY YANNICK', CODE_GES: '215', AGE: '06840', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4052', FULLNAME: 'LOE NDANDO REINE DANIELLE E', CODE_GES: '167', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4056', FULLNAME: 'NGO YEBGA LOUISE', CODE_GES: '181', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '93405447' },
            { AGE_UTI: '4062', FULLNAME: 'GUEMBU KOM BELLINI', CODE_GES: '277', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4065', FULLNAME: 'TITA YVETTE MUSEN', CODE_GES: '270', AGE: '06841', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4070', FULLNAME: 'FOGUETSOP HERBERT ROMUALD', CODE_GES: '204', AGE: '06867', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4071', FULLNAME: 'NGALEU RAOUL', CODE_GES: '142', AGE: '06868', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4072', FULLNAME: 'SADOU IBRAHIM', CODE_GES: '213', AGE: '06872', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4075', FULLNAME: 'KEDE EYEYA CORNEILLE SERGE', CODE_GES: '216', AGE: '06842', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4076', FULLNAME: 'YEDE JEROME KADER', CODE_GES: '228', AGE: '06805', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4082', FULLNAME: 'DJOUMGOUE DJIETCHEU LISE FERNA', CODE_GES: '251', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4095', FULLNAME: 'NDJENG ROSE MONIQUE', CODE_GES: '257', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4098', FULLNAME: 'TSEGANG NDACHI NADEGE CLAIRE', CODE_GES: '178', AGE: '06864', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4118', FULLNAME: 'SEKOUTOURE SAIDOU', CODE_GES: '146', AGE: '06864', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4137', FULLNAME: 'NKOUENGA FENSO PAMELA', CODE_GES: '201', AGE: '06864', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4139', FULLNAME: 'TABOH SILVETTE IJANG', CODE_GES: '220', AGE: '06840', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4140', FULLNAME: 'BILLE YVON GEORGIE', CODE_GES: '162', AGE: '06825', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4141', FULLNAME: 'TCHAMINOU CARINE FLORE', CODE_GES: '248', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4145', FULLNAME: 'JANGA JANGA PIAU VIRGIL LANCON', CODE_GES: '191', AGE: '06828', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4150', FULLNAME: 'DONGMO ZEKO SERGE', CODE_GES: '280', AGE: '06808', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4151', FULLNAME: 'NGNIETCHEYO CHANCELINE NADEGE', CODE_GES: '187', AGE: '06803', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4158', FULLNAME: 'NGO BIKOK VERONIQUE GRACE', CODE_GES: '243', AGE: '06843', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4159', FULLNAME: 'ACHAMBA JACQUELINE', CODE_GES: '060', AGE: '06850', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4167', FULLNAME: 'BUCK MBAH', CODE_GES: '244', AGE: '06845', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4203', FULLNAME: 'OMBOLO YANNICK WILLIAM', CODE_GES: '207', AGE: '06870', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4242', FULLNAME: 'AICHATOU ESSIANE ARIELLE', CODE_GES: '253', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4262', FULLNAME: 'KAMMO SADIO Roseline Larissa', CODE_GES: '120', AGE: '06803', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4270', FULLNAME: 'MBIDA Pierre Francis', CODE_GES: '008', AGE: '06835', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4322', FULLNAME: 'GARA SIMPLICE', CODE_GES: '221', AGE: '06871', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4340', FULLNAME: 'EKALLE ETONDE PHILIANE SONIA', CODE_GES: '185', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4350', FULLNAME: 'LOE EYIKE HENRI MARCEL STEPHAN', CODE_GES: '834', AGE: '06838', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4354', FULLNAME: 'MANCHO MABEL ZE', CODE_GES: '156', AGE: '06845', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4367', FULLNAME: 'TCHINGA NGOUNONJI AHMED', CODE_GES: '203', AGE: '06868', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4372', FULLNAME: 'ZONO NOA NTSAMA', CODE_GES: '206', AGE: '06869', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4426', FULLNAME: 'TACING CAREL DUVAL', CODE_GES: '242', AGE: '06810', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3478', FULLNAME: 'FOUMANE CYPRIEN', CODE_GES: '', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3532', FULLNAME: 'AHMATOUKOUR YOUNOUSSA', CODE_GES: '602', AGE: '06870', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3706', FULLNAME: 'KOUANGA ISSAGUE LISETTE', CODE_GES: '267', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3771', FULLNAME: 'MIMBANG LAURE', CODE_GES: '291', AGE: '06864', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3788', FULLNAME: 'NDAH GISELE EPSE BELINGA', CODE_GES: '179', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '93405447' },
            { AGE_UTI: '3824', FULLNAME: 'AYISSI AFIAVI ANTOINETTE', CODE_GES: '293', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4093', FULLNAME: 'FOKOU FOTSING PAUL BRICE', CODE_GES: '111', AGE: '06805', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3205', FULLNAME: 'MOHAMED IYA MAIRI', CODE_GES: '570', AGE: '06870', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3332', FULLNAME: 'BITEKE JOSEPH RENE', CODE_GES: '535', AGE: '06835', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3622', FULLNAME: 'NTERE OKALA OMER THIERRY', CODE_GES: '136', AGE: '06800', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '3632', FULLNAME: 'TCHOUNGUI EMMANUEL FRANCIS', CODE_GES: '117', AGE: '06860', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '0712', FULLNAME: 'MEDIE MAKOUGANG HEDWIGE ARIELL', CODE_GES: '002', AGE: '06815', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447'},
            { AGE_UTI: '3996', FULLNAME: 'TEGHEN FOH MICHAEL', CODE_GES: '002', AGE: '06802', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4353', FULLNAME: 'MAHOUE SOKAMTE Jeanne Ornella', CODE_GES: '002', AGE: '06802', EMAIL: 'achille.tachum@londo-tech.com', TEL: '693405447' },
            { AGE_UTI: '4489', FULLNAME: 'MEDIE MAKOUGANG hedwige ariel', CODE_GES: '002', AGE: '06802', EMAIL: 'achille.tachum@londo-tech.com', TEL: '93405447' },
        ];
        return Promise.resolve(bankAccountManager);
    }

};
