import { VisaTransactionsTmp } from "modules/visa-operations/visa-transactions-tmp";
import { VisaTransactionsController } from "modules/visa-transactions";

export function verifyTransactionFileTypeContent(dataArray: VisaTransactionsTmp[]) {
    let arrayIndex;
    const found = dataArray.find((element, index) => {
        arrayIndex = index;
        return !['PAIEMENT TPE', 'RETRAIT DAB', 'PAIEMENT INTERNET'].includes(element['TYPE_TRANS']);
    });
    if (!found) { return null; }
    return { found, arrayIndex };
};

export function verifyTransactionFileContent(dataArray: VisaTransactionsTmp[], fileName: string) {
    const month = fileName.split('_')[3].slice(0, 6);
    return dataArray.findIndex(element => {
        let currentMonths = `${element['DATE']}`.split('/');
        // currentMonth.shift();
        const currentMonth = [currentMonths[2]?.trim() || '', currentMonths[1]?.trim() || ''].join('');
        return month !== currentMonth;
    });
};

export function verifyTransactionFileDataContent(dataArray: VisaTransactionsTmp[]): { column?: string; line?: string; type?: string; } {
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

export function verifyTransactionNotEmptyFile(dataArray: VisaTransactionsTmp[]) {
    return dataArray.length > 0;
};

export function verifyTransactionFileName(fileName: string) {
    fileName = fileName.toLowerCase();
    const data = fileName.split('_');
    return data[0] === 'bicec' && data[1] === 'hors' && data[2] === 'cemac' && /20\d{2}(0[ 1-9 ]|1[ 0-2 ])+/.test(data[3]);
};

export function verifyTransactionFile(dataArray: VisaTransactionsTmp[]) {
    
    const header = Object.keys(dataArray.find(e => Object.keys(e).length === columnTitles.length) || dataArray[0]);

    const containsAll = columnTitles.find(element => !header.includes(element));

    return containsAll;
};

export async function verifyTransactionFileDuplicateData(dataArray: VisaTransactionsTmp[]) {
    
    const matchs: string[] = []; const indexes: number[] = [];
    dataArray.forEach(e => matchs.push(''.concat(e.CLIENT, e.MONTANT_XAF, e.DEVISE, e.DATE, e.HEURE, e.TYPE_TRANS, e.CARTE, e.PAYS)));

    const visaTransactions = (await VisaTransactionsController.visaTransactionsService.findAll({ filter: { match: { $in: matchs } } }))?.data;
    visaTransactions.forEach(visaTransaction => indexes.push(matchs.findIndex(e => e === visaTransaction?.match) + 2));

    return indexes;
};

export const fileCheckSumColumn = [
    'CLIENT',
    'MONTANT_XAF',
    'DEVISE',
    'DATE',
    'HEURE',
    'TYPE_TRANS',
    'CARTE',
    'PAYS',
];

export const columnTitles =
        [
            'AGENCE',
            'COMPTE',
            'CHAPITRE',
            'CLIENT',
            'NOM_CLIENT',
            'CODE_GESTIONNAIRE',
            'NOM_GESTIONNAIRE',
            'CODE_LANGUE_CLIENT',
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
