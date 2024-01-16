import { removeReservedAgency, sortAgencies, traillingWhiteSpaces } from "common/helpers";
import { config } from "convict-config";
import fetch from 'node-fetch';

const cbsApiUrl = `${config.get('cbsApiUrl')}/api/v1`;

export async function getCbsUserVariables() {
    const response = await fetch(`${cbsApiUrl}/clients/variables/system`);
    return await response.json();
}

export async function getBankList() {
    const response = await fetch(`${config.get('cbsApiUrl')}/api/v1/agencies`);
    const bankList = await response.json();
    if (!bankList) { throw new Error('Bank account list is empty'); }
    return bankList;
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

export const getAGEListByBankCode = (countryCode: string, bankCode: string, bankList: any) => {
    try {
        // Removes the leading and trailing white space and line terminator characters from fields.
        traillingWhiteSpaces(bankList);
        // Filter bank list bay contry code selected and exclude TRESOR, BEAC from list
        bankList = removeReservedAgency(bankList, countryCode);
        // Groupping bank Agnecies by bank code.
        const conterCodeList = [];
        for (const bankElmt of bankList) {
            if (bankElmt.CODE_BANQUE === bankCode) {
                conterCodeList.push({ CODE_AGENCE: bankElmt.CODE_AGENCE, NOM_AGENCE: bankElmt.NOM_AGENCE })
            }
        }
        return sortAgencies(conterCodeList);
    } catch (error) {
        throw error;
    }

}
