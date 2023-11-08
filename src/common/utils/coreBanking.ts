import { config } from "convict-config";
import fetch from 'node-fetch';

const cbsApiUrl = `${config.get('cbsApiUrl')}/api/v1`;

export async function getCbsUserVariables() {
    const response = await fetch(`${cbsApiUrl}/clients/variables/system`);
    return await response.json();
}

export async function getUserDataByCode(code: string, includeAccounts?: any, isChaFilter?: boolean) {
    try {
        const response = await fetch(`${cbsApiUrl}/clients/${code}`, { headers: { include_accounts: String(includeAccounts) } });
        const userData = await response.json();
        return filterAccountsByChar(userData, Boolean(isChaFilter));
    } catch (error) { throw error; }
}

const filterAccountsByChar = (userData: any, isChaFilter: boolean) => {
    if (isChaFilter === true)
        userData.accounts = userData?.accounts.filter((elt: any) => ['371', '372'].includes(elt?.CHA.slice(0, 3)));
    return userData;
};
