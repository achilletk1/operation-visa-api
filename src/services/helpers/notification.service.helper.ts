import  readFilePromise from 'fs-readfile-promise';
import  handlebars from 'handlebars';
import { logger } from '../../winston';
import { config } from '../../config';
import { get } from 'lodash';
import { RequestCeilingIncrease } from '../../models/request-ceiling-increase';
import { commonService } from '../common.service';
import moment = require('moment');

let templateVisaDepassment: any;
let templateDetectTravel: any;
let templateRejectStep: any;
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

(async () => {
    templateVisaDepassment = await readFilePromise(__dirname + '/templates/visa-depassment-mail.template.html', 'utf8');
    templateDetectTravel = await readFilePromise(__dirname + '/templates/travel-detect-mail.template.html', 'utf8');
    templateRejectStep = await readFilePromise(__dirname + '/templates/travel-reject-step.template.html', 'utf8');
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

})();

const actionUrl = `${config.get('baseUrl')}/home`;

export const generateMailVisaDepassment = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            start: `${get(info, `start`)}`,
            total: `${get(info, `total`)}`,
            ceilling: `${get(info, `ceilling`)}`,
            created: `${get(info, 'created')}`,
            link: `${get(info, 'link')}`,
            actionUrl
        }

        const template = handlebars.compile(templateVisaDepassment);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html visa depassement mail generation failed. \n${error.name}\n${error.stack}`);
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

        const template = handlebars.compile(templateVisaDepassment);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html visa depassement mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};

export const generateMailTravelDetect = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            start: `${get(info, `start`)}`,
            card: `${get(info, `card`)}`,
            created: `${get(info, 'created')}`,
            actionUrl
        }

        const template = handlebars.compile(templateDetectTravel);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html travel detected mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};


export const generateMailTravelDeclaration = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            start: `${get(info, `start`)}`,
            end: `${get(info, `end`)}`,
            created: `${get(info, 'created')}`,
            ceiling: `${get(info, 'ceiling')}`,
            actionUrl
        }

        const template = handlebars.compile(templateDetectTravel);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html travel detected mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};


export const generateMailRejectStep = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            start: `${get(info, `start`)}`,
            step: `${get(info, `step`)}`,
            reason: `${get(info, 'reason')}`,
            link: `${get(info, 'link')}`,
            actionUrl
        }

        const template = handlebars.compile(templateRejectStep);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html visa depassement mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }
}

export const generateMailContentRequestCeiling = (ceiling: RequestCeilingIncrease) => {

    try {
        const userFullName = `${get(ceiling?.user, 'fullName', '')}`;
        const data = {
            greetings: `Bonjour ${userFullName},`,
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
        const data = {
            greetings: `Bonjour ,`,
            userFullName: `${userFullName}`,
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
    try {

        const data = {
            greetings: `Bonjour ${userFullName},`,
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
    try {

        const data = {
            greetings: `Bonjour ${assignedCae},`,
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

        const data = {
            greetings: `Bonjour ${userFullName},`,
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
        const data = {
            greetings: `Bonjour ${userFullName},`,
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

export const generateVisaTemplate = async (content: any, userData: any, isTest?: boolean) => {
    try {
        const data = replaceVariables(content, {
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

export const generateVisaTemplateForNotification = async (content: any, userData: any, isTest?: boolean) => {
    try {
        const data = replaceVariables(content?.email?.french, {
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

const formatVisaTemplate = (content: any) => {
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
};
export const generateOnlinePayementDeclarationMail = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            ceiling: `${get(info, 'ceiling')}`,
            created: `${get(info, 'created')}`,
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