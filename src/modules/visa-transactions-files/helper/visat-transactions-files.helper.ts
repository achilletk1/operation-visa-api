import { isEmpty } from "lodash";


export function verifyTransactionFileTypeContent(dataArray: any) {
    let arrayIndex;
    const found = dataArray.find((element: any, index: number) => {
        arrayIndex = index;
        return !['PAIEMENT TPE', 'RETRAIT DAB', 'PAIEMENT INTERNET'].includes(element['TYPE_TRANS']);
    });
    if (!found) { return null; }
    return { found, arrayIndex };
};

export function verifyTransactionFileContent(dataArray: any[], fileName: string) {
    const month = fileName.split('_')[3];
    return dataArray.findIndex((element) => {
        let currentMonths = `${element['DATE']}`.split('/');
        // currentMonth.shift();
        const currentMonth = [currentMonths[2]?.trim() || '', currentMonths[1]?.trim() || ''].join('');
        return month !== currentMonth;
    });
};

export function verifyTransactionFileDataContent(dataArray: any[]): { column?: string; line?: string; type?: string; } {
    let i = 2;
    for (let element of dataArray) {
        if (!element['CLIENT']) { return { column: 'CLIENT', line: i.toString(), type: element['TYPE_TRANS'] }; }
        if (!element['CARTE']) { return { column: 'CARTE', line: i.toString(), type: element['TYPE_TRANS'] }; }
        if (!element['DATE']) { return { column: 'DATE', line: i.toString(), type: element['TYPE_TRANS'] }; }
        if (!element['MONTANT_XAF']) { return { column: 'MONTANT_XAF', line: i.toString(), type: element['TYPE_TRANS'] }; }
        i++;
    }
    return {};
};

export function verifyTransactionNotEmptyFile(dataArray: any[]) {
    return dataArray.length > 0;
};

export function verifyTransactionFileName(fileName: string) {
    fileName = fileName.toLowerCase();
    const data = fileName.split('_');
    return data[0] === 'bicec' && data[1] === 'hors' && data[2] === 'cemac' && /20\d{2}(0[ 1-9 ]|1[ 0-2 ])$/.test(data[3]);
};

export const verifyTransactionFile = (dataArray: any[]) => {
    
    const header = Object.keys(dataArray.find(e => Object.keys(e).length === columnTitles.length) || dataArray[0]);

    const containsAll = columnTitles.find(element => !header.includes(element));

    return containsAll;
};

export const columnTitles =
        [
            'AGENCE',
            'COMPTE',
            'CHAPITRE',
            'CLIENT',
            'NOM_CLIENT',
            'CODE_GESTIONNAIRE',
            'NOM_GESTIONNAIRE',
            'TELEPHONE_CLIENT',
            'EMAIL_CLIENT',
            'NOM_CARTE',
            'CARTE',
            'PRODUIT',
            'DATE',
            'HEURE',
            'MONTANT',
            'DEVISE',
            'MONTANT_COMPENS',
            'DEVISE_COMPENS',
            'MONTANT_XAF',
            'TYPE_TRANS',
            'CATEGORIE',
            'PAYS',
            'ACQUEREUR',
        ];
        // [
        //     'DATE',
        //     'HEURE',
        //     'CLIENT',
        //     'COMPTE',
        //     'NOM DETENTEUR',
        //     'CARTE',
        //     'PRODUIT',
        //     'NATURE',
        //     'MONTANT_TRANS',
        //     'DEVISE_TRANS',
        //     'MONTANT_COMPENS',
        //     'EUR',
        //     'MONTANT_XAF',
        //     'COURS_CHANGE',
        //     'COMMISSION',
        //     'BENEFICIAIRE',
        //     'PAYS',
        //     'CATEGORIE',
        // ];
