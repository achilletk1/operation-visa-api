import { getExpenseCategoryLabel, getOperationTypeLabel, getStatuslabel } from 'common/utils';
import { ExpenseDetail, OthersAttachement, Travel, TravelType } from 'modules/travel';
import { OnlinePaymentStatement } from 'modules/online-payment';
import { OpeVisaStatus } from 'modules/visa-operations';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import XLSX from 'xlsx';

export function generateVisaTransactionExportXlsx(transactions: any[]) {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `export_${new Date().getTime()}`);
    return XLSX.write(wb, { type: 'base64' });
};

export function generateOnlinePaymentExportXlsx(onlinePayment: any[]) {
    let result = onlinePayment;

    const status: any = {
        100: 'A COMPLETER',
        101: 'NON RENSEGNE',
        200: 'JUSTIFIE',
        300: 'REJETÉ',
        400: 'A VALIDER',
        500: 'HORS DELAIS',
        600: 'CLÔTURE',
        700: 'CH DE VALIDATION'
    }
    // Format Excel file columns headers;
    if (result) {
        const excelData = [];
        excelData.push(['Date création', 'Code client', 'Client', 'Total', 'status']);

        // if (!(result instanceof Array)) { result = [...onlinePayment]; }

        result.forEach(async (payment) => {
            const elt = [
                `${moment(payment?.dates?.created).format('DD/MM/YYYY')}`,
                `${payment.user.clientCode || ''}`,
                `${payment.user.fullName || ''}`,
                `${payment.amounts || ''}`,
                `${status[payment?.status]}`,
            ];
            excelData.push(elt);
        });

        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();

        // Set Excel file columns width;
        ws['!cols'] = [];
        for (const iterator of excelData[0]) {
            ws['!cols'].push({ wch: 28 })
        }
        XLSX.utils.book_append_sheet(wb, ws, `onlinePayment_${new Date().getTime()}`);
        return XLSX.write(wb, { type: 'array', bookSST: true, compression: true });
    }
};

export function generateOnlineOperationsExportXlsx(onlineOperations: any) {
    let result = onlineOperations;
    let transactions;
    // Format Excel file columns headers;
    if (Object.keys(result).length) {
        const excelData = [];
        excelData.push(['Date opération', 'Pays', 'Type de carte', 'Bénéficiaire', 'Montant (XAF)']);

        if ('transactions' in result) {
            transactions = result.transactions;
            // console.log(JSON.stringify(transactions, null, 2))
        }

        // if (!(result instanceof Array)) { result = [...onlinetransactions]; }

        if (Array.isArray(transactions)) {

            transactions.forEach(async (transaction) => {
                const row = [
                    `${typeof transaction?.date === 'string' ? transaction?.date : moment(transaction?.date).format('DD/MM/YYYY HH:mm:ss')}`,
                    `${transaction?.country || ''}`,
                    `${transaction?.card.label || ''}`,
                    `${transaction?.beneficiary || ''}`,
                    `${transaction?.amount || ''}`,
                ];
                excelData.push(row);
            });
        }

        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();

        // Set Excel file columns width;
        ws['!cols'] = [];
        for (const iterator of excelData[0]) {
            ws['!cols'].push({ wch: 28 })
        }
        XLSX.utils.book_append_sheet(wb, ws, `onlineOperations_${new Date().getTime()}`);
        return XLSX.write(wb, { type: 'array', bookSST: true, compression: true });
    }
};

export function generateCeillingExportXlsx(onlinePaymentCeilling: any) {
    let result = onlinePaymentCeilling;
    let transactions;
    // Format Excel file columns headers;
    if (Object.keys(result).length) {
        const excelData = [];
        excelData.push(['Date opération', 'Montant (XAF)', 'Pays', 'Carte', 'Bénéficiaire', 'Type Operation']);

        if ('transactions' in result) {
            transactions = result.transactions;
            console.log(JSON.stringify(transactions, null, 2))
        }

        if (Array.isArray(transactions)) {
            transactions.forEach(async (transaction) => {
                const row = [
                    `${moment(transaction?.date).format('DD/MM/YYYY')}`,
                    `${transaction?.amount || ''}`,
                    `${transaction?.country || ''}`,
                    `${transaction?.card?.code || ''}`,
                    `${transaction?.beneficiary || ''}`,
                    `${transaction?.type || ''}`,
                ];
                excelData.push(row);
            });
        }
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();

        // Set Excel file columns width;
        ws['!cols'] = [];
        for (const iterator of excelData[0]) {
            ws['!cols'].push({ wch: 23 })
        }
        XLSX.utils.book_append_sheet(wb, ws, `ceilling_${new Date().getTime()}`);
        return XLSX.write(wb, { type: 'array', bookSST: true, compression: true });
    }
};

