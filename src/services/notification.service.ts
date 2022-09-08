import * as notificationHelper from './helpers/notification.service.helper';
import * as http from 'request-promise';
import { get, isEmpty } from 'lodash';
import { User } from "../models/user";
import * as postmark from 'postmark';
import { logger } from '../winston';
import { config } from '../config';
import * as moment from 'moment';

export const notificationService = {

    /***************** SMS *****************/

    sendTokenSMS: async (token: any, phone: any) => {
        if (!phone || !token) { return; }

        const body = `Bienvenue sur l'application BCIONLINE de la BCI. Veuillez utiliser le mot de passe temporaire ${token} pour valider votre operation.`;

        try {
            return sendSMSFromBCIServer(phone, body);
        } catch (error) {
            logger.error(`Error during send email sendToken to ${phone}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    // START permanent transfer sms section //

    sendActivateTransferSMS: async (data: any, phone: any) => {
        if (!phone || isEmpty(data)) { return; }
        const { amount, dates, transferDay, originator } = data;
        const truncateNcp = originator.ncp.slice(8);

        const body = `Vous venez d'activer un virement permanent d'un montant de ${amount}FCFA au compte  ********${truncateNcp} le ${moment(dates?.created).format('DD/MM/YYYY')} a ${moment(dates?.created).format('HH:mm')}, ce virement sera effectue tous les ${transferDay} de chaque mois\n Merci de nous faire confiance.`;

        try {
            return sendSMSFromBCIServer(phone, body);
        } catch (error) {
            logger.error(`Error during send email ActivateTransferSMS to ${phone}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendTransferSMSConfirmation: async (data: any, phone: any) => {
        const { amount, dates, originator } = data;
        if (!phone || !amount || !dates || !originator) { return; }
        const truncateNcp = originator.ncp.slice(8);

        const body = `XAF${getNumberWithSpaces(amount)} debit du compte ********${truncateNcp} le ${moment(dates.paid).format('DD/MM/YYYY')} a ${moment(dates.paid).format('HH:mm')}, Pour virement permanent.`;

        try {
            return sendSMSFromBCIServer(phone, body);
        } catch (error) {
            logger.error(`Error during send email TransferSMSConfirmation to ${phone}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    // END permanent transfer sms section //

    /***************** Email *****************/

    sendEmailWelcome: async (user: User, password: string) => {
        const HtmlBody = notificationHelper.generateMailContentWelcome(user, password);
        const subject = `Bienvenue sur BCIONLINE !`;
        const receiver = `${user.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during  sendEmailWelcome to ${user.email}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendEmailRejectAttachement: async (data: any, email: string) => {
        const HtmlBody = notificationHelper.generateMailContentRejectAttachement(data);
        const subject = `Rejet de pièce jointe.`;
        const receiver = `${email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(
                `Error during sendEmailRejectAttachement to ${receiver}. \n ${error.message} \n${error.stack}`
            );
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

    sendEmailPwdReseted: async (user: User, password: string) => {
        const HtmlBody = notificationHelper.generateMailContentPwdReseted(user, password);
        const subject = `Mot de passe temporaire BCIONLINE BCI !`;
        const receiver = `${user.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during sendEmailPwdReseted to ${user.email}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendOTPmail: async (user: User, invoice: any) => {
        const HtmlBody = notificationHelper.generateMailContentOTP(invoice);
        const subject = `Code de validation de l'opération n° ${invoice.internalRef}`;
        const receiver = `${user.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during  sendOTPmail to ${user.email}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendAuthTokenmail: async (user: User, token: any) => {
        const HtmlBody = notificationHelper.generateMailContentAuthToken(user, token);
        const subject = `Mot de passe temporaire BCIONLINE BCI`;
        const receiver = `${user.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during  email Token to ${user.email}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },
    sendEmailChangeStatus: async (request: any) => {
        const HtmlBody = notificationHelper.generateMailContentstatus(request);
        const subject = `Traitement de votre demande.`;
        const receiver = `${request.user.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during send email ChangeStatus to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendEmailAppointmentCreatedClient: async (request: any) => {
        const HtmlBody = notificationHelper.generateMailContentAppointmentClient(request);
        const subject = `Demande de rendez-vous`;
        const receiver = `${request.user.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during send email AppointmentCreatedClient to ${receiver}. \n ${error.message} \n${error.stack}`);
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

    sendEmailFeedBackCreatedClient: async (feedBack: any) => {
        const HtmlBody = notificationHelper.generateMailContentFeedBackCreatedClient(feedBack);
        const subject = `Réclamation n° ${feedBack.internalRef} enregistrée`;
        const receiver = `${feedBack.user.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during send email FeedBackCreatedClient to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendEmailSuggestionsCreatedClient: async (suggestion: any) => {
        const HtmlBody = notificationHelper.generateMailContentSuggestionsCreatedClient(suggestion);
        const subject = `Suggestion enregistrée`;
        const receiver = `${suggestion.user.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during send email FeedBackCreatedClient to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendEmailFeedBackCreatedBank: async (feedBack: any, receiver: string) => {
        const HtmlBody = notificationHelper.generateMailContentFeedBackCreatedBank(feedBack);
        const subject = `Nouvelle réclamation n° ${feedBack.internalRef} faite sur BCIONLINE`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during send email FeedBackCreatedBank to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendEmailFeedBackAssigned: async (feedBack: any, userAssigned: any) => {
        const HtmlBody = notificationHelper.generateMailContentFeedBackAssigned(feedBack, userAssigned);
        const subject = `Réclamation n° ${feedBack.internalRef} en cours de traitement`;
        const receiver = `${feedBack.user.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during send email FeedBackAssigned to ${receiver}. \n ${error.message} \n${error.stack}`);
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

    sendEmailFeedBackResolved: async (feedBack: any, comment: any) => {
        const HtmlBody = notificationHelper.generateMailContentFeedBackResolved(feedBack, comment);
        const subject = `Clôture réclamation n° ${feedBack.internalRef}`;
        const receiver = `${feedBack.user.email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during send email FeedBackResolved to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    // START Visa operations mails //

    sendPostTransactionFileThreadError: async (data: any, email: string) => {

        const HtmlBody = notificationHelper.generateErrorPostingTransactionFile(data);
        const subject = `Erreur d'import de fichier.`;
        const receiver = `${email}`;

        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during sendEmailRejectAttachement to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendEmailToVisaDepassementClient: async (email: string, data: any) => {

        const HtmlBody = notificationHelper.generateMailVisaDepassment(data);
        const subject = `Justification des opérations hors zone CEMAC.`;
        const receiver = config.get('env') === 'staging-bci' ? `HONGOUO@bcicongo.com` : `${email}`;
        try {
            return sendEmail(receiver, subject, HtmlBody);
        } catch (error) {
            logger.error(`Error during sendEmailToVisaDepassementClient to ${receiver}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },
    sendSMSToVisaDepassementClient: async (phone: string, data: any) => {

        const { currentMonth, ncp, name } = data;
        if (!phone || !currentMonth || !ncp || !name) { return; }

        const body = `Bonjour ${name},nous tenons à vous informer que au mois de
        ${{ currentMonth }}  vous avez
        effectuer des opérations hors zone CEMAC qui ont
        dépassés le plafond, Nous vous prions à cet éffet de vous rendre sur la plateforme BCI ONLINE  afin de justifier ces opérations. Nous vous remercions pour votre fidélité.`;

        try {
            return sendSMSFromBCIServer(phone, body);
        } catch (error) {
            logger.error(`Error during send sms sendSMSToVisaDepassementClient to ${phone}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },
    sendEmailCreation: async (validators: any[], user: User) => {
        try {
            const profil = user.category === 100 ? 'utilisateur' : user.category === 500 ? 'agent BCI' : 'administrateur';

            for (const validator of validators) {
                const HtmlBody = notificationHelper.generateMailUserValidator(validator, user)
                const subject = `Création d'un nouvel ${profil} le ${moment().format('DD/MM/YYYY')}`;
                const receiver = `${validator?.email}`;
                sendEmail(receiver, subject, HtmlBody);
            }

        } catch (error) {
            // logger.error(`Error during  sendEmailWelcome to ${user.email}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

    sendEmailAddCompany: async (administrators: any[], company: any) => {

        try {
            for (const administrator of administrators) {
                const HtmlBody = notificationHelper.generateMailContentAddCompany(administrator, company);
                const subject = `Création d'une nouvelle compagnie le ${moment().format('DD/MM/YYYY, HH:mm:ss ')}`;
                const receiver = `${administrator?.email}`;
                sendEmail(receiver, subject, HtmlBody);
            }
        } catch (error) {
            logger.error(`Error during  sendEmailWelcome to ${company.email}. \n ${error.message} \n${error.stack}`);
            return error;
        }
    },

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

    sendEamailRejectStep: async (data: any, email: string) => {

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








