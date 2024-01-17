import { isDev, removeSpacesFromResultSet, timeout } from "common/helpers";
import { CbsAccounts, CbsBankUser, CbsCard, CbsClientUser, CbsProduct } from "./model";
import { clientsDAO, banksDAO } from "./oracle-daos";
import { config } from "convict-config";
import { CbsBankBranch } from './model';
import { get, isEmpty } from "lodash";
import { BaseService } from "common";

export class CbsService extends BaseService {

    options: any = { method: '', uri: ``, json: true, timeout: `${config.get('timeout')}`, qs: null };
    classPath = 'services.cbsService';

    constructor() { super() }

    async getUserDataByCode(code: any, scope: 'back-office' | 'front-office' = 'front-office'): Promise<{ client: CbsClientUser | CbsBankUser | undefined; accounts: CbsAccounts[]; }> {
        if (isDev) { await timeout(500); }

        try {
            let client: CbsBankUser | CbsClientUser | undefined = undefined;
            const clients = await clientsDAO.getClientDataByCli(code, scope);

            if (isEmpty(clients) || clients?.length === 0) { throw new Error('ClientNotFound'); }

            if (clients && clients instanceof Array) {
                client = removeSpacesFromResultSet(get(clients, `[0]`, null));
            }

            let accounts = await clientsDAO.getClientAccounts(code);
            accounts = accounts.map(e => removeSpacesFromResultSet(e));

            return { client, accounts };
        } catch (error: any) {
            this.logger.error(`Failed to get client data by cli ${code}. \n${error.stack}`);
            throw error;
        }
    }

    // TODO get user all informations
    async getUserCbsDatasByNcp(ncp: any, age?: string | null, clc?: string | null, scope: 'client' | 'all' | null = null): Promise<CbsClientUser[]> {
        try {
            if (isDev) { await timeout(500); }

            let clients = await clientsDAO.getClientDatasByNcp(ncp, age, clc);

            if (isEmpty(clients) || !(clients instanceof Array)) { throw new Error('ClientNotFound'); }

            clients = clients.map(elt => removeSpacesFromResultSet(elt));

            if (scope === 'client') { return clients; }

            let i = 0;
            for (const client of clients) {
                const accounts = await clientsDAO.getClientAccounts(client?.CLI);
                if (accounts && accounts instanceof Array) {
                    clients[i].accounts = accounts.map(elt => removeSpacesFromResultSet(elt));
                    i++
                }
            }

            return clients;
        } catch (error: any) {
            this.logger.error(`Unable to get user datas from core banking by account: ${age || 'age'}-${ncp}-${clc || 'clc'} \n${error.stack}`);
            throw error;
        }
    }

    async getUserCbsAccountsDatas(datas: any): Promise<{ client: (CbsBankUser | CbsClientUser)[], accounts: CbsAccounts[] } > {
        if (isDev) { await timeout(500); }

        const { code, includeAccounts, isChaFilter } = datas;

        try {
            let client = await clientsDAO.getClientDataByCli(code);

            if (!client || client?.length === 0) { throw new Error('ClientNotFound'); }

            if (client && client instanceof Array) {
                client = removeSpacesFromResultSet(get(client, `[0]`, null));
            }

            let accounts: CbsAccounts[] = [];
            if ([true, 'true'].includes(includeAccounts)) { accounts = await clientsDAO.getClientAccounts(code) };
            if ([true, 'true'].includes(isChaFilter)) { accounts = accounts.filter(elt => ['371', '372'].includes(elt?.CHA.slice(0, 3))); }
            if (!accounts || accounts?.length === 0) { throw new Error('AccountNotFound'); }

            return { client, accounts };
        } catch (error: any) {
            this.logger.error(`Failed to get client data by cli ${code}. \n${error.stack}`);
            throw error;
        }
    }

    async getClientCardsByCli(cli: string): Promise<CbsCard[]> {
        try {
            let data = await clientsDAO.getClientCardsByCli(cli);

            if (data instanceof Error) { throw data; }

            if (data && data instanceof Array) {
                data = data.map(dat => removeSpacesFromResultSet(dat));
            }

            return data;
        } catch (error: any) {
            this.logger.error(`Failed to get client cards by cli ${cli} \n${error.stack}`);
            throw error;
        }
    }

    async getCardsTypeByCode(productCode: string): Promise<CbsCard[]> {
        try {
            let data = await clientsDAO.getCardsTypeByCode(productCode);

            if (data instanceof Error) { throw data; }

            // if (data && data instanceof Array) {
            //     data = data.map(dat => removeSpacesFromResultSet(dat));
            // }

            return data;
        } catch (error: any) {
            this.logger.error(`Failed to get cardType by productCode ${productCode} \n${error.stack}`);
            throw error;
        }
    }

    async getProductData(code: string): Promise<(CbsProduct | undefined)[]> {
        try {
            let data = await clientsDAO.getProductData(code);

            if (data instanceof Error) { throw data; }

            if (data && data instanceof Array) {
                data = data.map(dat => removeSpacesFromResultSet(dat));
            }

            return data;
        } catch (error: any) {
            this.logger.error(`Failed to get product data by code ${code} \n${error.stack}`);
            throw error;
        }
    }

    async getBankList(): Promise<CbsBankBranch[]> {
        try {
            let data = await banksDAO.getBankList();

            if (data && data instanceof Array) {
                data = data.map(bankBranch => removeSpacesFromResultSet(bankBranch));
            }

            return data;
        } catch (error: any) {
            this.logger.error(`Failed to get bank list \n${error.stack}`);
            throw error;
        }
    }

}