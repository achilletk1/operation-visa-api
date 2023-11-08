import { pdf } from './pdf-generator.helper';
import { config } from 'convict-config';
import { User } from 'modules/users';
import handlebars from 'handlebars';
import { readFileSync } from 'fs';
import moment from "moment";
import { getStatuslabel } from 'common/utils';
import { getYearMonthLabel } from 'common/helpers';
import { OnlinePaymentMonth } from 'modules/online-payment';
import { Travel, TravelType } from 'modules/travel';
import { isEmpty } from 'lodash';

const image = `${config.get('template.image')}`;
const color = `${config.get('template.color')}`;

const templateFormalNoticeLetter = readFileSync(__dirname + '/templates/formal-notice-letter.template.html', 'utf8');
const templateExportNotification = readFileSync(__dirname + '/templates/export-notification.pdf.template.html', 'utf8');
// const templateFormalNoticeMail = readFileSync(__dirname + '/templates/formal-notice-mail.template.html', 'utf8');
const templateContainBlockedUserPdf = readFileSync(__dirname + '/templates/contain-blocked-users.pdf.template.html', 'utf8');
let templateTravelDeclarationRecapPdf = readFileSync(__dirname + '/templates/travel-declaration-recap.html', 'utf8');
let templateOnlinePaymentDeclarationRecapPdf = readFileSync(__dirname + '/templates/online-payment-declaration-recap.html', 'utf8');

export function getExtensionByContentType(contentType: string): string {
    const data: any = {
        'image/bmp': '.bmp',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/epub+zip': '.epub',
        'image/gif': '.gif',
        'image/jpeg': '.jpeg',
        'image/png': '.png',
        'application/pdf': '.pdf',
        'application/vnd.ms-powerpoint': '.ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
        'application/rtf': '.rtf',
        'application/vnd.rar': '.rar',
        'image/svg+xml': '.svg',
        'application/x-tar': '.tar',
        'image/tiff': '.tiff',
        'text/plain': '.txt',
        'application/vnd.visio': '.vsd',
        'application/vnd.ms-excel': '.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
        'application/xml': '.xml',
        'text/xml': '.xml',
        'application/atom+xml': '.xml',
        'application/zip': '.zip',
        'application/x-7z-compressed': '.7z',
    };

    return data[contentType];

};

export function getContentTypeByExtension(extension: string): string {
    const data: any = {
        '.bmp': 'image/bmp',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.epub': 'application/epub+zip',
        '.gif': 'image/gif',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.pdf': 'application/pdf',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.rtf': 'application/rtf',
        '.rar': 'application/vnd.rar',
        '.svg': 'image/svg+xml',
        '.tar': 'application/x-tar',
        '.tiff': 'image/tiff',
        '.txt': 'text/plain',
        '.vsd': 'application/vnd.visio',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xml': 'application/xml',
        '.zip': 'application/zip',
        '.7z': 'application/x-7z-compressed',
    };

    return data[extension];

};

export async function generateFormalNoticeLetter(data: any): Promise<string> {
    try {

        const template = handlebars.compile(templateFormalNoticeLetter);

        const html = template(data);

        return await pdf.setAttachment(html);
    } catch (error) { throw error; }
};

