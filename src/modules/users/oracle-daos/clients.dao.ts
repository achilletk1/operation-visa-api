import { executeQuery } from "common/oracle-daos/config";
import { helper } from "../helper/clients.dao.helper";
import { isProdOrStag } from "common/helpers";
import { logger } from "winston-config";

const classPath = 'oracle-daos.clients';


export const clientsDAO = {

    getClientDatasByNcp: async (ncp: any, age?: string, clc?: string) => {
    
        const methodPath = `${classPath}.getClientDatasByNcp()`;
        try {
            logger.info(`init get client data by ncp: ${ncp}`);

            if (!isProdOrStag) { return await helper.getMockClientDatas(ncp); }

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
        } catch (error:any) {
            logger.error(`Failed to client data by ncp ${ncp}, age: ${age || ''}, clc: ${clc || ''}`, { error, stack: error.stack, methodPath });
            throw error;
        }
    }
}