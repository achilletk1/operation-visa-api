import { RequestCeilingIncrease } from '../../models/request-ceiling-increase';
import readFilePromise from 'fs-readfile-promise';
import { commonService } from '../common.service';
import * as formatHelper from './format.helper';
import { pdf } from '../pdf-generator.service';
import { User } from '../../models/user';
import { logger } from '../../winston';
import { config } from '../../config';
import handlebars from 'handlebars';
import moment = require('moment');
import { get } from 'lodash';


let templateVisaMail: any;
let templateStepStatus: any;
let templateDeclaration: any;
let templateRequestCeiling: any;
let templateRequestCeilingBank: any;
let templateAppointmentCreatedBank: any;
let templateCeilingAssigned: any;
let templateCaeAssigned: any;
let templateRejectCeiling: any;
let templateValidCeiling: any;
let templateVisaOpe: any;
let templateOnlinePayement: any;
let templateOnlinePayementStatus: any;
let templateTravelStatus: any;
let templateValidationTokenMail: any;
let templateValidationRequired: any;
let templateContainBlockedUser: any;

(async () => {
    templateVisaMail = await readFilePromise(__dirname + '/templates/visa-mail.template.html', 'utf8');
    templateStepStatus = await readFilePromise(__dirname + '/templates/travel-reject-step.template.html', 'utf8');
    templateDeclaration = await readFilePromise(__dirname + '/templates/travel-declaration-mail.template.html', 'utf8');
    templateRequestCeiling = await readFilePromise(__dirname + '/templates/request-ceiling-mail.template.html', 'utf8');
    templateRequestCeilingBank = await readFilePromise(__dirname + '/templates/request-ceiling-bank-mail.template.html', 'utf8');
    templateAppointmentCreatedBank = await readFilePromise(__dirname + '/templates/request-created-bank-mail.template.html', 'utf8');
    templateCeilingAssigned = await readFilePromise(__dirname + '/templates/ceiling-assigned.template.html', 'utf8');
    templateCaeAssigned = await readFilePromise(__dirname + '/templates/cae-assigned.template.html', 'utf8');
    templateRejectCeiling = await readFilePromise(__dirname + '/templates/request-ceiling-mail-reject.template.html', 'utf8');
    templateValidCeiling = await readFilePromise(__dirname + '/templates/request-ceiling-mail-validation.template.html', 'utf8');
    templateVisaOpe = await readFilePromise(__dirname + '/templates/formal-notice-template-mail.template.html', 'utf8');
    templateOnlinePayement = await readFilePromise(__dirname + '/templates/online-payment-declaration-mail.template.html', 'utf8');
    templateOnlinePayementStatus = await readFilePromise(__dirname + '/templates/online-payment-status-changed-mail.template.html', 'utf8');
    templateTravelStatus = await readFilePromise(__dirname + '/templates/travel-status-changed-mail.template.html', 'utf8');
    templateValidationTokenMail = await readFilePromise(__dirname + '/templates/validation-token-mail.template.html', 'utf8');
    templateValidationRequired = await readFilePromise(__dirname + '/templates/validation-required-mail.template.html', 'utf8');
    templateContainBlockedUser = await readFilePromise(__dirname + '/templates/contain-blocked-user-template-mail.template.html', 'utf8');
})();

const actionUrl = `${config.get('baseUrl')}/home`;
const image = `${config.get('template.image')}`;
const color = `${config.get('template.color')}`;
const app = `${config.get('template.app')}`;
const company = `${config.get('template.company')}`;