export function generateTravelsExportXlsx(travel: Travel[]) {
    let result = travel;

    const status = {
        100: 'A COMPLETER',
        101: 'NON RENSEGNE',
        200: 'JUSTIFIE',
        300: 'REJETÉ',
        400: 'A VALIDER',
        500: 'HORS DELAIS',
        600: 'CLÔTURE',
        700: 'CH DE VALIDATION'
    };

    const type = {
        100: 'COURTE DUREE ',
        200: 'LONGUE DUREE ',
    };

    const isProofTravel = {
        'true': 'Oui',
        'false': 'Non',
    };
    // Format Excel file columns headers;
    if (result) {
        const excelData = [];
        excelData.push(['Reférence', 'Code client', 'Nom du client', 'Email', 'Téléphone', 'Reférence du voyage',
            'Date départ', 'Date retour', 'Nbre opérations', 'Total(XAF)', 'Plafond', 'Dépassement', 'Statut',
            'Type de voyage', 'Continent(s)', 'Pays(s)', 'Raison', 'Status preuve de voyage', 'Ticket de transport',
            'Visa', 'Tempon entrée', 'Tempon de sortie', 'Status état des dépenses']);

        result.forEach(async (travel) => {
            const elt = [
                `${travel?.travelRef || ''}`,
                `${travel?.user?.clientCode || ''}`,
                `${travel?.user?.fullName || ''}`,
                `${travel?.user?.email || ''}`,
                `${travel?.user?.tel || ''}`,
                `${travel?.travelRef || ''}`,
                `${moment(travel?.proofTravel?.dates?.start).format('DD/MM/YYYY')}`,
                `${moment(travel?.proofTravel?.dates?.end).format('DD/MM/YYYY')}`,
                `${travel?.transactions?.length || ''}`,
                `${getTransactionsAmount(travel?.transactions) || ''}`,
                `${travel?.ceiling || ''}`,
                `${getEccedCeilling(travel) || ''}`,
                `${status[travel?.status as OpeVisaStatus] || ''}`,
                `${type[travel?.travelType as TravelType] || ''}`,
                // `${(travel?.proofTravel?.continents).toString() || ''}`,
                // `${ (travel?.proofTravel?.countries).map(countrie => countrie?.name).toString()  || ''}`,
                `${travel?.proofTravel?.travelReason?.label || ''}`,
                `${status[travel?.proofTravel?.status  as OpeVisaStatus] || ''}`,
                `${travel?.proofTravel?.isTransportTicket ? 'Oui' : 'Non' }`,
                `${travel?.proofTravel?.isVisa ? 'Oui' : 'Non'}`,
                `${travel?.proofTravel?.isPassIn ? 'Oui' : 'Non'}`,
                `${travel?.proofTravel?.isPassOut ? 'Oui' : 'Non'}`,
                `${OpeVisaStatus[travel?.expenseDetailsStatus] || ''}`,
            ];
            excelData.push(elt);
        });

        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();

        // Set Excel file columns width;
        ws['!cols'] = [];
        for (const iterator of excelData[0]) {
            ws['!cols'].push({ wch: 23 })
        }
        XLSX.utils.book_append_sheet(wb, ws, `travel_${new Date().getTime()}`);
        return XLSX.write(wb, { type: 'array', bookSST: true, compression: true });
    }
};

export const generateExpenseDetailsExportXlsx = async (result: ExpenseDetail[] | OthersAttachement[] | OnlinePaymentStatement[], type: 'expenseDetails' | 'othersAttachements' | 'onlinePayment') => {

    const excelDataHeader:any = ['Référence', 'Date Achat/Dépense', 'Libellé/Obejet Dépense', 'Statut', 'Montant',];

    const additonalHeader:any = {
        expenseDetails: ['Devise', 'Type', 'Catégorie'],
        othersAttachements: ['Devise', 'Type'],
        onlinePayment: ['Commentaire', 'Nature'],
    };

    excelDataHeader.push(...additonalHeader[type]);

    excelDataHeader.push('Nombre de document importés');
    // Format Excel file columns headers;import { OperationType } from 'modules/visa-operations';

    if (Object.keys(result).length) {
        const excelData:any = [];
        excelData.push(excelDataHeader);

        const rows = result.map((elt: ExpenseDetail | OthersAttachement | OnlinePaymentStatement) => {

            const row:any = [
                `${get(elt, 'ref') || get(elt, 'statementRef') || ''}`,
                `${moment(elt?.date).format('DD/MM/YYYY')}`,
                `${get(elt, 'label') || get(elt, 'object') || ''}`,
                `${getStatuslabel(elt?.status || '') || ''}`,
                `${elt?.amount || ''}`,
            ];

            const additonalRow = {
                expenseDetails: [`${getCurrencies(get(elt, 'currency', { code: [] })) || ''}`, `${getOperationTypeLabel(get(elt, 'type', ''))}`, `${getExpenseCategoryLabel(get(elt, 'expenceCategory.label', ''))}`],
                othersAttachements: [`${getCurrencies(get(elt, 'currency', { code: [] })) || ''}`, `${getOperationTypeLabel(get(elt, 'type', ''))}`],
                onlinePayment: [`${get(elt, 'comment') || ''}`, `${get(elt, 'nature.label') || ''}`],
            };

            row.push(...additonalRow[type]);
            row.push(`${elt?.attachments?.length || 0}`);
            return row;
        });
        excelData.push(...rows);

        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();

        // Set Excel file columns width;
        ws['!cols'] = [];
        for (const iterator of excelData[0]) {
            ws['!cols'].push({ wch: 23 })
        }
        XLSX.utils.book_append_sheet(wb, ws, `ceilling_${new Date().getTime()}`);
        return XLSX.write(wb, { type: 'array', bookSST: true, compression: true });
    }
};

const getCurrencies = (currency: { code: any[] }) => {
    if (isEmpty(currency.code)) { return ''; }
    if (typeof currency.code === 'string') { return currency.code }

    return (currency?.code || [])?.reduce((previous, current) => current + ', ' + previous);
}

const getEccedCeilling = (travel: any) => {
    let total = getTransactionsAmount(travel.transactions);
    return (total - travel.ceiling) > 0 ? (total - travel.ceiling) : 0;
};

const getTransactionsAmount = (transactions: any) => {
    let total = 0;
    if (!isEmpty(transactions))
        for (const transaction of transactions) total = total + transaction.amount;
    return total
};
