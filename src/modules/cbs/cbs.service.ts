import { isDev, removeSpacesFromResultSet, timeout } from "common/helpers";
import { UserCategory, UsersController } from "modules";
import { clientsDAO } from "./oracle-daos";
import { config } from "convict-config";
import { logger } from "winston-config";
import { get, isEmpty } from "lodash";
import { BaseService } from "common";

export class CbsService extends BaseService {

    options: any = { method: '', uri: ``, json: true, timeout: `${config.get('timeout')}`, qs: null };
    classPath = 'services.cbsService';

    constructor() { super() }

    async getUserDataByCode(code: any, scope: 'back-office' | 'front-office' = 'front-office', includeAccounts: boolean = false) {
        if (isDev) { await timeout(500); }

        try {
            let client = await clientsDAO.getClientDataByCli(code, scope);

            if (!client || client?.length === 0) { throw new Error('ClientNotFound'); }

            if (client && client instanceof Array) {
                client = removeSpacesFromResultSet(get(client, `[0]`, null));
            }

            let accounts: any;

            if ([true, 'true'].includes(includeAccounts)) {
                accounts = await clientsDAO.getClientAccounts(code);
            }

            return { client, accounts };
        } catch (error: any) {
            logger.error(`Failed to get client data by cli ${code}. \n${error.stack}`);
            throw error;
        }
    }

    // TODO get user all informations
    async getUserCbsDatasByNcp(ncp: any, age?: string | null, clc?: string | null, scope: 'client' | 'all' | null = null) {
        try {
            if (isDev) { await timeout(500); }

            let clients = await clientsDAO.getClientDatasByNcp(ncp, age, clc);

            if (isEmpty(clients) || !(clients instanceof Array)) { throw new Error('ClientNotFound'); }

            clients = clients.map((elt: any) => removeSpacesFromResultSet(elt));

            if (scope === 'client') { return clients; }

            let i = 0;
            for (const client of clients) {
                const accounts = await clientsDAO.getClientAccounts(client?.CLI);
                if (accounts && accounts instanceof Array) {
                    clients[i].accounts = accounts.map((elt: any) => removeSpacesFromResultSet(elt));
                    i++
                }
            }

            if (clients.length === 1) {
                const createData = { clientCode: clients[0].CLI, enabled: true, category: UserCategory.DEFAULT };
                await UsersController.usersService.createUser(createData, 'front-office');
            }

            return clients;
        } catch (error: any) {
            logger.error(`Unable to get user datas from core banking by account: ${age || 'age'}-${ncp}-${clc || 'clc'} \n${error.stack}`);
            throw error;
        }
    }

    async getUserCbsAccountsDatas(datas: any) {
        if (isDev) { await timeout(500); }

        const { code, includeAccounts, isChaFilter } = datas;

        try {

            let client = await clientsDAO.getClientAccountDataByCli(code);

            if (!client || client?.length === 0) { throw new Error('ClientNotFound'); }

            if (client && client instanceof Array) {
                client = removeSpacesFromResultSet(get(client, `[0]`, null));
            }

            let accounts: any;
            if ([true, 'true'].includes(includeAccounts)) { accounts = await clientsDAO.getClientAccounts(code) };
            if ([true, 'true'].includes(isChaFilter)) { accounts = accounts.filter((elt: any) => ['371', '372'].includes(elt?.CHA.slice(0, 3))); }
            if (!accounts || accounts?.length === 0) { throw new Error('AccountNotFound'); }

            return { client, accounts };
        } catch (error: any) {
            logger.error(`Failed to get client data by cli ${code}. \n${error.stack}`);
            throw error;
        }
    }

}