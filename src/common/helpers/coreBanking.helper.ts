
export const removeReservedAgency = (bankList: any[], agencyCode: string) => {
    bankList = bankList.filter(bank => bank.PAYS === agencyCode
        && bank.CODE_BANQUE !== '12000'
        && bank.CODE_BANQUE !== '12001'
        && bank.CODE_BANQUE !== '32000'
        && bank.CODE_BANQUE !== '42000'
        && bank.CODE_BANQUE !== '42001'
        && bank.CODE_BANQUE !== '94000'
        && bank.CODE_BANQUE !== '94001'
        && bank.CODE_BANQUE !== '95001'
    );
    return bankList;
}

export const trailingWhiteSpaces = (bankList: any[]): void => {
    bankList.forEach(bank => {
        bank.LIB_PAYS = bank.LIB_PAYS.trim();
        bank.CODE_BANQUE = bank.CODE_BANQUE.trim();
        bank.NOM_BANQUE = `${bank.NOM_BANQUE.trim()}`.toLocaleUpperCase();
        bank.CODE_AGENCE = bank.CODE_AGENCE.trim();
        bank.NOM_AGENCE = `${bank.NOM_AGENCE.trim()}`.toLocaleUpperCase();
        return bank;
    });
}

export function sortAgencies(agencies: any[]): any[] {
    return agencies.sort((a, b) => (a.code > b.code) ? 1 : (a.code === b.code) ? ((a.label > b.label) ? 1 : -1) : -1);
}