import { removeReservedAgency, sortAgencies, trailingWhiteSpaces } from "common/helpers";

export function getCbsUserVariables(): string[] {
    const variables = [
        'NOMREST', 'NOM', 'PRE', 'NRC', 'NIDF', 'AGE', 'NCP', 'CLC', 'CLI', 'CIVILITY', 'DOB', 'POB', 'DEPARTEMENT_NAISSANCE',
        'PAYS_NAISSANCE', 'IDTYPE', 'IDNUM', 'DATE_DELIVRANCE_PIECE_IDENTITE', 'DATE_VALIDITE_PIECE_IDENTITE',
        'LIEU_DELIVRANCE_PIECE_IDENTITE', 'ORGANISME_DELIVRANCE_PIECE_IDENTITE', 'CHA'
    ];
    return variables;
}

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
