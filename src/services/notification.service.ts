import * as notificationHelper from './helpers/notification.service.helper';
import * as http from 'request-promise';
import * as postmark from 'postmark';
import { logger } from '../winston';
import { config } from '../config';
import * as moment from 'moment';
import { Letter } from '../models/letter';
import * as exportHelper from './helpers/exports.helper';
import { get } from 'lodash';

export const notificationService = {

    /***************** SMS *****************/

    sendEmailVisaDepassment: async (data: any, email: string) => {

        data = {
            civility: 'MR',
            name: `ACHILLE KAMGA`,
            start: `08/09/2022`,
            ceilling: `5 000 000 XAF`,
            total: `6 000 000 XAF`,
            created: `08/09/2022`,
            link: `http://localhost:4200/visa-operations/client/ept-and-atm-withdrawal`,
        }

        const HtmlBody = notificationHelper.generateMailVisaDepassment(data);

        const subject = `Dépassement de plafond sur les transactions hors zone CEMAC`;

        const receiver = `${email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
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
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(
                `Error during sendEmailDetectTravel to ${receiver}. \n ${error.message} \n${error.stack}`
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

        const pdfString = await exportHelper.generateFormalNoticeLetter(letter.pdf[lang], userData);

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
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(
                `Error during sendEamailRejectStep to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

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

const getNumberWithSpaces = (x: { toString: () => string; }) => {
    if (!x) { return '0' }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};








