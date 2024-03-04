import { CbsAccounts, CbsBankAccountManager, CbsBankUser, CbsCard, CbsClientUser, CbsEmail, CbsPhone, CbsProduct } from "../model";
import { executeQuery } from "common/oracle-daos/config";
import { isDevOrStag } from "common/helpers";
import { logger } from 'winston-config';
import { helper } from "./helpers";

const classPath = 'oracle-daos.clients';

export const clientsDAO = {

    getClientDataByCli: async (cli: any, scope: 'back-office' | 'front-office' = 'front-office'): Promise<(CbsClientUser | CbsBankUser)[]> => {
        const methodPath = `${classPath}.getClientDataByCli()`;
        try {

            logger.info(`init get client data by cli: ${cli}`, { methodPath });

            if (isDevOrStag) { return await helper.getMockClientData(cli); }

            const query = (scope === 'front-office')
                ? ` select
                        trim(p.nomrest) nomrest, trim(p.nom) nom, trim(p.pre) pre, p.nid, p.vid, p.sext, p.age, p.lang, p.cli, p.ges,
                        (select trim(b.nom) from infoc.bkbqe b where b.etab = '10001' and b.guib = p.age and rownum = 1) libelle_agence,
                        (select c.num from infoc.bktelcli c where c.cli = p.cli and c.typ = (SELECT MAX(b.typ) FROM infoc.bktelcli b WHERE p.cli = b.cli) and rownum = 1) tel,
                        (select c.email from infoc.bkemacli c where c.cli = p.cli and c.typ = (SELECT MAX(b.typ) FROM infoc.bkemacli b WHERE p.cli = b.cli) and rownum = 1) email
                    from infoc.bkcli p
                    where p.cli = '${cli}'`
                : ` select
                        trim(p.nomrest) nomrest, trim(p.nom) nom, trim(p.pre) pre, p.nid, p.vid, p.sext, p.age, p.lang, p.cli,
                        a.ges, p.ges as ges_code,
                        a.cge as code_gestionnaire,
                        a.puti as code_profil,
                        a.cuti as code_utilisateur,
                        trim(a.lib) as noms_complet,
                        (select trim(c.lib1) from infoc.bknom c where c.ctab = '994' and c.cacc = a.puti) libelle_profil,
                        (select trim(b.nom) from infoc.bkbqe b where b.etab = '10001' and b.guib = a.age and rownum = 1) libelle_agence,
                        (select c.num from infoc.bktelcli c where c.cli = p.cli and c.typ = (SELECT MAX(b.typ) FROM infoc.bktelcli b WHERE p.cli = b.cli) and rownum = 1) tel,
                        (select c.email from infoc.bkemacli c where c.cli = p.cli and c.typ = (SELECT MAX(b.typ) FROM infoc.bkemacli b WHERE p.cli = b.cli) and rownum = 1) email
                    from infoc.bkcli p, evuti a
                    where p.cli = '${cli}' and a.sus='N' and p.cli = a.cli`;

            const result = await executeQuery(query);

            return result;
        } catch (error: any) {
            logger.error(`Failed to get client data by cli ${cli}`, { error, stack: error.stack, methodPath });
            throw error;
        }
    },

    getClientAccounts: async (cli: any): Promise<CbsAccounts[]> => {
        const methodPath = `${classPath}.getClientAccountsWithBalance()`;
        try {
            logger.info(`init get client accounts with balance cli: ${cli}`, { methodPath });

            if (isDevOrStag) { return await helper.getMockClientAccounts(cli); }

            // const query = (config.get('env') !== 'staging-cbs') ?
            //     `select ncp, inti, age, sde, infoc.getsolde(ncp, age, dev, clc) as "SOLDE", clc from infoc.bkcom where cha in ('371100', '371300', '372100', '372120', '372200', '373000', '373200') and cfe = 'N' and ife = 'N' and cli = '${cli}'` :
            //     `select ncp, inti, age, sde, sin as "SOLDE", clc from infoc.bkcom where cha in ('371100', '371300', '372100', '372120', '372200', '373000', '373200')  and cfe = 'N' and ife = 'N' and cli = '${cli}'`;

            const query =
                `select
                    p.ncp, p.inti, p.age, p.dev, p.cha, p.clc, 
                    (select lib2 from infoc.bknom where infoc.bknom.ctab = '005' and infoc.bknom.cacc = p.dev) currency,
                    (select trim(b.nom) from infoc.bkbqe b where b.etab = '10001' and b.guib = p.age and rownum = 1) lib_age
                from infoc.bkcom p
                where p.cha in ('371100', '371300', '372100', '372120', '372200', '373000', '373200') and p.cfe = 'N' and p.ife = 'N' and p.cli = '${cli}'`
            // :
            //     `select ncp, inti, age, sde, sin + infoc.getmaut(ncp, age, dev, clc) as "SOLDE", clc, (select lib2 from infoc.bknom where infoc.bknom.ctab = '005' and infoc.bknom.cacc = infoc.bkcom.dev) currency from infoc.bkcom where cha in ('371100', '371300', '372100', '372120', '372200', '373000', '373200')  and cfe = 'N' and ife = 'N' and cli = '${cli}'`;

            const result = await executeQuery(query);

            return result;
        } catch (error: any) {
            logger.error(`Failed to get account balance by cli ${cli}`, { error, stack: error.stack, methodPath });
            throw error;
        }
    },

    getClientDatasByNcp: async (ncp: any, age?: string | null, clc?: string | null): Promise<CbsClientUser[]> => {
        const methodPath = `${classPath}.getClientDatasByNcp()`;
        try {
            logger.info(`init get client data by ncp: ${ncp}`);

            if (isDevOrStag) { return await helper.getMockClientDatas(ncp); }

            // TODO change request sql to get client all informations by ncp
            let query =
                `
                select
                    trim(p.nomrest) nomrest, trim(p.nom) nom, trim(p.pre) pre, p.nid, p.vid, p.sext, p.age, p.lang, p.cli,
                    (select trim(b.nom) from infoc.bkbqe b where b.etab = '10001' and b.guib = p.age and rownum = 1) libelle_agence,
                    (select c.num from bktelcli c where c.cli = p.cli and c.typ = (SELECT MAX(b.typ) FROM infoc.bktelcli b WHERE p.cli = b.cli) and rownum = 1) tel,
                    (select c.email from bkemacli c where c.cli = p.cli and c.typ = (SELECT MAX(b.typ) FROM infoc.bkemacli b WHERE p.cli = b.cli) and rownum = 1) email
                from infoc.bkcli p, infoc.bkcom a
                where p.cli = a.cli and a.cfe = 'N' and a.ife = 'N' and substr(a.cha,1,3) in ('371','372','373') and a.cha not like '37%99%' and a.ncp = '${ncp}' ${(age && clc) ? `and a.age = ${age} and a.clc = ${clc}` : ''}`;

            const result = await executeQuery(query);

            return result;
        } catch (error: any) {
            logger.error(`Failed to client data by ncp ${ncp}, age: ${age || ''}, clc: ${clc || ''}`, { error, stack: error.stack, methodPath });
            throw error;
        }
    },

    getClientsTels: async (clientCodes: string[]): Promise<CbsPhone[]> => {
        const methodPath = `${classPath}.getClientsTels()`;

        try {
            logger.info(`init get client phones by clientCodes`, { methodPath });
            if (isDevOrStag) { return await helper.getMockClientsTels(clientCodes); }

            let reduced = clientCodes.reduce((e, a) => e = `'${a}', ${e}`, '');
            reduced = reduced.slice(0, reduced.length - 2);

            const query = `
            SELECT a.cli, a.typ, a.num,c.nomrest
            FROM infoc.bktelcli a, infoc.bkcli c WHERE a.typ = (SELECT MAX(b.typ) FROM infoc.bktelcli b WHERE a.cli = b.cli) and a.cli in (${reduced}) and a.cli = c.cli`;

            const result = await executeQuery(query);

            return result;
        } catch (error: any) {
            logger.error(`Failed to get client phone by cli ${clientCodes[0]}`, { error, stack: error.stack, methodPath });
            throw error;
        }
    },

    getClientsEmails: async (clientCodes: string[]): Promise<CbsEmail[]> => {
        const methodPath = `${classPath}.getClientsEmails()`;

        try {
            logger.info(`init get client emails by clientCodes`, { methodPath });
            if (isDevOrStag) { return await helper.getMoackClientsEmails(clientCodes); }

            let reduced = clientCodes.reduce((e, a) => e = `'${a}', ${e}`, '');
            reduced = reduced.slice(0, reduced.length - 2);
            const query = `
            SELECT a.cli, a.typ, a.email, c.nomrest
            FROM infoc.bkemacli a, infoc.bkcli c
            WHERE a.typ = (SELECT MAX(b.typ) FROM infoc.bkemacli b WHERE a.cli = b.cli) and a.cli in  (${reduced}) and a.cli = c.cli `;

            const result = await executeQuery(query);

            return result;
        } catch (error: any) {
            logger.error(`Failed to get client email by cli ${clientCodes[0]}`, { error, stack: error.stack, methodPath });
            throw error;
        }
    },

    getClientCardsByCli: async (cli: string): Promise<CbsCard[]> => {
        const methodPath = `${classPath}.getClientCardsByCli()`;

        logger.info(`init get client cards matching cli: ${cli}`, { methodPath });

        if (isDevOrStag) { return await helper.getMockClientCards(); }

        const query = `
        select
            b.age,
            a.cpro,
            b.ncp num_cpte,
            b.cli code_client,
            a.dfv date_fin_validite,
            (select nomrest from infoc.bkcli d where b.cli=d.cli) nomrest,
            (select c.lib from infoc.motycart c where c.type = b.typ) libelle_type,
            concat(substr(b.ncart,1,6), concat('******',substr(b.ncart,13,4))) num_carte,
            (select c.inti from infoc.bkcom c where c.age = b.age and c.ncp = b.ncp and c.dev = b.dev) intitule_cmpte
        from infoc.bkcadab a, infoc.moctr b
        where
            a.ncart = b.ncart and
            a.ncpbc = b.ncp and
            a.nctr = b.nctr and
            a.age = b.age and
            a.eta = '07' and
            b.sit = 'C' and
            b.cli = '${cli}'
        `;

        const result = await executeQuery(query);

        return result;
    },

    getProductData: async (code: string): Promise<(CbsProduct | undefined)[]> => {
        const methodPath = `${classPath}.getProductData()`;

        logger.info(`init get product data matching cpro: ${code}`, { methodPath });

        if (isDevOrStag) { return await helper.getMockProductData(code); }

        const query = `select a.cpro, a.lib from infoc.bkprod a where a.cpro = '${code}'`;

        const result = await executeQuery(query);

        return result;
    },

    getBankAccountManager: async (): Promise<CbsBankAccountManager[]> => {
        try {
            const methodPath = `${classPath}.getBankAccountManager()`;

            logger.info(`init get all bank-account-manager to refresh local data`, { methodPath });

            if (isDevOrStag) { return await helper.getMockBankAccountManagerData(); }

            const query = `
                select a.puti profil_uti, b.lib1 lib_profil_puti, a.cuti code_uti, a.lib as fullname, a.cge code_ges, a.age, a.cli
                from evuti a , bknom b
                wherea.sus='N' and b.ctab=994 and a.puti=b.cacc and a.cge IS NOT NULL
                order by a.puti, a.cuti`;
            // and a.puti in ('R204', 'R206', 'R208', 'R211', 'R215', 'R217', 'R219', 'R220')

            const result: CbsBankAccountManager[] = await executeQuery(query);

            return result;
        } catch (error) { throw error; }
    }

};