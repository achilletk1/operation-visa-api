import { Travel, TravelType } from './../models/travel';
import * as notificationHelper from './helpers/notification.service.helper';
import http from 'request-promise';
import postmark from 'postmark';
import { logger } from '../winston';
import { config } from '../config';
import moment from 'moment';
import { Letter } from '../models/letter';
import * as exportHelper from './helpers/exports.helper';
import { get, isEmpty } from 'lodash';
import { commonService } from './common.service';
import { notificationsCollection } from '../collections/notifications.collection';
import { Notification, NotificationFormat } from '../models/notification';
import { OnlinePaymentMonth } from '../models/online-payment';
import * as visaHelper from './helpers/visa-operations.service.helper';

import { encode, decode } from './helpers/url-crypt/url-crypt.service.helper';
import * as exportsHelper from './helpers/exports.helper';
import { usersService } from './users.service';
import { templatesCollection } from '../collections/templates.collection';
import { OpeVisaStatus } from '../models/visa-operations';
import { queueCollection } from '../collections/queue.collection';
import { User } from '../models/user';
import * as formatHelper from './helpers/format.helper';
import { TemplateForm } from '../models/templates';
const classPath = 'services.notificationService';

const appName = `${config.get('template.app')}`;
const company = `${config.get('template.company')}`;
export const notificationService = {

    /***************** SMS *****************/

    // sendVisaTemplateEmail: async (dataParameter: any, email: string, subject: string , label: string) => {
    //     const {data} = await templatesCollection.getTemplates({label});

    //     const HtmlBody: string = await notificationHelper.generateVisaTemplateForNotification(data, dataParameter);

    //     const receiver = `${email}`;

    //     try {
    //         sendEmail(receiver, subject, HtmlBody);
    //         const notification: Notification = {
    //             object: subject,
    //             format: NotificationFormat.MAIL,
    //             message: HtmlBody,
    //             email: receiver,
    //             id: dataParameter?._id.toString(),
    //         }     

    //         await insertNotification(subject, )

    //     } catch (error) {
    //         logger.error(
    //             `Error during sendEmailVisaDepassment to ${receiver}. \n ${error.message} \n${error.stack}`
    //         );
    //         return error;
    //     }
    // },

    sendTokenSMS: async (token: any, phone: any) => {
        if (!phone || !token) { return; }

        const body = `Bienvenue sur l'application ${appName} de la ${company}. Veuillez utiliser le mot de passe temporaire ${token} pour valider votre operation.`;

        try {
            return sendSMSFromBCIServer(phone, body);
        } catch (error) {
            logger.error(`Error during send email sendToken to ${phone}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendValidationTokenEmail: async (user: User, token: any) => {
        const HtmlBody = notificationHelper.generateMailContentValidationToken(user, token);
        const subject = `Mot de passe temporaire BCI MOBILE BCI`;
        const receiver = `${user.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during  email Token to ${user.email}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },
    sendVisaTemplateEmail: async (userData: any, receiver: string, visaTemplate: any, lang: string) => {
        if (!receiver) { return }

        let emailData = await formatHelper.replaceVariables(visaTemplate[lang], userData);

        const HtmlBody = notificationHelper.generateMailByTemplate({ ...emailData, name: userData['NOM_CLIENT'] });

        const subject = emailData.obj;

        try {
            sendEmail(receiver, subject, HtmlBody);

            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver);

        } catch (error) {
            logger.error(
                `Error during sendVisaTemplateEmail to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },


    sendEmailDetectTransactions: async (userData: any, receiver: string, lang: string) => {
        logger.info(`send mail detect transaction to ${receiver}`);
        if (!receiver) { return }

        const visaTemplate = await templatesCollection.getTemplateBy({ key: 'firstTransaction' });

        let emailData = await formatHelper.replaceVariables(visaTemplate[lang], userData);

        const HtmlBody = notificationHelper.generateMailByTemplate({ ...emailData, name: userData['NOM_CLIENT'] });

        const subject = emailData.obj || `Opération hors de la zone CEMAC détectée`;

        try {
            await insertNotification(subject, HtmlBody, receiver, HtmlBody);
            await sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(
                `Error during sendEmailDetectTravel to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailTravelDeclaration: async (travel: Travel, receiver: string) => {
        if (!receiver) { return }

        const data = {
            civility: 'M./Mme',
            name: `${get(travel.user, 'fullName')}`,
            start: `${get(travel, 'proofTravel.dates.start')}`,
            end: `${get(travel, 'proofTravel.dates.end')}`,
            created: `${get(travel, 'dates.created')}`,
            ceiling: `${get(travel, 'ceiling')}`,
        }

        const HtmlBody = notificationHelper.generateMailTravelDeclaration(data);

        const subject = `Déclaration de voyage Hors zone CEMAC`;


        try {
            sendEmail(receiver, subject, HtmlBody);
            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, travel?._id.toString());
        } catch (error) {
            logger.error(
                `Error during sendEmailTravelDeclaration to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailVisaExceding: async (userData: any, receiver: string, lang: string) => {
        logger.info(`send mail visa exceding transaction to ${receiver}`);
        if (!receiver) { return }

        const visaTemplate = await templatesCollection.getTemplateBy({ key: 'ceilingOverrun' });

        let emailData = await formatHelper.replaceVariables(visaTemplate[lang], userData);

        const HtmlBody = notificationHelper.generateMailByTemplate({ ...emailData, name: userData['NOM_CLIENT'] });

        const subject = emailData.obj || `Dépassement de plafond sur les transactions Hors zone CEMAC`;


        try {

            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver);
            sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(
                `Error during sendEmailTravelDeclaration to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailOnlinePayementDeclaration: async (onlinePayement: OnlinePaymentMonth, receiver: string) => {
        const data = {
            civility: 'M./Mme',
            name: `${get(onlinePayement?.user, 'fullName')}`,
            created: `${moment(+get(onlinePayement, 'dates.created')).format('DD/MM/YYYY')}`,
            ceiling: `${get(onlinePayement, 'ceiling')}`,
        }

        const HtmlBody = notificationHelper.generateOnlinePayementDeclarationMail(data);
        const subject = `Déclaration de payement en ligne`;
        try {
            sendEmail(receiver, subject, HtmlBody);
            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, onlinePayement?._id.toString());
        } catch (error) {
            logger.error(
                `Error during sendEmailOnlinePayementDeclaration to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailOnlinePayementStatusChanged: async (onlinePayement: OnlinePaymentMonth, receiver: string) => {
        if (receiver) { return; }
        const data = {
            civility: 'Mr/Mme',
            name: `${get(onlinePayement.user, 'fullName')}`,
            date: `${visaHelper.transformDateExpression(get(onlinePayement, 'currentMonth'))}`,
            ceiling: `${get(onlinePayement, 'ceiling')}`,
            status: visaHelper.getStatusExpression(get(onlinePayement, 'status'))
        }

        const HtmlBody = notificationHelper.generateOnlinePayementStatusChangedMail(data);
        const subject = `Mise à jour de la déclaration de payement en ligne`;
        try {
            sendEmail(receiver, subject, HtmlBody);
            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, onlinePayement?._id.toString());
        } catch (error) {
            logger.error(
                `Error during sendEmailOnlinePayementDeclaration to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailTravelStatusChanged: async (travel: Travel, receiver: string) => {
        if (receiver) { return; }
        const data = {
            civility: 'Mr/Mme',
            name: `${get(travel.user, 'fullName')}`,
            start: `${moment(get(travel, 'proofTravel.dates.start')).format('DD/MM/YYYY')}`,
            end: `${moment(get(travel, 'proofTravel.dates.end')).format('DD/MM/YYYY')}`,
            status: visaHelper.getStatusExpression(get(travel, 'status'))
        }

        const HtmlBody = notificationHelper.generateTravelStatusChangedMail(data);
        const subject = `Mise à jour de la déclaration de voyage hors zone CEMAC`;
        try {
            sendEmail(receiver, subject, HtmlBody);
            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, travel?._id.toString());
        } catch (error) {
            logger.error(
                `Error during sendEmailOnlinePayementDeclaration to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailValidationRequired: async (data: Travel | OnlinePaymentMonth, receiver: string, user: User, type: string) => {
        if (!receiver) { return; }
        type = type === 'travel' ? 'Déclaration de voyage hors zone CEMAC' : 'Déclaration de paiement en ligne';
        const info = {
            name: `${get(user, 'fname')} ${get(user, 'lname')}`,
            date: `${moment().format('DD/MM/YYYY')}`,
            client: `${get(data, 'user.fullName')}`,
            type
        }

        const HtmlBody = notificationHelper.generateValidationRequiredMail(info);
        const subject = `Validation requise pour ${type}`;
        try {
            sendEmail(receiver, subject, HtmlBody);
            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, data?._id?.toString());
        } catch (error) {
            logger.error(
                `Error during sendEmailValidationRequired to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },
    sendEmailFormalNotice: async (receiver: string, letter: Letter, userData: any, lang: string, subject: string) => {


        const content = {
            text: letter.emailText[lang]
        }
        const formatedContent = formatHelper.replaceVariables(content, userData);

        const data = {
            name: userData['NOM_CLIENT'],
            civility: 'Mr/Mme',
            ...formatedContent,

        }

        const HtmlBody = await exportHelper.generateFormalNoticeMail(data);


        const pdfData = formatHelper.replaceVariables(letter.pdf[lang], userData);

        const pdfString = await exportHelper.generateFormalNoticeLetter({ ...pdfData, signature: letter.pdf.signature });

        try {
            let Attachments: any;
            if (pdfString && !(pdfString instanceof Error)) {
                Attachments ??= [];
                Attachments.push({
                    name: `Lettre-de-mise-en-demeure-du-${moment().valueOf()}.pdf`,
                    content: pdfString,
                    contentType: 'application/pdf'
                });
            }
            sendEmail(receiver, subject, HtmlBody, pdfString);
            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, letter?._id.toString(), Attachments);
        } catch (error) {
            logger.error(
                `Error during sendEmailFormalNotice to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailStepStatusChanged: async (travel: Travel, step: string, receiver: string) => {

        const data = {
            name: `${get(travel.user, 'fullName')}`,
            start: `${moment(get(travel, 'proofTravel.dates.start')).format('DD/MM/YYYY')}`,
            end: `${moment(get(travel, 'proofTravel.dates.end')).format('DD/MM/YYYY')}`,
            step: visaHelper.transformStepExpression(step),
            status: get(travel[step], 'status'),
            rejected: get(travel[step], 'status') === OpeVisaStatus.REJECTED,
            reason: `${travel[step].rejectReason}`,
        }

        const HtmlBody = notificationHelper.generateMailStatusChanged(data);

        const subject = `Mise à jour du statut de la preuve de voyage`;

        try {
            sendEmail(receiver, subject, HtmlBody);
            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, travel?._id.toString());
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

        const options = { userId, query, ttl };

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

            const { format, query, userId, ttl } = options;

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
                { start: moment().startOf('month').valueOf(), end: moment().endOf('month').valueOf() };
            const { data } = await notificationsCollection.getNotifications(query || {}, null, null, range);


            if (!data || isEmpty(data)) {
                logger.info(`notification not found, ${classPath}.getNotifications()`);
                return new Error('NotificationNotFound');
            }
            let result: any;

            if (format === 'pdf') {
                const pdfString = await exportsHelper.generateNotificationExportPdf(user, data, start, end);
                const buffer = Buffer.from(pdfString, 'base64');
                result = { contentType: 'application/pdf', fileContent: buffer };
            }

            return result;

        } catch (error) {
            logger.error(`\nError export PDF \n${error.message}\n${error.stack}\n`);
            return error;
        }

    },

    sendEmailIncreaseCeiling: async (ceiling: any) => {
        const HtmlBody = notificationHelper.generateMailContentRequestCeiling(ceiling);
        const subject = `Demande d'augmentation de plafond du ${moment().format('DD/MM/YYYY')}`;
        const receiver = `${ceiling?.user?.email}`;
        const pdfString = await exports.generatePdfContentCeilingRequest(ceiling);

        try {
            return sendEmail(receiver, subject, HtmlBody, pdfString);
        } catch (error) {
            logger.error(`Error during  sendEmailIncreaseCeiling to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendEmailIncreaseCeilingBank: async (ceiling: any) => {
        const HtmlBody = notificationHelper.generateMailContentCeilingRequestBank(ceiling);
        const subject = `Nouvelle demande d'augmentation de plafond enregistrée sur le portail BCIONLINE`;
        const receiver = `${config.get('ceilingIncreaseEmail')}`;
        const pdfString = await exports.generatePdfContentCeilingRequest(ceiling);

        try {
            return sendEmail(receiver, subject, HtmlBody, pdfString);
        } catch (error) {
            logger.error(`Error during send email CardRequestBank to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendEmailAppointmentCreatedBank: async (request: any, receiver?: string, caeEmail?: string) => {
        const HtmlBody = notificationHelper.generateMailContentAppointmentBank(request);
        const subject = `Nouvelle demande de rendez-vous enregistrée sur le portail BCIONLINE`;
        // const receiver = get(request, 'cae.email');
        // const caeEmail = config.get('caeEmail');

        try {
            return sendEmail(receiver, subject, HtmlBody, null, caeEmail || null);
        } catch (error) {
            logger.error(`Error during send email AppointmentCreatedBank to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },
    sendEmailCeilingAssigned: async (ceiling: any, userAssigned: any) => {
        const HtmlBody = notificationHelper.generateMailContentCeilingAssigned(ceiling, userAssigned);
        const subject = `Demande d'augmentation de plafond en cours de traitement`;
        const receiver = `${ceiling.user.email}`;
        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during send email FeedBackAssigned to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },
    sendEmailCaeAssigned: async (ceiling: any, userAssigned: any) => {
        const HtmlBody = notificationHelper.generateMailContentCaeAssigned(ceiling, userAssigned);
        const subject = `Traitement de la demande d'augmentation de plafond`;
        const receiver = `${get(userAssigned, 'email')}`;
        // tslint:disable-next-line:no-console
        console.log('userAssigned.email', HtmlBody);

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during send email FeedBackAssigned to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },
    sendEmailRejectCeiling: async (ceiling: any) => {

        try {
            const HtmlBody = notificationHelper.generateMailRejectCeiling(ceiling);
            const subject = `Rejet demande augmantation de plafond`;
            const receiver = `${ceiling?.user?.email}`;
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during  sendEmailWelcome to ${ceiling?.user?.email}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },
    sendEmailValidCeiling: async (ceiling: any) => {
        const HtmlBody = notificationHelper.generateMailValidCeiling(ceiling);
        const subject = `Validation demande augmantation de plafond`;
        const receiver = `${ceiling?.user?.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during  sendEmailWelcome to ${ceiling?.user?.email}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

};

// END Visa operations mails //


const sendEmail = async (receiver?: any, subject?: any, body?: any, pdfString?: any, cc?: any, excelData?: any) => {
    receiver = config.get('env') === 'production' ? `${receiver}` : config.get('emailTest');

    if (config.get('env') !== 'staging-bci' && config.get('env') !== 'production') {
        let attachments: any[] = null;
        if (pdfString && !(pdfString instanceof Error)) {
            attachments ??= [];
            attachments.push({
                name: `Opération-du-${moment().valueOf()}.pdf`,
                content: pdfString,
                contentType: 'application/pdf'
            });
        }
        if (excelData && !(excelData instanceof Error)) {
            attachments ??= [];
            attachments.push({
                name: excelData.fileName,
                content: excelData.fileContent.toString('base64'),
                contentType: excelData.contentType,
            });
        }
        return queueNotification('mail', { subject, receiver, cc, date: new Date(), body, attachments });
    }
};

async function queueNotification(type: string, data: any = null, delayUntil?: number | Date) {
    try {
        // calculate start date/time
        let proc = new Date(); const priority = 1;
        if (delayUntil instanceof Date) { proc = delayUntil; }
        else if (!isNaN(delayUntil)) { proc = new Date(+proc + delayUntil * 1000); }

        // aad item in queue
        const newQueueItem: any = await queueCollection.add({ type, proc, data, priority })

        // return qItem
        return newQueueItem && newQueueItem.insertedCount && newQueueItem.insertedId ? { _id: newQueueItem.insertedId, sent: newQueueItem.insertedId.getTimestamp(), data } : null;
    } catch (error) {
        console.log(`Queue.send ${type} to ${get(data, 'receiver', '')} error: \n${error.message}\n${error.stack}\n`);
        return null;
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


const insertNotification = async (object: string, format: NotificationFormat, message: string, email: string, id?: string, attachments?: any) => {

    const notification = { object, format, message, email, id, dates: { createdAt: moment().valueOf() }, status: 100, attachments };
    try {
        return await notificationsCollection.insertNotifications(notification);
    } catch (error) {
        logger.error(`\nError in insert notification \n${error.message}\n${error.stack}\n`);
        return error;
    }
};








