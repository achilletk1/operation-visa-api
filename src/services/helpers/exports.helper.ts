import * as readFilePromise from 'fs-readfile-promise';
import * as handlebars from 'handlebars';
import { User } from "../../models/user";
import * as http from 'request-promise';
import { logger } from "../../winston";
import { config } from '../../config';
import * as moment from "moment";
import * as XLSX from 'xlsx';
import { get } from 'lodash';

let templateRIBExportPDF: any;
let templateAmortizationTablePDF: any;
let templateRequestCheckbookPdf: any;
let templateRequestCardPdf: any;
let templateInvoicePDF: any;
let templateExportTransactionPDF: any;
let templateRequestCeilingNotifPdf: any;
let templateRequestCeilingNotifAssignPdf: any;
let templateRequestCeilingPdf: any;

(async () => {
    // templateRIBExportPDF = await readFilePromise(__dirname + '/templates/rib-export-pdf.template.html', 'utf8');
    // templateAmortizationTablePDF = await readFilePromise(__dirname + '/templates/amortization-table-export-pdf.template.html', 'utf8');
    // templateRequestCheckbookPdf = await readFilePromise(__dirname + '/templates/request-checkbook.Pdf.template.html', 'utf8');
    // templateRequestCardPdf = await readFilePromise(__dirname + '/templates/request-card.Pdf.template.html', 'utf8');
    // templateInvoicePDF = await readFilePromise(__dirname + '/templates/invoice-pdf.template.html', 'utf8');
    // templateExportTransactionPDF = await readFilePromise(__dirname + '/templates/export-transaction.pdf.template.html', 'utf8');
    // templateRequestCeilingNotifAssignPdf = await readFilePromise(__dirname + '/templates/ceiling-notif-assign.pdf.template.html', 'utf8');
    // templateRequestCeilingNotifPdf = await readFilePromise(__dirname + '/templates/ceiling-notif.pdf.template.html', 'utf8');
    // templateRequestCeilingPdf = await readFilePromise(__dirname + '/templates/request-ceiling.pdf.template.html', 'utf8');

})();

export const generatePdfRIBExport = async (data: any, user: User) => {
    try {
        const temlateData = getTemplateRIBExportData(data, user);

        const template = handlebars.compile(templateRIBExportPDF);

        const html = template(temlateData);

        // const options: any = {
        //     format: 'A4',
        //     printBackground: true,
        //     landscape: true
        // }

        const options = {
            method: 'POST',
            uri: `${config.get('pdfApiUrl')}/api/v1/generatePdf`,
            body: { html },
            json: true
        }

        return await http(options);
    } catch (error) {
        logger.error(`\npdf RIB export generation failed ${JSON.stringify(error)}`);
        return error;
    }
};

const getTemplateRIBExportData = (data: any, user: User) => {
    data = data[0];
    const _data: any = {};
    _data.export_date = moment().format('DD/MM/YYYY');
    _data.account_owner = `${get(user, 'lname')} ${get(user, 'fname')}`;
    _data.account_age = `${get(data, 'AGE')}`;
    _data.account_ncp = `${get(data, 'NCP')}`;
    _data.account_rib_key = `${get(data, 'CLC', '')}`;
    _data.account_inti = `${get(data, 'INTI', '')}`;
    _data.account_clientCode = `${get(user, 'clientCode', '')}`
    return _data;
};

export const generateTransactionExportPdf = async (user: any, account: any, transactions: any, start: any, end: any, balanceData: any) => {

    try {
        const data = getTemplateTransactionPdfData(user, account, transactions, start, end, balanceData);

        const template = handlebars.compile(templateExportTransactionPDF);

        const html = template(data);

        // const options: any = {
        //     format: 'A4',
        //     printBackground: true,
        //     landscape: true
        // }

        const options = {
            method: 'POST',
            uri: `${config.get('pdfApiUrl')}/api/v1/generatePdf`,
            body: { html },
            json: true
        }

        return await http(options);
    } catch (error) {
        logger.error(
            'pdf export pdf generation failed.',
            'services.helper.transactions.generateTransactionExportPdf()',
            error
        );
        return error;
    }
}

