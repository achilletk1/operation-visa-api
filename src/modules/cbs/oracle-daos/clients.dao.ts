import { executeQuery } from "common/oracle-daos/config";
import { isDevOrStag } from "common/helpers";
import { logger } from 'winston-config';
import { helper } from "./helpers";

const classPath = 'oracle-daos.clients';

export const clientsDAO = {

    getClientDataByCli: async (cli: any, scope: 'back-office' | 'front-office') => {
        const methodPath = `${classPath}.getClientDataByCli()`;
        try {

            logger.info(`init get client data by cli: ${cli}`, { methodPath });

            if (isDevOrStag) { return await helper.getMockClientData(cli); }

            const query = (scope === 'front-office')
                ? ` select
                        trim(p.nomrest), trim(p.nom), trim(p.pre), p.nid, p.vid, p.sext, p.age, p.lang, p.cli,
                        (select trim(b.nom) from infoc.bkbqe b where b.etab = '10001' and b.guib = p.age and rownum = 1) "libelle_agence",
                        (select c.num from bktelcli c where c.cli = p.cli and c.typ = (SELECT MAX(b.typ) FROM infoc.bktelcli b WHERE p.cli = b.cli) and rownum = 1) tel,
                        (select c.email from bkemacli c where c.cli = p.cli and c.typ = (SELECT MAX(b.typ) FROM infoc.bkemacli b WHERE p.cli = b.cli) and rownum = 1) email
                    from infoc.bkcli p
                    where p.cli = '${cli}'`
                : ` select
                        trim(p.nomrest), trim(p.nom), trim(p.pre), p.nid, p.vid, p.sext, p.age, p.lang, p.cli,
                        a.ges,
                        a.cge as "code_gestionnaire",
                        a.puti as "code_profil",
                        a.cuti as "code_utilisateur",
                        trim(a.lib) as "noms_complet",
                        (select trim(c.lib1) from infoc.bknom c where c.ctab = '994' and c.cacc = a.puti) "libelle_du_profil",
                        (select trim(b.nom) from infoc.bkbqe b where b.etab = '10001' and b.guib = a.age and rownum = 1) "libelle_agence",
                        (select c.num from bktelcli c where c.cli = p.cli and c.typ = (SELECT MAX(b.typ) FROM infoc.bktelcli b WHERE p.cli = b.cli) and rownum = 1) tel,
                        (select c.email from bkemacli c where c.cli = p.cli and c.typ = (SELECT MAX(b.typ) FROM infoc.bkemacli b WHERE p.cli = b.cli) and rownum = 1) email
                    from infoc.bkcli p, evuti a
                    where p.cli = '${cli}' and a.sus='N' and p.cli = a.cli`;

            const result = await executeQuery(query);

            return result;
        } catch (error: any) {
            logger.error(`Failed to get client data by cli ${cli}`, { error, stack: error.stack, methodPath });
            throw error;
        }
    },

    getClientAccountsWithBalance: async (cli: any) => {
        const methodPath = `${classPath}.getClientAccountsWithBalance()`;
        try {
            logger.info(`init get client accounts with balance cli: ${cli}`, { methodPath });

            if (isDevOrStag) { return helper.getMockClientAccounts(cli); }

            // const query = (config.get('env') !== 'staging-cbs') ?
            //     `select ncp, inti, age, sde, infoc.getsolde(ncp, age, dev, clc) as "SOLDE", clc from infoc.bkcom where cha in ('371100', '371300', '372100', '372120', '372200', '373000', '373200') and cfe = 'N' and ife = 'N' and cli = '${cli}'` :
            //     `select ncp, inti, age, sde, sin as "SOLDE", clc from infoc.bkcom where cha in ('371100', '371300', '372100', '372120', '372200', '373000', '373200')  and cfe = 'N' and ife = 'N' and cli = '${cli}'`;

            const query =
                `select
                    p.ncp, p.inti, p.age, p.dev, p.cha, p.clc, 
                    (select lib2 from infoc.bknom where infoc.bknom.ctab = '005' and infoc.bknom.cacc = p.dev) currency
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

    getClientDatasByNcp: async (ncp: any, age?: string | null, clc?: string | null) => {
        const methodPath = `${classPath}.getClientDatasByNcp()`;
        try {
            logger.info(`init get client data by ncp: ${ncp}`);

            if (isDevOrStag) { return await helper.getMockClientDatas(ncp); }

            // TODO change request sql to get client all informations by ncp
            let query =
                `
            select
                b.cli, b.ncp, b.age, b.clc, a.age, a.nom, a.pre, a.nomrest, a.sext, a.nat CIVILITY, t1.num TEL, t2.email EMAIL, b.inti,
                TO_CHAR(a.dna, 'DD/MM/YYYY') DOB, a.viln POB, a.depn departement_naissance, a.payn pays_naissance, b.cha,
                a.tid IDTYPE, a.nid IDNUM, a.did date_delivrance_PI, a.vid date_validite_PI, a.lid lieu_delivrance_PI, a.oid organisme_delivrance_PI
            from infoc.bkcli a
            left join (SELECT a.cli, a.ncp, a.age, a.clc, a.inti, a.cha FROM infoc.bkcom a WHERE a.ncp = '${ncp}' and rownum = 1) b on a.cli = b.cli
            left join (SELECT a.cli, a.num FROM infoc.bktelcli a WHERE rownum = 1) t1 on b.cli = t1.cli
            left join (SELECT a.cli, a.email FROM infoc.bkemacli a WHERE rownum = 1) t2 on b.cli = t2.cli
            where a.cli = b.cli`;
            if (age && clc) {
                query =
                    `
            select
                b.cli, b.ncp, b.age, b.clc, a.age, a.nom, a.pre, a.nomrest, a.sext, a.nat CIVILITY, t1.num TEL, t2.email EMAIL, b.inti, b.cha,
                TO_CHAR(a.dna, 'DD/MM/YYYY') DOB, a.viln POB, a.depn departement_naissance, a.payn pays_naissance,
                a.tid IDTYPE, a.nid IDNUM, a.did date_delivrance_PI, a.vid date_validite_PI, a.lid lieu_delivrance_PI, a.oid organisme_delivrance_PI
            from infoc.bkcli a
            left join (SELECT a.cli, a.ncp, a.age, a.clc, a.inti , a.cha FROM infoc.bkcom a WHERE a.ncp = '${ncp}' and a.age = '${age}' and a.clc = '${clc}' and rownum = 1) b on a.cli = b.cli
            left join (SELECT a.cli, a.num FROM infoc.bktelcli a WHERE rownum = 1) t1 on b.cli = t1.cli
            left join (SELECT a.cli, a.email FROM infoc.bkemacli a WHERE rownum = 1) t2 on b.cli = t2.cli
            where a.cli = b.cli`;
            }

            const result = await executeQuery(query);

            return result;
        } catch (error: any) {
            logger.error(`Failed to client data by ncp ${ncp}, age: ${age || ''}, clc: ${clc || ''}`, { error, stack: error.stack, methodPath });
            throw error;
        }
    },

    getClientsTels: async (clientCodes: string[]) => {
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

    getClientsEmails: async (clientCodes: string[]) => {
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

};