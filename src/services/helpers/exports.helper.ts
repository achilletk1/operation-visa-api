import readFilePromise from 'fs-readfile-promise';
import { pdf } from '../pdf-generator.service';
import { Letter } from './../../models/letter';
import { User } from '../../models/user';
import { logger } from "../../winston";
import handlebars from 'handlebars';
import { get } from 'lodash';
import moment from "moment";
import XLSX from 'xlsx';

let templateFormalNoticeLetter: any;
let templateExportNotification: any;
let templateFormalNoticeMail:any ; 
(async () => {
    templateFormalNoticeLetter = await readFilePromise(__dirname + '/templates/formal-notice-letter.template.html', 'utf8');
    templateExportNotification = await readFilePromise(__dirname + '/templates/export-notification.pdf.template.html', 'utf8');
    templateFormalNoticeMail = await readFilePromise(__dirname + '/templates/formal-notice-template-mail.template.html', 'utf8');
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
        data.range_start = moment().subtract(6, 'M').format('DD/MM/YYYY');
    }

    if (!end) {
        data.range_end = moment().format('DD/MM/YYYY');
    }

    // Add export date
    data.export_date = moment().format('DD/MM/YYYY');

    data.notifications = notifications.map(elt => {
        console.log("elt", elt)
        const dataStatus = { 100: 'CRÉÉE', 200: 'ENVOYÉE', 300: 'REÇU', 400: 'LU' };
        const dataFormat = { 100: 'SMS', 200: 'MAIL' };

        return {
            notification_send_date: elt.dates.sentAt ? moment(elt.dates.sentAt).format('DD/MM/YYYY') : 'N/A',
            notification_received_date: elt.dates.receivedAt ? moment(elt.dates.receivedAt).format('DD/MM/YYYY') : 'N/A',
            notification_read_at: elt.dates.readAt ? moment(elt.dates.readAt).format('DD/MM/YYYY') : 'N/A',
            notification_status: dataStatus[elt.status],
            notification_format: dataFormat[elt.format],
            notification_contact: elt.format == 100 ? elt.tel : elt.email,
            notification_message: elt.message,
        }
    })

    return data;
};


export const generateFormalNoticeLetter = async (content: any, userData: any, signature: string, isTest?: boolean) => {
    try {
        const values = {
            ...userData,
            'SYSTEM_TODAY_LONG': moment().locale('fr'),
            'SYSTEM_TODAY_SHORT': moment().format('dd/MM/YYYY'),
        }
        const data = replaceVariables(content, values, isTest);

        const templateData = generateTemplateFormalNoticeLetter(data, signature);

        const template = handlebars.compile(templateFormalNoticeLetter);

        const html = template(templateData);

        return await pdf.setAttachment(html);
    } catch (error) {
        logger.error(`\npdf RIB export generation failed ${JSON.stringify(error)}`);
        return error;
    }
};

export const generateFormalNoticeMail = async (content: any, userData: any,  isTest?: boolean) => {
    try {
        const values = {
            ...userData,
            'SYSTEM_TODAY_LONG': moment().locale('fr'),
            'SYSTEM_TODAY_SHORT': moment().format('dd/MM/YYYY'),
        }
        const data = replaceVariables(content, values, isTest);

        const temlateData = generateTemplateFormalNoticeMail(data);

        const template = handlebars.compile(templateFormalNoticeMail);

        const html = template(temlateData);
       /* const options = {
            method: 'POST',
            uri: `${config.get('pdfApiUrl')}/api/v1/generatePdf`,
            body: { html },
            json: true
        }*/
        return html;
    } catch (error) {
        logger.error(`\nPreview  template mail  generation failed ${JSON.stringify(error)}`);
        return error;
    }
};

const replaceVariables = (content: any, values: any, isTest?: boolean) => {
    const obj = {};
    for (const key in content) {
        if (!content.hasOwnProperty(key)) { break; }
        obj[key] = formatContent(content[key], values, isTest);
    }
    return obj;
}

export const formatContent = (str: string, values: any, isTest?: boolean) => {
    if (!str) { return '' }

    if (isTest) {
        str = str.split(`{{`).join(`[`);
        str = str.split(`}}`).join(`]`);
        return str;
    }
    for (const key of values) {
        if (str.includes(`{{${key}}}`)) {
            str = str.split(`{{${key}}}`).join(`${values[key]}`);
        }
    }

    return str;
}

const generateTemplateFormalNoticeLetter = (letter: Letter, signature: string) => {

    const reg = '//'

    const data = {
        letterRef: get(letter, 'letterRef', ''),
        headLeftText: goToTheLine(`${get(letter, 'headLeftText', '')}`, reg),
        headRightText: goToTheLine(`${get(letter, 'headRightText', '')}`, reg),
        introductionTexT: goToTheLine(`${get(letter, 'introductionTexT', '')}`, reg),
        salutationText: goToTheLine(`${get(letter, 'salutationText', '')}`, reg),
        objectText: get(letter, 'objectText', ''),
        bodyText: goToTheLine(`${get(letter, 'bodyText', '')}`, reg),
        conclusionText: goToTheLine(`${get(letter, 'conclusionText', '')}`, reg),
        footerText: goToTheLine(`${get(letter, 'footerText', '')}`, reg),
        signatureText: get(letter, 'signatureText', ''),
        signature
    }

    return data;
};

const generateTemplateFormalNoticeMail = (content: any) => {
    const reg = '//';
    const data = {
        objectText: get(content, 'object', ''),
        bodyText: goToTheLine(`${get(content, 'content', '')}`, reg)
    }

    return data;
};


const goToTheLine = (str: string, reg: string) => {
    return str.split(reg);
}

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
        100: 'INITIÉE',
        200: 'CONFIRMÉE',
        300: 'ECHEC',
        400: 'EN ATTENTE',
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
        100: 'INITIÉE',
        200: 'CONFIRMÉE',
        300: 'ECHEC',
        400: 'EN ATTENTE',
    };

    const type = {
        100: 'SHORT_TERM_TRAVEL ',
        200: 'LONG_TERM_TRAVEL ',
    };
    // Format Excel file columns headers;
    if (result) {
        const excelData = [];
        excelData.push(['Reférence', 'Code client', 'Nom du client', 'Date départ', 'Date retour', 'Nbre opérations', 'Total(XAF)', 'Dépassement', 'Statut', 'travel type']);

        result.forEach(async (travel) => {
            const elt = [
                `${travel?.travelRef || ''}`,
                `${travel?.user?.clientCode || ''}`,
                `${travel?.user?.fullName || ''}`,
                `${moment(travel?.proofTravel?.dates?.start).format('DD/MM/YYYY')}`,
                `${moment(travel?.proofTravel?.dates?.end).format('DD/MM/YYYY')}`,
                `${travel?.transactions?.length || ''}`,
                `${travel?.transactions?.amount || ''}`,
                `${travel?.ceiling || ''}`,
                `${status[travel?.status]}`,
                `${type[travel?.travelType]}`,
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


