import { notificationsCollection } from '../collections/notifications.collection';
import { encode, decode } from './helpers/url-crypt/url-crypt.service.helper';
import * as notificationHelper from './helpers/notification.service.helper';
import { templatesCollection } from '../collections/templates.collection';
import * as visaHelper from './helpers/visa-operations.service.helper';
import { queueCollection } from '../collections/queue.collection';
import { OnlinePaymentMonth } from '../models/online-payment';
import { NotificationFormat } from '../models/notification';
import { OpeVisaStatus } from '../models/visa-operations';
import * as exportsHelper from './helpers/exports.helper';
import * as exportHelper from './helpers/exports.helper';
import * as formatHelper from './helpers/format.helper';
const classPath = 'services.notificationService';
import { commonService } from './common.service';
import { usersService } from './users.service';
import { Travel } from './../models/travel';
import { Letter } from '../models/letter';
import { get, isEmpty } from 'lodash';
import { User } from '../models/user';
import { logger } from '../winston';
import { config } from '../config';
import moment from 'moment';

const appName = `${config.get('template.app')}`;
const company = `${config.get('template.company')}`;
export const notificationService = {

    /***************** SMS *****************/

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

    sendTemplateSMS: async (userData: any, phone: string, key: string, lang: string, id: string) => {
        if (!phone) { return; }

        const visaTemplate = await templatesCollection.getTemplateBy({ key });

        if (!visaTemplate) { return; }

        let data = await formatHelper.replaceVariables(visaTemplate[lang], userData, true,false);
        const body = data?.sms;
        await insertNotification('', NotificationFormat.SMS, body, phone, id, null, key);
        try {
            return sendSMSFromBCIServer(phone, body);
        } catch (error) {
            logger.error(`Error during send email sendToken to ${phone}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },


    /**************** EMAIL ********************/

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

    sendVisaTemplateEmail: async (userData: any, receiver: string, visaTemplate: any, lang: string, id: string) => {
        if (!receiver) { return }

        let emailData = await formatHelper.replaceVariables(visaTemplate[lang], userData);

        const HtmlBody = notificationHelper.generateMailByTemplate({ ...emailData, name: userData['NOM_CLIENT'] });

        const subject = emailData.obj;

        try {
            sendEmail(receiver, subject, HtmlBody);

            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, id);

        } catch (error) {
            logger.error(
                `Error during sendVisaTemplateEmail to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailDetectTransactions: async (userData: any, receiver: string, lang: string, id: string) => {
        logger.info(`send mail detect transaction to ${receiver}`);
        if (!receiver) { return }

        const visaTemplate = await templatesCollection.getTemplateBy({ key: 'firstTransaction' });

        let emailData = await formatHelper.replaceVariables(visaTemplate[lang], userData);

        const HtmlBody = notificationHelper.generateMailByTemplate({ ...emailData, name: userData['NOM_CLIENT'] });

        const subject = emailData.obj || `Opération hors de la zone CEMAC détectée`;

        try {
            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, id);
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
        } catch (error) {
            logger.error(
                `Error during sendEmailTravelDeclaration to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailVisaExceding: async (userData: any, receiver: string, lang: string, id: string) => {
        logger.info(`send mail visa exceding transaction to ${receiver}`);
        if (!receiver) { return }

        const visaTemplate = await templatesCollection.getTemplateBy({ key: 'ceilingOverrun' });

        let emailData = await formatHelper.replaceVariables(visaTemplate[lang], userData);

        const HtmlBody = notificationHelper.generateMailByTemplate({ ...emailData, name: userData['NOM_CLIENT'] });

        const subject = emailData.obj || `Dépassement de plafond sur les transactions Hors zone CEMAC`;


        try {

            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, id);
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
        } catch (error) {
            logger.error(
                `Error during sendEmailValidationRequired to ${receiver}. \n ${error.message} \n${error.stack}`
            );
            return error;
        }
    },

    sendEmailFormalNotice: async (receiver: string, letter: Letter, userData: any, lang: string, subject: string, id: string) => {


        // const content = {
        //     text: letter.emailText[lang]
        // }
        // const formatedContent = formatHelper.replaceVariables(content, userData);
        const formatedContent = formatHelper.replaceVariables(letter.pdf[lang], userData);

        const data = {
            name: userData['NOM_CLIENT'],
            civility: 'Mr/Mme',
            signature: letter.pdf.signature,
            ...formatedContent

        }

        const HtmlBody = await exportHelper.generateFormalNoticeMail(data);


        // const pdfData = formatHelper.replaceVariables(letter.pdf[lang], userData);

        // const pdfString = await exportHelper.generateFormalNoticeLetter({ ...pdfData, signature: letter.pdf.signature });

        try {
            // let Attachments: any;
            // if (pdfString && !(pdfString instanceof Error)) {
            //     Attachments ??= [];
            //     Attachments.push({
            //         name: `Lettre-de-mise-en-demeure-du-${moment().valueOf()}.pdf`,
            //         content: pdfString,
            //         contentType: 'application/pdf'
            //     });
            // }
            // sendEmail(receiver, subject, HtmlBody, pdfString);
            sendEmail(receiver, subject, HtmlBody);
            // await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, id, Attachments);
            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, id);
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

    sendEmailUsersBloqued: async (usersLocked: any[]) => {
        const HtmlBody = await notificationHelper.generateMailContainBlockedUser(usersLocked);

        const subject = `[OPERATION VISA] Liste des clients en situation de blocage de carte`;

        const receiver = config.get('env') === 'production' ? config.get('emailBank') : config.get('emailTest');

        const pdfString = await exportHelper.generatePdfContainBlockedUser(usersLocked);

        try {
            let Attachments: any;
            if (pdfString && !(pdfString instanceof Error)) {
                Attachments ??= [];
                Attachments.push({
                    name: `client-en-demeure`,
                    content: pdfString,
                    contentType: 'application/pdf'
                });
            }
            sendEmail(receiver, subject, HtmlBody, pdfString);

            await insertNotification(subject, NotificationFormat.MAIL, HtmlBody, receiver, '', Attachments, 'customer_in_demeure', 'mails_liste_clients_en_demeurres');
        } catch (error) {
            logger.error(`Error during  to ${receiver} for client in demeure. \n ${error.message} \n${error.stack}`);
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
    logger.info(`insert SMS to sending in queue, to: ${phone}`);
    return queueNotification('sms', { receiver: phone, date: new Date(), body });
};

const insertNotification = async (object: string, format: NotificationFormat, message: string, receiver: string, id?: string, attachments?: any, key?: any, type?: string) => {
    const email = format === NotificationFormat.MAIL ? receiver : null;
    const tel = format === NotificationFormat.SMS ? receiver : null;
    const notification = { object, format, message, email, tel, id, dates: { createdAt: moment().valueOf() }, status: 100, attachments, key };
    try {
        const { insertedId } = await notificationsCollection.insertNotifications(notification);
        let attachment: any;
        if (!isEmpty(attachments)) {
            attachment = commonService.saveAttachment(
                insertedId.toString(),
                {
                    content: attachments[0]?.content,
                    contentType: attachments[0]?.contentType,
                    label: attachments[0]?.name
                },
                notification?.dates?.createdAt,
                type,
            );
            attachment.fileName = attachment.name;
        }
        await notificationsCollection.updateNotification(insertedId.toString(), { attachments: [attachment] });
    } catch (error) {
        logger.error(`\nError in insert notification \n${error.message}\n${error.stack}\n`);
        return error;
    }
};