export async function generateNotificationExportPdf(user: any, notification: any, start: any, end: any): Promise<string> {
    try {
        const data = getTemplateNotificationPdfData(user, notification, start, end);

        const template = handlebars.compile(templateExportNotification);

        const html = template(data);
        return await pdf.setAttachment(html);
    } catch (error) { throw error; }
};

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

    const dataStatus: any = { 100: 'CRÉÉE', 200: 'ENVOYÉE', 300: 'REÇU', 400: 'LUE' };
    const dataFormat: any = { 100: 'SMS', 200: 'MAIL' };

    data.notifications = notifications.map((elt: any) => {
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

export const generatePdfContainBlockedUser = async (usersLocked: any[]) => {

    try {
        const data = getTemplateContainBlockedUserPdf(usersLocked);

        const template = handlebars.compile(templateContainBlockedUserPdf);

        const html = template(data);

        return await pdf.setAttachment(html);

    } catch (error) { throw error; }
};

const getTemplateContainBlockedUserPdf = (data: any) => {
    const _data: any = {};
    _data.image = image;
    _data.color = color;
    _data.date = moment().format('DD/MM/YYYY');
    _data.transactions = [];

    // Add client data
    data.forEach((elt: any) =>
        _data.transactions.push(
            {
                fullName: elt?.fullName || '',
                clientCode: elt?.clientCode || '',
                card: elt?.card?.code || '',
                tel: elt?.tel || 'N/A',
                email: elt?.email || 'N/A',
                label: elt?.card?.label || '',
                holder: elt?.card?.name || '',
                age: elt?.age || '',
                ncp: elt?.ncp || '',
            }
        )
    )

    return _data;
};

export const generateDeclarationFolderExportPdf = async (operation: Travel | OnlinePaymentMonth, type: 'travel' | 'onlinePayment') => {

    try {
        let data: any;
        let templateData: any;

        if (type === 'travel') {
            const travel = operation as Travel;
            templateData = templateTravelDeclarationRecapPdf;
            const amount = getTransactionsAmount(travel?.transactions || []);
            let exceeddays = moment().diff(moment(travel?.transactions[0]?.date).add(30, 'days'), 'days')

            data = {
                image,
                export_date: moment().format('DD/MM/YYYY HH:mm:ss'),
                fullName: travel.user.fullName,
                clientCode: travel.user.clientCode,
                ref: travel.travelRef || 'NON RENSEIGNE',
                status: getStatuslabel(travel.status),
                start: moment(travel.proofTravel.dates.start).format('DD/MM/YYYY HH:mm:ss'),
                end: moment(travel.proofTravel.dates.end).format('DD/MM/YYYY HH:mm:ss'),
                date: moment(travel?.dates?.created).format('DD/MM/YYYY HH:mm:ss'),
                nbreOperations: travel.transactions.length,
                amount,
                overrun: (amount - (travel?.ceiling || 0)) > 0 ? (amount - (travel?.ceiling || 0)) : 0,
                ceiling: travel.ceiling,
                nbreOutOfTime: exceeddays >= 0 ? exceeddays : 0,
                continents: travel.proofTravel.continents,
                countries: travel.proofTravel.countries,
                travelType: travel.travelType === TravelType.SHORT_TERM_TRAVEL ? 'VOYAGE DE COURTE DUREE' : 'VOYAGE DE LONGUE DUREE',
            }

        }

        if (type === 'onlinePayment') {
            const onlinePaymentMonth = operation as OnlinePaymentMonth;
            templateData = templateOnlinePaymentDeclarationRecapPdf;
            const amount = getTransactionsAmount(onlinePaymentMonth?.transactions || []);
            let exceeddays = moment().diff(moment((onlinePaymentMonth?.transactions || [])[0]?.date).add(30, 'days'), 'days')

            data = {
                image,
                export_date: moment().format('DD/MM/YYYY HH:mm:ss'),
                fullName: onlinePaymentMonth.user.fullName,
                clientCode: onlinePaymentMonth.user.clientCode,
                status: getStatuslabel(onlinePaymentMonth.status),
                created: moment(onlinePaymentMonth.dates.created).format('DD/MM/YYYY HH:mm:ss'),
                month: getYearMonthLabel(onlinePaymentMonth?.currentMonth || '', 'both'),
                nbreOperations: onlinePaymentMonth?.transactions?.length,
                amount,
                overrun: (amount - (onlinePaymentMonth?.ceiling || 0)) > 0 ? (amount - (onlinePaymentMonth?.ceiling || 0)) : 0,
                ceiling: onlinePaymentMonth.ceiling,
                nbreOutOfTime: exceeddays >= 0 ? exceeddays : 0,
            }

        }

        const template = handlebars.compile(templateData);
        const html = template(data);
        const test = await pdf.setAttachment(html);
        return test

    } catch (error) { throw error; }
};

const getTransactionsAmount = (transactions: any[]) => {
    let total = 0;
    if (!isEmpty(transactions)) {
        for (const transaction of transactions) {
            total = total + transaction.amount
        }
    }
    return total
}