export const generateMailByTemplate = (content: any) => {

    try {

        const data = {
            ...content,
            actionUrl,
            civility: `Mr/Mme`,
        }

        const template = handlebars.compile(templateVisaMail);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`Html visa depassement mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};

export const generateMailFormalNotice = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            actionUrl
        }

        const template = handlebars.compile(templateVisaMail);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html visa depassement mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};



export const generateMailTravelDeclaration = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            ceiling: `${get(info, 'ceiling')}`,
            start: `${moment(+get(info, `start`)).startOf('day').format('DD/MM/YYYY')}`,
            end: `${moment(+get(info, 'end')).endOf('day').format('DD/MM/YYYY')}`,
            created: `${moment(+get(info, 'created')).format('DD/MM/YYYY:HH:mm')}`,
            actionUrl
        }

        const template = handlebars.compile(templateDeclaration);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html travel detected mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};


export const generateMailStatusChanged = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            start: `${get(info, `start`)}`,
            end: `${get(info, `end`)}`,
            // end: `${get(info, `end`)}`,
            step: `${get(info, `step`)}`,
            reason: `${get(info, 'reason')}`,
            rejected: `${get(info, 'rejected')}`,
            status: `${get(info, 'status')}`,

            link: `${get(info, 'link')}`,
            actionUrl
        }

        const template = handlebars.compile(templateStepStatus);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html visa status of step mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }
}

export const generateMailContentRequestCeiling = (ceiling: RequestCeilingIncrease) => {

    try {
        const userFullName = `${get(ceiling?.user, 'fullName', '')}`;
        const gender = `${get(ceiling?.user, 'gender')}` === 'm' ? 'M' :
            `${get(ceiling?.user, 'gender')}` === 'f' ? 'Mme' : 'M/Mme';

        const data = {
            greetings: `Bonjour ${gender} ${userFullName},`,
            userFullName: `${userFullName}`,
            tel: `${get(ceiling?.user, 'tel', '')}`,
            email: `${get(ceiling?.user, 'email', '')}`,
            account: `${get(ceiling?.account, 'ncp', '')}`,
            accountType: `${get(ceiling?.account, 'inti', '')}`,
            transactionType: ceiling?.currentCeiling.type === 200 ? 'PAIEMENT INTERNET' : 'PAIEMENT TPE ,RETRAIT DAB',
            currCeiling: `${commonService.formatNumber(get(ceiling?.currentCeiling, 'amount', ''))} XAF`,
            desiredCeiling: `${commonService.formatNumber(get(ceiling?.desiredCeiling, 'amount', ''))} XAF`,
            actionUrl
        }

        const template = handlebars.compile(templateRequestCeiling);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html welcome mail generation failed.',
            'services.helper.notification.generateMailContentWelcome()',
            error
        );
        return error;
    }

};

export const generateMailContentCeilingRequestBank = (ceiling: any) => {
    try {
        const userFullName = `${get(ceiling?.user, 'fullName', '')}`;
        const gender = `${get(ceiling?.user, 'gender')}` === 'm' ? 'M' :
            `${get(ceiling?.user, 'gender')}` === 'f' ? 'Mme' : 'M/Mme';
        const data = {
            greetings: `Bonjour ${gender} ${userFullName},`,
            tel: `${get(ceiling?.user, 'tel', '')}`,
            email: `${get(ceiling?.user, 'email', '')}`,
            clientCode: `${get(ceiling?.user, 'clientCode', '')}`,
            account: `${get(ceiling?.account, 'ncp', '')}`,
            ageCode: `${get(ceiling?.account, 'age', '')}`,
            accountType: `${get(ceiling?.account, 'inti', '')}`,
            transactionType: ceiling?.currentCeiling.type === 200 ? 'PAIEMENT INTERNET' : 'PAIEMENT TPE ,RETRAIT DAB',
            currCeiling: `${commonService.formatNumber(get(ceiling?.currentCeiling, 'amount', ''))} XAF`,
            desiredCeiling: `${commonService.formatNumber(get(ceiling?.desiredCeiling, 'amount', ''))} XAF`,
            actionUrl
        }
        const template = handlebars.compile(templateRequestCeilingBank);
        const html = template(data);
        return html;
    } catch (error) {
        logger.error(
            'html welcome mail generation failed.',
            'services.helper.notification.generateMailContentWelcome()',
            error
        );
        return error;
    }

};
export const generateMailContentAppointmentBank = (request) => {

    try {

        const data = {
            greetings: `Bonjour ${get(request, 'manager', '')},`,
            request_age: `${get(request, 'age.NOM_AGENCE', '')}`,
            manager: `${get(request, 'cae.fname', '')}` + ' ' + `${get(request, 'cae.lname', '')}`,
            lname: `${get(request, 'user.lname', '')}`,
            fname: `${get(request, 'user.fname', '')}`,
            reason: `${get(request, 'reason', '')}`,
            desc: `${get(request, 'desc', '')}`,
            appointmentDate: `${moment(get(request, 'appointmentDate', '')).startOf('day').format("dddd")},` + `${moment(get(request, 'appointmentDate', '')).startOf('day').format('DD/MM/YYYY')}`,
            appointmentHour: `${get(request, 'appointmentHour', '')}`,
            actionUrl
        }

        const template = handlebars.compile(templateAppointmentCreatedBank);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html appointment mail generation failed.',
            'services.helper.notification.generateMailContentAppointmentBank()',
            error
        );
        return error;
    }

}

export const generateMailContentCeilingAssigned = (ceiling: any, userAssigned: any) => {
    const { fname, lname, tel, email } = userAssigned;
    const userFullName = `${get(ceiling, 'user?.fullName', '')}`;
    const gender = `${get(ceiling?.user, 'gender')}` === 'm' ? 'M' :
        `${get(ceiling?.user, 'gender')}` === 'f' ? 'Mme' : 'M/Mme';
    try {
        const data = {
            greetings: `Bonjour ${gender} ${userFullName},`,
            date: moment(ceiling?.date?.assigned).format('DD/MM/YYYY'),
            hour: moment(ceiling?.date?.assigned).format('HH:mm'),
            assignered: `${fname} ${lname}`,
            tel: `${tel}`,
            email: `${email}`,
            actionUrl
        }

        const template = handlebars.compile(templateCeilingAssigned);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html ceiling assigned mail generation failed.',
            'services.helper.notification.generateMailContentCeilingAssigned()',
            error
        );
        return error;
    }

};

export const generateMailContentCaeAssigned = (ceiling: any, userAssigned: any) => {

    const assignedCae = `${get(userAssigned, 'fname', '')} ${get(userAssigned, 'lname', '')}`;
    const fullName = ceiling?.user?.fullName;
    const gender = `${get(userAssigned, 'gender')}` === 'm' ? 'M' :
        `${get(userAssigned, 'gender')}` === 'f' ? 'Mme' : 'M/Mme';
    try {

        const data = {
            greetings: `Bonjour ${gender} ${assignedCae},`,
            date: moment(ceiling?.date?.assigned).format('DD/MM/YYYY'),
            hour: moment(ceiling?.date?.assigned).format('HH:mm'),
            userFullName: fullName,
            currCeiling: `${commonService.formatNumber(get(ceiling?.currentCeiling, 'amount', ''))} XAF`,
            requiredCeiling: `${commonService.formatNumber(get(ceiling?.desiredCeiling, 'amount', ''))} XAF`,
            transactionType: ceiling?.currentCeiling.type === 200 ? 'PAIEMENT INTERNET' : 'PAIEMENT TPE ,RETRAIT DAB',
            clientCode: ceiling?.user?.clientCode,
            tel: ceiling?.user?.tel,
            email: ceiling?.user?.email,
            actionUrl
        }

        const template = handlebars.compile(templateCaeAssigned);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html ceiling assigned mail generation failed.',
            'services.helper.notification.generateMailContentCeilingAssigned()',
            error
        );
        return error;
    }
};

export const generateMailRejectCeiling = (ceiling: any) => {
    try {
        const userFullName = `${get(ceiling?.user, 'fullName', '')}`;
        const reason = ceiling?.validator?.rejectReason;
        const gender = `${get(ceiling?.user, 'gender')}` === 'm' ? 'M' :
            `${get(ceiling?.user, 'gender')}` === 'f' ? 'Mme' : 'M/Mme';

        const data = {
            greetings: `Bonjour ${gender} ${userFullName},`,
            userFullName: `${userFullName}`,
            clientCode: `${get(ceiling, 'user.clientCode', '')}`,
            account: `${get(ceiling?.account, 'ncp', '')}`,
            accountType: `${get(ceiling?.account, 'inti', '')}`,
            currCeiling: `${commonService.formatNumber(get(ceiling?.currentCeiling, 'amount', ''))} XAF`,
            desiredCeiling: `${commonService.formatNumber(get(ceiling?.desiredCeiling, 'amount', ''))} XAF`,
            transactionType: ceiling?.currentCeiling.type === 200 ? 'PAIEMENT INTERNET' : 'PAIEMENT TPE ,RETRAIT DAB',
            rejectReason: `${reason}`,
            actionUrl
        }

        const template = handlebars.compile(templateRejectCeiling);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html welcome mail generation failed.',
            'services.helper.notification.generateMailContentReject()',
            error
        );
        return error;
    }

};

export const generateMailValidCeiling = (ceiling: any) => {

    try {

        const userFullName = `${get(ceiling?.user, 'fullName', '')}`;
        const gender = `${get(ceiling?.user, 'gender')}` === 'm' ? 'M' :
            `${get(ceiling?.user, 'gender')}` === 'f' ? 'Mme' : 'M/Mme';

        const data = {
            greetings: `Bonjour ${gender} ${userFullName},`,
            userFullName: `${userFullName}`,
            clientCode: `${get(ceiling, 'user.clientCode', '')}`,
            account: `${get(ceiling?.account, 'ncp', '')}`,
            accountType: `${get(ceiling?.account, 'inti', '')}`,
            currCeiling: `${commonService.formatNumber(get(ceiling?.currentCeiling, 'amount', ''))} XAF`,
            desiredCeiling: `${commonService.formatNumber(get(ceiling?.desiredCeiling, 'amount', ''))} XAF`,
            transactionType: ceiling?.currentCeiling.type === 200 ? 'PAIEMENT INTERNET' : 'PAIEMENT TPE ,RETRAIT DAB',
            actionUrl
        }

        const template = handlebars.compile(templateValidCeiling);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html welcome mail generation failed.',
            'services.helper.notification.generateMailContentWelcome()',
            error
        );
        return error;
    }

};


export const generateVisaTemplateForNotification = async (content: any, userData: any, isTest?: boolean) => {
    try {
        const data = formatHelper.replaceVariables(content?.email?.french, {
            ...userData, 'SYSTEM_TODAY_LONG': moment().locale('fr'),
            'SYSTEM_TODAY_SHORT': moment().format('dd/MM/YYYY'),
        }, isTest);
        const temlateData = formatVisaTemplate(data);
        const template = handlebars.compile(templateVisaOpe);
        const html = template(temlateData);
        return html;
    } catch (error) {
        logger.error(`\nPreview  template mail  generation failed ${JSON.stringify(error)}`);
        return error;
    }
};

export const generateMailContentValidationToken = (user: User, authToken: any) => {

    try {

        const data = {
            greetings: `Bonjour ${get(user, 'fname', '')} ${get(user, 'lname', '')},`,
            token: `${authToken.value}`,
            actionUrl,
            image,
            color,
            app,
            company
        }

        const template = handlebars.compile(templateValidationTokenMail);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html content auth token generation failed.\n${error.message} \n ${error.stack}`);
        return error;
    }


}

