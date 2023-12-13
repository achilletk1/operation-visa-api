import { isDev, removeSpacesFromResultSet, timeout } from "common/helpers";
import { clientsDAO } from "./oracle-daos";
import { config } from "convict-config";
import { logger } from "winston-config";
import { BaseService } from "common";
import { get } from "lodash";

export class CbsService extends BaseService {

    options: any = { method: '', uri: ``, json: true, timeout: `${config.get('timeout')}`, qs: null };
    classPath = 'services.cbsService';

    constructor() { super() }

    async getUserDataByCode(code: any) {
        if (isDev) { await timeout(500); }

        try {
            let client = await clientsDAO.getClientDataByCli(code);

            if (!client || client?.length === 0) { throw new Error('ClientNotFound'); }

            if (client && client instanceof Array) {
                client = removeSpacesFromResultSet(get(client, `[0]`, null));
            }

            return client;
        } catch (error: any) {
            logger.error(`Failed to get client data by cli ${code}. \n${error.stack}`);
            throw error;
        }
    }

    // TODO get user all informations
    async getUserCbsDatasByNcp(ncp: any, age?: string | null, clc?: string | null, scope: 'client' | 'all' | null = null) {
        try {
            if (isDev) { await timeout(500); }

            const client = await clientsDAO.getClientDatasByNcp(ncp, age, clc);
            if (scope === 'client') { return client; }

            if (client?.length === 0) { throw new Error('ClientNotFound'); }

            const result = removeSpacesFromResultSet(client[0]);

            let accounts = await clientsDAO.getClientAccountsWithBalance(result?.CLI);

            if (accounts && accounts instanceof Array) {
                accounts = accounts.map((dat: any) => removeSpacesFromResultSet(dat));
            }
            const { SOLDE } = accounts.find((e: any) => e.ncp === ncp) || {};

            const PHONES = await clientsDAO.getClientsTels([result?.CLI]);
            const EMAILS = await clientsDAO.getClientsEmails([result?.CLI]);

            const { CLI, IDTYPE, CIVILITY, IDNUM, POB, DOB, ADDRESS, NOM, PRE, AGE, NCP, CLC, INTI, CHA } = result;
            const response: any = {};
            if (CLI) { response.clientCode = CLI.toLowerCase(); }
            if (IDTYPE) { response.idType = IDTYPE.toLowerCase(); }
            if (CIVILITY) { response.civility = CIVILITY.toLowerCase(); }
            if (IDNUM) { response.idnum = IDNUM.toLowerCase(); }
            if (POB) { response.pob = POB.toLowerCase(); }
            if (DOB) { response.dob = DOB.split('/'); }
            if (ADDRESS) { response.address = ADDRESS.toLowerCase(); }
            if (NOM) { response.lname = NOM.toLowerCase(); }
            if (PRE) { response.fname = PRE.toLowerCase(); }
            if (AGE) { response.age = AGE.toLowerCase(); }
            if (NCP) { response.ncp = NCP.toLowerCase(); }
            if (CLC) { response.clc = CLC.toLowerCase(); }
            if (INTI) { response.inti = CLC.toLowerCase(); }
            if (CHA) { response.cha = CHA.toLowerCase(); }
            if (SOLDE) { response.balance = +SOLDE; }
            if (PHONES && PHONES[0]) { response.phone = PHONES[0].NUM; }
            if (EMAILS && EMAILS[0]) { response.email = EMAILS[0].EMAIL; }

            return response;
        } catch (error: any) {
            logger.error(`Unable to get user datas from core banking by account: ${age || 'age'}-${ncp}-${clc || 'clc'} \n${error.stack}`);
            throw error;
        }
    }

}