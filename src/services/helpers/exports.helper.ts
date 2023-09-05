import readFilePromise from 'fs-readfile-promise';
import { pdf } from '../pdf-generator.service';
import { User } from '../../models/user';
import { logger } from "../../winston";
import { config } from '../../config';
import handlebars from 'handlebars';
import { get, isEmpty } from 'lodash';
import moment from "moment";
import XLSX from 'xlsx';
import { Transaction } from 'mongodb';

let templateFormalNoticeLetter: any;
let templateExportNotification: any;
let templateFormalNoticeMail: any;
let templateContainBlockedUserPdf: any;

const actionUrl = ``;
const image = `${config.get('template.image')}`;
const color = `${config.get('template.color')}`;


(async () => {
    templateFormalNoticeLetter = await readFilePromise(__dirname + '/templates/formal-notice-letter.template.html', 'utf8');
    templateExportNotification = await readFilePromise(__dirname + '/templates/export-notification.pdf.template.html', 'utf8');
    templateFormalNoticeMail = await readFilePromise(__dirname + '/templates/formal-notice-mail.template.html', 'utf8');
    templateContainBlockedUserPdf = await readFilePromise(__dirname + '/templates/contain-blocked-users.pdf.template.html', 'utf8');
})();

export const generateNotificationExportPdf = async (user: any, notification: any, start: any, end: any) => {

    try {
        const data = getTemplateNotificationPdfData(user, notification, start, end);

        const template = handlebars.compile(templateExportNotification);

        const html = template(data);
        return await pdf.setAttachment(html);
    } catch (error) {
        logger.error(
            'pdf export pdf generation failed.',
            'services.helper.notification.templateExportNotification()',
            error
        );
        return error;
    }
}

const getTemplateNotificationPdfData = (user: User, notifications: any, start: any, end: any) => {

    const data: any = {};
    data.range_start = start;
    data.range_end = end;
    //var message

    if (!start) {
        data.range_start = moment().startOf('month').format('DD/MM/YYYY');
    }

    if (!end) {
        data.range_end = moment().endOf('month').format('DD/MM/YYYY');
    }

    // Add export date
    data.export_date = moment().format('DD/MM/YYYY');

    const dataStatus = { 100: 'CRÉÉE', 200: 'ENVOYÉE', 300: 'REÇU', 400: 'LUE' };
    const dataFormat = { 100: 'SMS', 200: 'MAIL' };

    data.notifications = notifications.map(elt => {
        return {
            notification_send_date: elt?.dates?.sentAt ? moment(elt?.dates?.sentAt).format('DD/MM/YYYY') : 'N/A',
            notification_received_date: elt.dates.receivedAt ? moment(elt?.dates?.receivedAt).format('DD/MM/YYYY') : 'N/A',
            notification_read_at: elt?.dates?.readAt ? moment(elt?.dates?.readAt).format('DD/MM/YYYY') : 'N/A',
            notification_status: dataStatus[elt?.status] || 'CRÉÉE',
            notification_format: dataFormat[elt?.format] || 'N/A',
            notification_contact: elt?.format == 100 ? elt?.tel : elt?.email,
            notification_message: elt?.message,
        }
    })

    return data;
};


export const generateFormalNoticeLetter = async (data: any) => {
    try {


        const template = handlebars.compile(templateFormalNoticeLetter);

        const html = template(data);

        return await pdf.setAttachment(html);
    } catch (error) {
        logger.error(`\npdf notice letter generator failed ${JSON.stringify(error)}`);
        return error;
    }
};

export const generateFormalNoticeMail = async (data: any) => {
    try {
        // const template = handlebars.compile(templateFormalNoticeMail);
        const template = handlebars.compile(templateFormalNoticeLetter);

        const html = template(data);
        return html;
    } catch (error) {
        logger.error(`\nPreview  template mail  generation failed ${JSON.stringify(error)}`);
        return error;
    }
};




