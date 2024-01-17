import { removeReservedAgency, sortAgencies, trailingWhiteSpaces } from "common/helpers";
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

export const getAGEListByBankCode = (countryCode: string, bankCode: string, bankList: any) => {
    try {
        // Removes the leading and trailing white space and line terminator characters from fields.
        trailingWhiteSpaces(bankList);
        // Filter bank list bay country code selected and exclude TRESOR, BEAC from list
        bankList = removeReservedAgency(bankList, countryCode);
        // Grouping bank Agencies by bank code.
        const counterCodeList = [];
        for (const bankElt of bankList) {
            if (bankElt.CODE_BANQUE === bankCode) {
                counterCodeList.push({ CODE_AGENCE: bankElt.CODE_AGENCE, NOM_AGENCE: bankElt.NOM_AGENCE })
            }
        }
        return sortAgencies(counterCodeList);
    } catch (error) { throw error; }

}
