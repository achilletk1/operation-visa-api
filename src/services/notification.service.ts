import { Travel } from './../models/travel';
import * as notificationHelper from './helpers/notification.service.helper';
import * as http from 'request-promise';
import * as postmark from 'postmark';
import { logger } from '../winston';
import { config } from '../config';
import * as moment from 'moment';
import { Letter } from '../models/letter';
import * as exportHelper from './helpers/exports.helper';
import { get, isEmpty } from 'lodash';
import { commonService } from './common.service';
import { notificationsCollection } from '../collections/notifications.collection';
import { Notification, NotificationFormat } from '../models/notification';

import { encode, decode } from './helpers/url-crypt/url-crypt.service.helper';
import * as exportsHelper from './helpers/exports.helper';
import { usersService } from './users.service';
const classPath = 'services.notificationService';

export const notificationService = {

    /***************** SMS *****************/

    sendEmailVisaDepassment: async (data: any, email: string) => {

        data = {
            _id: data._id,
            civility: 'MR',
            name: `ACHILLE KAMGA`,
            start: `08/09/2022`,
            ceilling: `5 000 000 XAF`,
            total: `6 000 000 XAF`,
            created: `08/09/2022`,
            link: `http://localhost:4200/visa-operations/client/ept-and-atm-withdrawal`,
        }

        const HtmlBody: string = notificationHelper.generateMailVisaDepassment(data);

        const subject = `Dépassement de plafond sur les transactions hors zone CEMAC`;

        const receiver = `${email}`;

        try {
            sendEmail(receiver, subject, HtmlBody);
            const notification: Notification = {
                object: subject,
                format: NotificationFormat.MAIL,
                message: HtmlBody,
                email: receiver,
                id: data?._id.toString(),
            }
            
            await insertNotification(notification)

        } catch (error) {
            logger.error(
                `Error during sendEmailVisaDepassment to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailDetectTravel: async (data: any, email: string) => {

        data = {
            civility: 'MR',
            name: `ACHILLE KAMGA`,
            start: `08/09/2022`,
            card: `445411******7134`,
            created: `08/09/2022`,
            link: `http://localhost:4200/visa-operations/client/ept-and-atm-withdrawal`,
        }

        const HtmlBody = notificationHelper.generateMailTravelDetect(data);

        const subject = `Voyage hors de la zone CEMAC détecté`;

        const receiver = `${email}`;

        try {
             sendEmail(receiver, subject, HtmlBody);
            const notification: Notification = {
                object: subject,
                format: NotificationFormat.MAIL,
                message:HtmlBody    ,
                email:receiver,
                id :data?._id.toString(),
            }
             await insertNotification(notification);
        } catch (error) {
            logger.error(
                `Error during sendEmailDetectTravel to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailTravelDeclaration: async (travel: Travel, email: string) => {

        const data = {
            civility: 'Mr/Mme',
            name: `${get(travel.user, 'fullName')}`,
            start: `${get(travel, 'proofTravel.dates.start')}`,
            end: `${get(travel, 'proofTravel.dates.end')}`,
            created: `${get(travel, 'dates.created')}`,
            ceiling: `${get(travel, 'ceiling')}`,
        }

        const HtmlBody = notificationHelper.generateMailTravelDetect(data);

        const subject = `Déclaration de voyage`;

        const receiver = `${email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(
                `Error during sendEmailTravelDeclaration to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailFormalNotice: async (letter: Letter, userData: any, user: any, email: string, lang: string) => {

        const text = exportHelper.formatContent(letter.emailText[lang], userData);

        const data = {
            name: `${get(user, 'fname', '')} ${get(user, 'lname', '')}`,
            text
        }

        const HtmlBody = notificationHelper.generateMailTravelDetect(data);

        const subject = `Lettre de mise en demeure`;

        const receiver = `${email}`;

        const pdfString = await exportHelper.generateFormalNoticeLetter(letter.pdf[lang], userData, letter.pdf.signature);

        try {
            return sendEmail(receiver, subject, HtmlBody, pdfString);
            
        } catch (error) {
            logger.error(
                `Error during sendEmailFormalNotice to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailRejectStep: async (data: any, email: string) => {

        data = {
            civility: 'MR',
            name: `ACHILLE KAMGA`,
            start: `08/09/2022`,
            step: `la preuve de voyage`,
            reason: `Pièces justificatives non conforme`,
            link: `http://localhost:4200/visa-operations/client/ept-and-atm-withdrawal`,
        }

        const HtmlBody = notificationHelper.generateMailRejectStep(data);

        const subject = `Mise à jour du statut de la preuve de voyage`;

        const receiver = `${email}`;

        try {
             sendEmail(receiver, subject, HtmlBody);
            const notification: Notification = {
                object: subject,
                format: NotificationFormat.MAIL,
                message:HtmlBody    ,
                email:receiver,
                id :data?._id.toString(),
            }
             await insertNotification(notification);
        } catch (error) {
            logger.error(
                `Error during sendEamailRejectStep to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },


    getNotifications: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit, start, end } = filters;
            delete filters.offset;
            delete filters.limit;
            delete filters.start;
            delete filters.end;

            const range = (start && end) ? { start: moment(start, 'DD-MM-YYYY').startOf('day').valueOf(), end: moment(end, 'DD-MM-YYYY').endOf('day').valueOf() } :
                undefined;

            return await notificationsCollection.getNotifications(filters || {}, offset || 1, limit || 40, range);
        } catch (error) {
            logger.error(`\nError getting visa operations \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    generateNotificationExportLinks: async (userId: string, query: any) => {
       
        const user = await usersService.getUserById(userId);
        if (!user || isEmpty(user)) { return new Error('UserNotFound'); }
        
        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        delete query.action;

        const options = { userId, query , ttl };

        const pdfCode = encode({ format: 'pdf', ...options });

        const xlsxCode = encode({ format: 'xlsx', ...options });

        const basePath = `${config.get('baseUrl')}${config.get('basePath')}/notification-generate/${userId}/export`

        return {
            pdfPath: `${basePath}/${pdfCode}`,
            xlsxPath: `${basePath}/${xlsxCode}`
        }
    },

    generateNotificationExportData: async (id: string, code: any) => {
        try {
            let options;

            try {
                options = decode(code);
            } catch (error) { return new Error('BadExportCode'); }
    
            const { format, query , userId, ttl } = options;
            if ((new Date()).getTime() >= ttl) { return new Error('ExportLinkExpired'); }
    
            if (id !== userId) { return new Error('Forbbiden'); }
    
            const user = await usersService.getUserById(userId);
    
            if (!user) { return new Error('UserNotFound'); }
            commonService.parseNumberFields(query);
            const { offset, limit, start, end } = query;
            delete query.offset;
            delete query.limit;
            delete query.start;
            delete query.end;
    
            const range = (start && end) ? { start: moment(start, 'DD-MM-YYYY').startOf('day').valueOf(), end: moment(end, 'DD-MM-YYYY').endOf('day').valueOf() } :
                undefined;
    
            const {data} =  await notificationsCollection.getNotifications(query || {}, offset || 1, limit || 40, range);
    
            if (!data || isEmpty(data)) {
                logger.info(`notification not found, ${classPath}.getNotifications()`);
                return new Error('NotificationNotFound');
            }
    
            let result: any;
    
            if (format === 'pdf') {
                const pdfString = await exportsHelper.generateNotificationExportPdf(user, data, start, end );
                const buffer = Buffer.from(pdfString, 'base64');
                result = { contentType: 'application/pdf', fileContent: buffer };
            }
     
            return result;

        } catch (error) {
            logger.error(`\nError export PDF \n${error.message}\n${error.stack}\n`);
            return error;
        }
      
    }
};

// END Visa operations mails //

const sendEmailFromLONDOServer = async (receiver?: any, subject?: any, body?: any, attachments?: any, cc?: any) => {
    try {

        if (!receiver || !body || !subject) {
            logger.error('email receiver or body not provided');
            return new Error(`email receiver or body not provided`);
        }

        logger.info(`using postMark to send email to ${receiver}, and ${cc}`);

        const client = new postmark.ServerClient("b19e8d68-c545-4f23-8b9c-1deff039d595");

        const options: any = {
            From: `contact@londo.io`,
            To: `${receiver}`,
            Subject: `${subject}`,
            HtmlBody: body,
        };

        if (cc) { options.Cc = cc; }

        if (attachments) { options.Attachments = attachments; }

        return await client.sendEmail(options);
    } catch (error) {
        logger.info(`error when send mail form LONDO server ${error.stack} \n${(error.message)}`);
        return error
    }
};

const sendEmail = async (receiver?: any, subject?: any, body?: any, pdfString?: any, cc?: any, excelData?: any) => {

    if (config.get('env') !== 'staging-bci' && config.get('env') !== 'production') {
        let Attachments: any[] = null;
        if (pdfString && !(pdfString instanceof Error)) {
            Attachments ??= [];
            Attachments.push({
                Name: `Opération-du-${moment().valueOf()}.pdf`,
                Content: pdfString,
                ContentType: 'application/pdf'
            });
        }
        if (excelData && !(excelData instanceof Error)) {
            Attachments ??= [];
            Attachments.push({
                Name: excelData.fileName,
                Content: excelData.fileContent.toString('base64'),
                ContentType: excelData.contentType,
            });
        }

        return sendEmailFromLONDOServer(receiver, subject, body, Attachments || null, cc || null);
    }
};


const sendSMSFromBCIServer = async (phone?: string, body?: string) => {

    if (!['staging-bci', 'production'].includes(config.get('env'))) { return; }

    if (!phone || !body) { return; }

    // options to send with Londo Gateway
    const optionsLND: any = {
        method: 'POST',
        uri: `${config.get('londoGateway.url')}/notify/instantaneous/generate/instant-sms`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: config.get('londoGateway.timeout'),
        form: { phone, text: body, source: 'DBANKING' },
        rejectUnauthorized: false,
        insecure: true,
        json: true
    };

    try {
        const result = await http(optionsLND);
        logger.info(`token sms successfully send to client ${phone} \n${JSON.stringify(result, null, 4)}`);
        return { message: 'SMS send' };
    } catch (error) {
        logger.info(`error when send mail form BCI server ${error.stack} \n${(error.message)}`);
        return error
    }
};

const insertNotification = async (notification: any) => {
    notification.dates = { createdAt: moment().valueOf() },
        notification.status = 100;

    try {
        return await notificationsCollection.insertNotifications(notification);
    } catch (error) {
        logger.error(`\nError in insert notification \n${error.message}\n${error.stack}\n`);
        return error;
    }
};
const getNumberWithSpaces = (x: { toString: () => string; }) => {
    if (!x) { return '0' }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};