const formatVisaTemplate = (content: any) => {
    const data = {
        objectText: get(content, 'object', ''),
        bodyText: `${get(content, 'content', '')}`
    }

    return data;
};

export const generateOnlinePayementDeclarationMail = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            ceiling: `${get(info, 'ceiling')}`,
            created: `${moment(get(info, 'created')).format('DD/MM/YYYY:HH:mm')}`,
            actionUrl
        }

        const template = handlebars.compile(templateOnlinePayement);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`Html online Payement detected mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};

export const generateOnlinePayementStatusChangedMail = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            ceiling: `${get(info, 'ceiling')}`,
            date: `${get(info, 'date')}`,
            status: `${get(info, 'status')}`,
            actionUrl
        }

        const template = handlebars.compile(templateOnlinePayementStatus);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`Html online Payement detected mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};

export const generateTravelStatusChangedMail = (info: any) => {

    try {
        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            start: `${get(info, 'start')}`,
            end: `${get(info, 'end')}`,
            status: `${get(info, 'status')}`,
            actionUrl
        }

        const template = handlebars.compile(templateTravelStatus);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`Html online Payement detected mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};


export const generateValidationRequiredMail = (info: any) => {

    try {
        const data = {
            ...info,
            civility: 'Mr/Mme',
            image,
            actionUrl
        }

        const template = handlebars.compile(templateValidationRequired);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`Html online Payement detected mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};

//generated mail contain blocked user
export const generateMailContainBlockedUser = async (usersList:any[]) => {
    try {
        const data = {
            greetings: `Bonjour`,
            date: moment().format('DD/MM/YYYY'),
            usersList,
            image,
            color,
            app,
            company,
            actionUrl,
        }

        const template = handlebars.compile(templateContainBlockedUser);

        const html = template(data);

        return html;
    } catch (error) {
        logger.error(`\nPreview  template mail contain blocked user generation failed ${JSON.stringify(error)}`);
        return error;
    }
};