const getTemplateTransactionPdfData = (user: User, account: any, transactions: any, start: any, end: any, balanceData: any) => {
    const data: any = {};
    // Add dates range data
    data.range_start = start;
    data.range_end = end;
    // Add export date
    data.export_date = moment().format('DD/MM/YYYY');

    // Add user data
    data.company_name = `${user.lname} ${user.fname}`;
    data.company_client_code = `${user.clientCode}`;

    data.company_account_rib = `30013 ${account.AGE} ${account.NCP} ${account.CLC}`;
    data.company_account_inti = `${account.INTI}`;
    data.company_account_iban_code = `CG39 30013 ${account.AGE} ${account.NCP} ${account.CLC}`;

    // Add transactions rows items
    data.transations = [];
    data.balanceData = `${balanceData}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    let balance = balanceData;
    let totalDebit = 0;
    let totalCredit = 0;
    let transactionCredit: any = 0;
    let transactionDebit: any = 0;

    const { result } = transactions;
    if (result) {
        result.forEach((transaction) => {
            const operationDate = `${get(transaction, 'DATE_OPERATION')}`.split('T')[0];
            const valueDate = `${get(transaction, 'DATE_VALEUR')}`.split('T')[0];

            if (`${get(transaction, 'SENS')}` === `C`) {
                transactionCredit = +get(transaction, 'MONTANT_OPERATION', '');
                balance += transactionCredit;
                totalCredit += transactionCredit;
                transactionDebit = null;
            }
            if (`${get(transaction, 'SENS')}` === `D`) {
                transactionDebit = +get(transaction, 'MONTANT_OPERATION', '');
                balance -= transactionDebit;
                totalDebit += transactionDebit;
                transactionCredit = null;
            }
            data.transations.push({
                transaction_account: `${get(transaction, 'COMPTE')}`,
                transaction_date: `${moment(operationDate).format('DD/MM/YYYY')}`,
                transaction_hour: `${moment(get(transaction, 'DATE_OPERATION'), 'DD/MM/YY').format('HH:mm')}`,
                transaction_desc: `${get(transaction, 'LIBELLE_OPERATION')}`,
                transaction_sens: (`${get(transaction, 'SENS')}` === `C`) ? 'CREDIT' : 'DEBIT',
                transaction_dva: `${moment(valueDate).format('DD/MM/YYYY')}`,
                transaction_credit: (transactionCredit === null) ? '' : `${transactionCredit}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
                transaction_debit: (transactionDebit === null) ? '' : `${transactionDebit}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
                transaction_balance: `${balance}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
            });

        });

        data.total_credit = `${totalCredit}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        data.total_debit = `${totalDebit}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        data.solde = `${balance}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }

    return data;
};

export const generateTransactionExportXlsx = (transactions) => {

    // if (typeof XLSX === 'undefined') import * as XLSX from 'xlsx';

    const { result } = transactions;

    // Format Excel file columns headers;
    if (result) {
        const excelData = result.map(transaction => {
            const excelInvoice = {};
            excelInvoice['COMPTE '] = `${get(transaction, 'COMPTE')}`;
            excelInvoice['DATE '] = `${moment(get(transaction, 'DATE_OPERATION')).format('DD/MM/YYYY')}`;
            excelInvoice['MONTANT (XAF)'] = `${getNumberWithSpaces(get(transaction, 'MONTANT_OPERATION'))}`;
            excelInvoice['OPÉRATION '] = `${get(transaction, 'SENS')}` === `C` ? 'CREDIT' : 'DEBIT';
            excelInvoice['DATE DE VALEUR '] = `${moment(get(transaction, 'DATE_VALEUR')).format('DD/MM/YYYY')}`;
            excelInvoice['LIBELÉ '] = `${get(transaction, 'LIBELLE_OPERATION')}`;
            return excelInvoice;
        });

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();

        // Set Excel file columns width;
        ws['!cols'] = [{ wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 35 }];

        XLSX.utils.book_append_sheet(wb, ws, `export_${new Date().getTime()}`);
        return XLSX.write(wb, { type: 'base64' });
    }

}

const getNumberWithSpaces = (x) => {
    if (!x) { return '0' }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