export const generateTransactionExportXlsx = (transactions) => {

    // if (typeof XLSX === 'undefined') import  XLSX from 'xlsx';

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

export const generateOnlinePaymentExportXlsx = async (onlinePayment: any[]) => {

    let result = onlinePayment;

    const status = {
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
}

export const generateOnlineOperationsExportXlsx = async (onlineOperations: any[]) => {

    let result = onlineOperations;
    let transactions;
    // Format Excel file columns headers;
    if (Object.keys(result).length) {
        const excelData = [];
        excelData.push(['Date opération', 'Pays', 'Type de carte', 'Bénéficiaire', 'Montant (XAF)']);

        if ('transactions' in result) {
            transactions = result.transactions;
            console.log(JSON.stringify(transactions, null, 2))
        }

        // if (!(result instanceof Array)) { result = [...onlinetransactions]; }

        if (Array.isArray(transactions)) {

            transactions.forEach(async (transaction) => {
                const row = [
                    `${moment(transaction?.date).format('DD/MM/YYYY')}`,
                    `${transaction?.country || ''}`,
                    `${transaction?.card.label || ''}`,
                    `${transaction?.user?.fullName || ''}`,
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
}

export const generateTravelsExportXlsx = async (onlinePayment: any[]) => {

    let result = onlinePayment;

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
                `${status[travel?.status]}`,
                `${type[travel?.travelType]}`,
                `${(travel?.proofTravel?.continents).toString() || ''}`,
                `${ (travel?.proofTravel?.countries).map(countrie => countrie?.name).toString()  || ''}`,
                `${travel?.proofTravel?.travelReason?.label || ''}`,
                `${status[travel?.proofTravel?.status] || ''}`,
                `${isProofTravel[travel?.proofTravel?.isTransportTicket] || ''}`,
                `${isProofTravel[travel?.proofTravel?.isVisa] || ''}`,
                `${isProofTravel[travel?.proofTravel?.isPassIn] || ''}`,
                `${isProofTravel[travel?.proofTravel?.isPassOut] || ''}`,
                `${isProofTravel[travel?.expenseDetailsStatus] || ''}`,
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
}


export const generateCeillingExportXlsx = async (onlinePaymentCeilling: any[]) => {

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
}

export const generatePdfContainBlockedUser = async (usersLocked: any) => {

    try {
        const data = getTemplateContainBlockedUserPdf(usersLocked);

        const template = handlebars.compile(templateContainBlockedUserPdf);

        const html = template(data);

        return await pdf.setAttachment(html);

    } catch (error) {
        logger.error(`pdf activation trasnfer generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }
}

const getTemplateContainBlockedUserPdf = (data: any) => {
    const _data: any = {};
    _data.image = image;
    _data.color = color;
    _data.date = moment().format('DD/MM/YYYY');
    _data.transactions = [];

    // Add client data
    data.forEach(elt =>
        _data.transactions.push(
            {
                fullName: `${get(elt, 'fullName')}`,
                clientCode: `${get(elt, 'clientCode')}`,
                card: `${get(elt, 'card.code')}`,
                tel: `${get(elt, 'tel', 'N/A')}`,
                email: `${get(elt, 'email', 'N/A')}`,
                label: `${get(elt, 'card.label')}`,
                holder: `${get(elt, 'card.name')}`,
                age: `${get(elt, 'age')}`,
                ncp: `${get(elt, 'ncp')}`,
            }
        )
    )

    return _data;
};

const getNumberWithSpaces = (x) => {
    if (!x) { return '0' }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const generateVisaTransactionExportXlsx = (transactions: any[]) => {

    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `export_${new Date().getTime()}`);
    return XLSX.write(wb, { type: 'base64' });


}

const getTransactionsAmount = (transactions: any) => {
    let total = 0;
    if (!isEmpty(transactions)) {
        for (const transaction of transactions) {
            total = total + transaction.amount
        }
    }
    return total
}

const getEccedCeilling = (travel: any) => {
    let total = getTransactionsAmount(travel.transactions);
    return (total - travel.ceiling) > 0 ? (total - travel.ceiling) : 0;
}

