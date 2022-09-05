import * as readFilePromise from 'fs-readfile-promise';
import { commonService } from '../common.service';
import * as handlebars from 'handlebars';
import { User } from '../../models/user';
import { logger } from '../../winston';
import { config } from '../../config';
import * as moment from 'moment';
import { get } from 'lodash';

let templateWelcome: any;
let templatePwdReseted: any;
let templateOTPMail: any;
let templateAuthTokenMail: any;
let templateTransaction: any;
let templateGimacTransaction: any;
let templateIncommingTransaction: any;
let templateAppointmentCreatedClient: any;
let templateAppointmentCreatedBank: any;
let templateFeedBackCreatedClient: any;
let templateSuggestionsCreatedClient: any;
let templateFeedBackCreatedBank: any;
let templateSuggestionsCreatedBank: any;
let templateCheckbookCreatedClient: any;
let templateCardRequestClient: any;
let templateCardRequestBank: any;
let templateCheckbookCreatedBank: any;
let templateFeedBackAssigned: any;
let templateFeedBackResolved: any;
let templateStatusChange: any;
let templateInvoiceMailCompany: any;
let templateInvoiceMailDistributor: any;
let templateActivationPermanentTransfer: any;
let templateMailRejected: any;
let templateGimacClaim: any;
let templateRequestCeilingBank: any;
let templateValidCeiling: any;
let templateRejectCeiling: any;
let templateCeilingAssigned: any;
let templateCeilingNotification: any;
let templateCeilingNotificationAssign: any;
let templateCaeAssigned: any;

let templateErrorPostTransactionFile: any;
let templateVisaDepassment: any;
let templateRejectAttachement: any;

let templateMailAddCompany: any;
let templateWelcomeAdminValidate: any;
let templateDailyReportPUSHPULL: any;



(async () => {
    // templateWelcome = await readFilePromise(__dirname + '/templates/welcome-mail.template.html', 'utf8');
    // templatePwdReseted = await readFilePromise(__dirname + '/templates/pwd-reseted-mail.template.html', 'utf8');
    // templateOTPMail = await readFilePromise(__dirname + '/templates/otp-mail.template.html', 'utf8');
    // templateAuthTokenMail = await readFilePromise(__dirname + '/templates/auth-token-mail.template.html', 'utf8');
    // templateTransaction = await readFilePromise(__dirname + '/templates/transaction-mail.template.html', 'utf8');
    // templateGimacTransaction = await readFilePromise(__dirname + '/templates/transaction-gimac-mail.template.html', 'utf8');
    // templateIncommingTransaction = await readFilePromise(__dirname + '/templates/transaction-incomming-mail.template.html', 'utf8');
    // templateAppointmentCreatedClient = await readFilePromise(__dirname + '/templates/request-created-mail.template.html', 'utf8');
    // templateAppointmentCreatedBank = await readFilePromise(__dirname + '/templates/request-created-bank-mail.template.html', 'utf8');
    // templateCardRequestClient = await readFilePromise(__dirname + '/templates/request-card-client.template.html', 'utf8');
    // templateCardRequestBank = await readFilePromise(__dirname + '/templates/request-card-bank.template.html', 'utf8');
    // templateActivationPermanentTransfer = await readFilePromise(__dirname + '/templates/ativation-permanent-transfer.template.html', 'utf8');
    // templateMailRejected = await readFilePromise(__dirname + '/templates/rejected-permanent-transfer.template.html', 'utf8');
    // templateCheckbookCreatedClient = await readFilePromise(__dirname + '/templates/checkbook-created.template.html', 'utf8');
    // templateCheckbookCreatedBank = await readFilePromise(__dirname + '/templates/checkbook-created-bank.template.html', 'utf8');
    // templateFeedBackCreatedClient = await readFilePromise(__dirname + '/templates/feedBack-created.template.html', 'utf8');
    // templateSuggestionsCreatedClient = await readFilePromise(__dirname + '/templates/suggestions-created.template.html', 'utf8');
    // templateFeedBackCreatedBank = await readFilePromise(__dirname + '/templates/feedBack-created-bank.template.html', 'utf8');
    // templateSuggestionsCreatedBank = await readFilePromise(__dirname + '/templates/suggestions-created-bank.template.html', 'utf8');
    // templateFeedBackAssigned = await readFilePromise(__dirname + '/templates/feedBack-assigned.template.html', 'utf8');
    // templateFeedBackResolved = await readFilePromise(__dirname + '/templates/feedBack-resolved.template.html', 'utf8');
    // templateStatusChange = await readFilePromise(__dirname + '/templates/request-status-change-mail.template.html', 'utf8');
    // templateInvoiceMailCompany = await readFilePromise(__dirname + '/templates/invoice-mail-company.template.html', 'utf8');
    // templateInvoiceMailDistributor = await readFilePromise(__dirname + '/templates/invoice-mail.template.html', 'utf8');
    // templateGimacClaim = await readFilePromise(__dirname + '/templates/request-claim-gimac.template.html', 'utf8');
    // templateRequestCeilingBank = await readFilePromise(__dirname + '/templates/request-ceiling-bank-mail.template.html', 'utf8');
    // templateValidCeiling = await readFilePromise(__dirname + '/templates/request-ceiling-mail-validation.template.html', 'utf8');
    // templateRejectCeiling = await readFilePromise(__dirname + '/templates/request-ceiling-mail-reject.template.html', 'utf8');
    // templateCeilingAssigned = await readFilePromise(__dirname + '/templates/ceiling-assigned.template.html', 'utf8');
    // templateCeilingNotification = await readFilePromise(__dirname + '/templates/ceiling-notification.template.html', 'utf8');
    // templateCeilingNotificationAssign = await readFilePromise(__dirname + '/templates/ceiling-notification-assign.template.html', 'utf8');
    // templateCaeAssigned = await readFilePromise(__dirname + '/templates/cae-assigned.template.html', 'utf8');
    // templateErrorPostTransactionFile = await readFilePromise(__dirname + '/templates/error-post-transaction-file-mail.template.html', 'utf8');
    // templateRejectAttachement = await readFilePromise(__dirname + "/templates/reject-attachement-mail.template.html", "utf8");
    // templateVisaDepassment = await readFilePromise(__dirname + '/templates/visa-depassment-mail.template.html', 'utf8');
    // templateWelcomeAdminValidate = await readFilePromise(__dirname + '/templates/welcom-email-validate.template.html', 'utf8');
    // templateMailAddCompany = await readFilePromise(__dirname + '/templates/welcom-mail-add-company.template.html', 'utf8');
    // templateDailyReportPUSHPULL = await readFilePromise(__dirname + '/templates/mtn/daily-report-transaction-mail.template.html', 'utf8');

})();

const actionUrl = `${config.get('baseUrl')}/home`;

export const generateMailContentWelcome = (user, password) => {

    try {

        const userFullName = `${get(user, 'fname', '')} ${get(user, 'lname', '')}`;
        const data = {
            greetings: `Bonjour ${userFullName},`,
            userCode: `${get(user, 'userCode', '')}`,
            password: `${password}`,
            actionUrl
        }

        const template = handlebars.compile(templateWelcome);

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


}

export const generateMailContentAddCompany = (administrator: any, company: any) => {
    try {
        const adminFullName = `${get(administrator, 'fname', '')} ${get(administrator, 'lname', '')}` || administrator?.fullName;
        const companyName = `${get(company, 'name')}`;
        const clientCode = `${get(company, 'clientCode', '')}`
        const category = `${get(company, 'category.label', '')}`

        // const reason = user?.validation?.validators[0].rejectReason
        const data = {
            greetings: `Bonjour ${adminFullName},`,
            companyName: `${companyName}`,
            clientCode: `${clientCode}`,
            profil: `${category}`,
            actionUrl
        }

        const template = handlebars.compile(templateMailAddCompany);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html welcome mail generation failed.',
            'services.helper.notification.generateMailContentAddCompany()',
            error
        );
        return error;
    }

}

export const generateMailUserValidator = (validator: any, user: any) => {

    try {

        const validatorFullName = `${get(validator, 'fname', '')} ${get(validator, 'lname', '')}` || validator?.fullName;
        const userFullName = `${get(user, 'fname', '')} ${get(user, 'lname', '')}` || user?.fullName;
        const clientCode = `${get(user, 'clientCode', '')}`
        const data = {
            greetings: `Bonjour ${validatorFullName},`,
            clientCode: `${clientCode}`,
            userName: `${userFullName}`,
            profil: user.category === 100 ? 'Utilisateur' : user.category === 500 ? 'Agent BCI' : 'Administrateur',
            actionUrl
        }

        const template = handlebars.compile(templateWelcomeAdminValidate);

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


}

export const generateMailContentPwdReseted = (user, password) => {

    try {

        const userFullName = `${get(user, 'fname', '')} ${get(user, 'lname', '')}`;
        const data = {
            greetings: `Bonjour ${userFullName},`,
            userCode: `${get(user, 'userCode', '')}`,
            password: `${password}`,
            actionUrl
        }

        const template = handlebars.compile(templatePwdReseted);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html PwdReseted mail generation failed.',
            'services.helper.notification.generateMailContentPwdReseted()',
            error
        );
        return error;
    }


}

export const generateMailContentOTP = (invoice: any) => {

    try {

        const data = {
            greetings: `Bonjour ${get(invoice, 'user.fname', '')} ${get(invoice, 'user.lname', '')},`,
            opt: `${get(invoice, 'otp.value', '')}`,
            invoice_ref: `${get(invoice, 'internalRef', '')}`,
            actionUrl
        }

        const template = handlebars.compile(templateOTPMail);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html otp mail generation failed.',
            'services.helper.invoice.generateMailContentOTP()',
            error
        );
        return error;
    }


}

export const generateMailContentAuthToken = (user: User, authToken: any) => {

    try {

        const data = {
            greetings: `Bonjour ${get(user, 'fname', '')} ${get(user, 'lname', '')},`,
            token: `${authToken.value}`,
            actionUrl
        }

        const template = handlebars.compile(templateAuthTokenMail);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html auth token mail generation failed.',
            'services.helper.invoice.generateMailContentAuthToken()',
            error
        );
        return error;
    }


}

// export const generateMailContentTransactionConfirm = (transfer: any) => {

//     try {

//         const data = {
//             greetings: `Bonjour ${get(transfer.originator, 'fname', '')},`,
//             debitNcp: `${get(transfer.originator, 'ncp', '')}`,
//             age: `${get(transfer.originator, 'age', '')}`,
//             amount: `${getNumberWithSpaces(get(transfer, 'amount', ''))}`,
//             transferDay: `${get(transfer, 'transferDay', '')}`,
//             creditNcp: `${get(transfer.beneficiary, 'ncp', '')}`,
//             date: `${moment().format('DD/MM/YYYY')}`,
//             dateActivation: `${moment(get(transfer.dates, 'created', 0)).format('DD/MM/YYYY')}`,
//             actionUrl
//         }

//         const template = handlebars.compile(templateTransaction);

//         const html = template(data);

//         return html;

//     } catch (error) {
//         logger.error(`html rejected transfer mail generation failed.${error}`);
//         return error;
//     }

// }

export const generateMailContentTransactionConfirm = (transaction: any, sens: string) => {
    try {

        const data = {
            account: `${get(transaction, 'originator.ncp', '')}`,
            age: `${get(transaction, 'originator.age', '')}`,
            paymentDate: moment(get(transaction, 'dates.paid', 0)).format('DD/MM/YYYY'),
            paymentHour: moment(get(transaction, 'dates.paid', 0)).format('HH:mm'),
            originator: `${get(transaction, 'beneficiary.walletRecipient.providerName', '') || get(transaction, 'originator.walletRecipient.providerName', '')}`,
            total: `${getNumberWithSpaces(get(transaction, 'amounts.amount', 0))} XAF`,
            actionUrl
        };
        if (transaction?.type === 302) {
            data.account = `${get(transaction, 'beneficiary.ncp', '')}`;
            data.age = `${get(transaction, 'beneficiary.age.code', '')}`
        };
        if (transaction?.type === 301) {
            data.account = `${get(transaction, 'originator.ncp', '')}`;
            data.age = `${get(transaction, 'originator.age', '')}`
        };
        const template = handlebars.compile(templateTransaction);

        const html = template(data);
        return html;

    } catch (error) {
        logger.error(
            'html transaction mail generation failed.',
            'services.helper.transaction.generateMailContentTransactionConfirm()',
            error
        );
        return error;
    }

}

export const generateMailContentAppointmentClient = (request) => {

    try {

        const data = {
            greetings: `Bonjour ${get(request, 'user.fname', '')},`,
            request_age: `${get(request, 'age.NOM_AGENCE', '')}`,
            manager: `${get(request, 'cae.fname', '')}` + ' ' + `${get(request, 'cae.lname', '')}`,
            reason: `${get(request, 'reason', '')}`,
            desc: `${get(request, 'desc', '')}`,
            appointmentDate: `${moment(get(request, 'appointmentDate', '')).startOf('day').format("dddd")},` + `${moment(get(request, 'appointmentDate', '')).format('DD/MM/YYYY')}`,
            appointmentHour: `${get(request, 'appointmentHour', '')}`,
            actionUrl
        }

        const template = handlebars.compile(templateAppointmentCreatedClient);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html appointment mail generation failed.',
            'services.notification.generateMailContentAppointmentClient()',
            error
        );
        return error;
    }

}

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

export const generateMailContentCardRequestClient = (request) => {

    try {

        const data = {
            greetings: `Bonjour ${get(request, 'user.fname', '')},`,
            card_type: `${get(request, 'cardType.label', '')}`,
            ncp: `${get(request, 'ncp', '')}`,
            card_holder: `${get(request, 'cardHoldername', '')}`,
            actionUrl
        }

        const template = handlebars.compile(templateCardRequestClient);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html card mail generation failed.',
            'services.helper.notification.generateMailContentCardRequestClient()',
            error
        );
        return error;
    }

}

export const generateMailContentCardRequestBank = (request) => {

    try {

        const data = {
            greetings: `Bonjour ${get(request, '', '')},`,
            lname: `${get(request, 'user.lname', '')}`,
            fname: `${get(request, 'user.fname', '')}`,
            card_type: `${get(request, 'cardType.label', '')}`,
            ncp: `${get(request, 'ncp', '')}`,
            card_holder: `${get(request, 'cardHoldername', '')}`,
            actionUrl
        }
        const template = handlebars.compile(templateCardRequestBank);
        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html card mail generation failed.',
            'services.helper.notification.generateMailContentCardRequestBank()',
            error
        );
        return error;
    }

}

export const generateMailContentcheckbookClient = (request) => {

    try {

        const data = {
            greetings: `Bonjour ${get(request, 'user.fname', '')},`,
            // request_age: `${get(request, 'age.label', '')}`,
            ncp: `${get(request, 'account.ncp', '')}`,
            pageNumber: `${get(request, 'pageNumber', '')}`,
            actionUrl
        }

        const template = handlebars.compile(templateCheckbookCreatedClient);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html checkbook mail generation failed.',
            'services.helper.notification.generateMailContentcheckbookClient()',
            error
        );
        return error;
    }

}

export const generateMailContentcheckbookBank = (request) => {

    try {

        const data = {
            greetings: `Bonjour ${get(request, '', '')},`,
            // request_age: `${get(request, 'age.label', '')}`,
            lname: `${get(request, 'user.lname', '')}`,
            fname: `${get(request, 'user.fname', '')}`,
            ncp: `${get(request, 'account.ncp', '')}`,
            pageNumber: `${get(request, 'pageNumber', '')}`,
            actionUrl
        }

        const template = handlebars.compile(templateCheckbookCreatedBank);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html checkbook mail generation failed.',
            'services.helper.notification.generateMailContentcheckbookBank()',
            error
        );
        return error;
    }

}

export const generateMailContentFeedBackCreatedClient = (feedBack) => {

    try {

        const userFullName = `${get(feedBack, 'user.fname', '')} ${get(feedBack, 'user.lname', '')}`;
        const data = {
            greetings: `Bonjour ${userFullName},`,
            reference: `${feedBack.internalRef}`,
            date: moment(feedBack.dates.paid).format('DD/MM/YYYY'),
            hour: moment(feedBack.dates.paid).format('HH:mm'),
            category: `${feedBack.category}`,
            object: `${feedBack.object}`,
            message: `${feedBack.msg}`,
            actionUrl
        }

        const template = handlebars.compile(templateFeedBackCreatedClient);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html feedback created mail generation failed.',
            'services.helper.notification.generateMailContentFeedBackCreated()',
            error
        );
        return error;
    }


}

export const generateMailContentSuggestionsCreatedClient = (suggestion: any) => {

    try {
        const userFullName = `${get(suggestion, 'user.fname', '')} ${get(suggestion, 'user.lname', '')}`;
        const data = {
            greetings: `Bonjour ${userFullName},`,
            date: moment(suggestion.dates.created).format('DD/MM/YYYY'),
            hour: moment(suggestion.dates.created).format('HH:mm'),
            category: `${suggestion.category}`,
            object: `${suggestion.object}`,
            message: `${suggestion.msg}`,
            actionUrl
        }
        const template = handlebars.compile(templateSuggestionsCreatedClient);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html sugggestions created mail generation failed.',
            'services.helper.notification.generateMailContentSugggestionsCreated()',
            error
        );
        return error;
    }


}

export const generateMailContentFeedBackCreatedBank = (feedBack) => {

    try {

        const client = `${get(feedBack, 'user.fname', '')} ${get(feedBack, 'user.lname', '')}`;
        const email = `${get(feedBack, 'user.email', '')}`;
        const data = {
            client,
            email,
            reference: `${feedBack?.internalRef}`,
            date: moment(feedBack?.dates?.paid).format('DD/MM/YYYY'),
            hour: moment(feedBack?.dates?.paid).format('HH:mm'),
            category: `${feedBack?.category}`,
            object: `${feedBack?.object}`,
            message: `${feedBack?.msg}`,
            cli: feedBack?.user?.clientCode,
            actionUrl
        }

        const template = handlebars.compile(templateFeedBackCreatedBank);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html feedback created Bank mail generation failed.',
            'services.helper.notification.generateMailContentFeedBackCreatedBank()',
            error
        );
        return error;
    }


}

export const generateMailContentSuggestionCreatedBank = (suggestion: any) => {

    try {

        const client = `${get(suggestion, 'user.fname', '')} ${get(suggestion, 'user.lname', '')}`;
        const email = `${get(suggestion, 'user.email', '')}`;
        const data = {
            client,
            email,
            date: moment(suggestion?.dates?.created).format('DD/MM/YYYY'),
            hour: moment(suggestion?.dates?.created).format('HH:mm'),
            category: `${suggestion?.category}`,
            object: `${suggestion?.object}`,
            message: `${suggestion?.msg}`,
            cli: suggestion?.user?.clientCode,
            actionUrl
        }

        const template = handlebars.compile(templateSuggestionsCreatedBank);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html suggestion created Bank mail generation failed.',
            'services.helper.notification.generateMailContentFeedBackCreatedBank()',
            error
        );
        return error;
    }


}

export const generateMailContentFeedBackAssigned = (feedBack, userAssigned) => {

    const { fname, lname } = userAssigned;
    const userFullName = `${get(feedBack, 'user.fname', '')} ${get(feedBack, 'user.lname', '')}`;
    try {

        const data = {
            greetings: `Bonjour ${userFullName},`,
            reference: `${feedBack.internalRef}`,
            date: moment(feedBack.dates.assigned).format('DD/MM/YYYY'),
            hour: moment(feedBack.dates.assigned).format('HH:mm'),
            assignered: `${fname} ${lname}`,
            actionUrl
        }

        const template = handlebars.compile(templateFeedBackAssigned);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html feedback assigned mail generation failed.',
            'services.helper.notification.generateMailContentFeedBackAssigned()',
            error
        );
        return error;
    }


}

export const generateMailContentFeedBackResolved = (feedBack, comment) => {

    const { fname, lname } = get(feedBack, 'assignment.assignered', {});
    const userFullName = `${get(feedBack, 'user.fname', '')} ${get(feedBack, 'user.lname', '')}`;
    try {

        const data = {
            greetings: `Bonjour ${userFullName},`,
            reference: `${feedBack.internalRef}`,
            date: moment(feedBack.dates.assigned).format('DD/MM/YYYY'),
            hour: moment(feedBack.dates.assigned).format('HH:mm'),
            assignered: `${fname} ${lname}`,
            comment,
            actionUrl
        }

        const template = handlebars.compile(templateFeedBackResolved);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html feedback resolved mail generation failed.',
            'services.helper.notification.generateMailContentFeedBackResolved()',
            error
        );
        return error;
    }


}

export const generateMailContentstatus = (request) => {

    try {

        const data = {
            greetings: `Bonjour M./Mme ${get(request.user, 'lname', '')},`,
            message: `${get(request, 'message', '')}`,
            // request: `${moment().format('DD/MM/YYYY, h:mm:ss')}`,
            actionUrl
        }

        const template = handlebars.compile(templateStatusChange);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html otp request mail generation failed.',
            'services.helper.invoice.generateMailContentstatus()',
            error
        );
        return error;
    }


}

export const generateMailContentInvoiceCompany = (invoice) => {

    try {

        let details = '';
        if (invoice.items) {
            invoice.items.forEach((item, index) => {
                details += (index !== 0) ? ', ' : '';
                details += item.label;
            });
        }


        const isSellerTelecom = get(invoice, 'seller.category') === 201;
        const isSellerFactory = get(invoice, 'seller.category') >= 202 && get(invoice, 'seller.category') <= 599;

        const data = {
            invoice_ref: `${get(invoice, 'internalRef')}`,
            buyer: `${get(invoice, 'buyer.name')}`,
            seller: `${get(invoice, 'seller.name')}`,
            paymentDate: moment(get(invoice, 'dates.paid')).format('DD/MM/YYYY'),
            paymentHour: moment(get(invoice, 'dates.paid')).format('HH:mm'),
            isSellerTelecom,
            isSellerFactory,
            details,
            rechargeNumber: isSellerTelecom ? get(invoice, 'details.rechargeNumber') : '',
            messageToSeller: isSellerFactory ? get(invoice, 'details.message') : '',
            total: `${getNumberWithSpaces(invoice.total)} XAF`,
            actionUrl
        }

        const template = handlebars.compile(templateInvoiceMailCompany);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html invoice mail generation failed.',
            'services.helper.invoice.generateMailContentInvoice()',
            error
        );
        return error;
    }

}

export const generateMailContentInvoiceDistributor = (invoice) => {

    try {

        let details = '';
        if (invoice.items) {
            invoice.items.forEach((item, index) => {
                details += (index !== 0) ? ', ' : '';
                details += item.label;
            });
        }

        const isSellerTelecom = get(invoice, 'seller.category') === 201;
        const isSellerFactory = get(invoice, 'seller.category') >= 202 && get(invoice, 'seller.category') <= 599;

        const data = {
            greetings: `Bonjour ${get(invoice, 'user.fname', '')} ${get(invoice, 'user.lname', '')},`,
            invoice_ref: `${get(invoice, 'internalRef')}`,
            buyer: `${get(invoice, 'buyer.name')}`,
            seller: `${get(invoice, 'seller.name')}`,
            paymentDate: moment(get(invoice, 'dates.paid')).format('DD/MM/YYYY'),
            paymentHour: moment(get(invoice, 'dates.paid')).format('HH:mm'),
            isSellerTelecom,
            isSellerFactory,
            details,
            rechargeNumber: isSellerTelecom ? get(invoice, 'details.rechargeNumber') : '',
            messageToSeller: isSellerFactory ? get(invoice, 'details.message') : '',
            total: `${getNumberWithSpaces(get(invoice, 'total'))} XAF`,
            actionUrl
        }

        const template = handlebars.compile(templateInvoiceMailDistributor);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html invoice mail generation failed.',
            'services.helper.invoice.generateMailContentInvoice()',
            error
        );
        return error;
    }

}

export const generateMailTransactionIncomingSuccess = (transaction: any) => {

    try {
        const { intent } = get(transaction, 'gimacBody');
        const data = {
            fullName: `${get(transaction, 'beneficiary.label')}`,
            account: `${get(transaction, 'beneficiary.ncp')}`,
            age: `${get(transaction.beneficiary, 'age.code')}`,
            paymentDate: moment(get(transaction, 'dates.paid')).format('DD/MM/YYYY'),
            paymentHour: moment(get(transaction, 'dates.paid')).format('HH:mm'),
            total: `${getNumberWithSpaces(get(transaction.amounts, 'amount'))} XAF`,
            sender: (intent === 'mobile_transfer') ? `${get(transaction.gimacBody, 'walletsource')}` : `${get(transaction.gimacBody.sendercustomerdata, 'firstname')},${get(transaction.gimacBody.sendercustomerdata, 'secondname')}`,
            actionUrl
        }

        const template = handlebars.compile(templateIncommingTransaction);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error('html incomming transaction mail generation failed.');
        return error;
    }

}

// *************************** permanents transfers notification section *******************//
export const generateRejectedTransferMail = (transfer: any, total: number, motif?: string) => {

    try {

        const data = {
            greetings: `Bonjour M/Mme ${get(transfer?.originator, 'fname', '')},`,
            initiatorNcp: `${get(transfer?.originator, 'ncp', '')}`,
            initiatorAge: `${get(transfer?.originator, 'age', '')}`,
            initiatorName: `${get(transfer?.originator, 'lname', '')}, ${get(transfer?.originator, 'fname', '')}`,
            amount: `${getNumberWithSpaces(total)}`,
            paymentDate: `${moment().format('DD/MM/YYYY')}`,
            paymentHour: `${moment().format('HH:mm:ss')}`,
            transferDay: `${get(transfer, 'transferDay', '')}`,
            motif: `${motif}`,
            benefName: `${get(transfer?.beneficiary, 'label', '')}`,
            benefNcp: `${get(transfer?.beneficiary, 'ncp', '')}`,
            benefAge: `${get(transfer?.beneficiary, 'age.code', '')}`,
            benefCountry: `${get(transfer?.beneficiary?.contry, 'label', '')}`,
            benefBank: `${get(transfer?.beneficiary?.bank, 'name', '')}`,
            date: `${moment(get(transfer?.dates, 'created', 0)).format('DD/MM/YYYY')}`,
            actionUrl
        }

        const template = handlebars.compile(templateMailRejected);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html rejected transfer mail generation failed.${error}`);
        return error;
    }
}

export const generateMailTransferActivation = (transfer: any) => {

    try {

        const data = {
            greetings: `Bonjour ${get(transfer.originator, 'fname', '')},`,
            debitNcp: `${get(transfer.originator, 'ncp', '')}`,
            age: `${get(transfer.originator, 'age', '')}`,
            amount: `${getNumberWithSpaces(get(transfer, 'amounts.amount', ''))}`,
            transferDay: `${get(transfer, 'transferDay', '')}`,
            creditNcp: `${get(transfer.beneficiary, 'ncp', '')}`,
            dateActivation: `${moment(get(transfer.dates, 'created', 0)).format('DD/MM/YYYY')}`,
            actionUrl
        }

        const template = handlebars.compile(templateActivationPermanentTransfer);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html permanent transfer mail generation failed. ${error.stack}`);
        return error;
    }

}

// ************************* gimac claims *************************************************//
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

export const generateMailContentCeilingNotifAssign = (ceiling: any) => {
    try {
        let data = {};
        for (const iterator of ceiling) {
            const userAssign = `${iterator?.assignment?.assignered?.fname} ${iterator?.assignment?.assignered?.lname}` || '';

            data = {
                greetings: `Bonjour ${userAssign},`,
                actionUrl
            }
        }


        const template = handlebars.compile(templateCeilingNotificationAssign);

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

export const generateMailContentCeilingNotif = () => {

    try {

        const data = {
            greetings: `Bonjour,`,
            actionUrl
        }

        const template = handlebars.compile(templateCeilingNotification);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(
            'html ceiling assigned mail generation failed.',
            'services.helper.notification.generateMailContentCeiling()',
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

export const generateMailContentRejectAttachement = (info: any) => {
    try {
        let str = get(info, "currentMonth").toString();
        const months = {
            "01": "Janvier",
            "02": "Février",
            "03": "Mars",
            "04": "Avril",
            "05": "Mai",
            "06": "Juin",
            "07": "Juillet",
            "08": "Août",
            "09": "Septembre",
            10: "Octobre",
            11: "Novembre",
            12: "Décembre",
        };
        const month = str.slice(str.length - 2);
        const year = str.slice(0, str.length - 2);
        const currentMonth = `${months[month]} ${year}`;

        const data = {
            rejectReason: `${get(info, "rejectReason")}`,
            fullName: `${get(info, "fullName")}`,
            label: `${get(info, "label")}`,
            currentMonth,
            actionUrl,
        };

        const template = handlebars.compile(templateRejectAttachement);

        const html = template(data);

        return html;
    } catch (error) {
        logger.error(
            `html reject attachement mail generation failed. \n${error.name}\n${error.stack}`
        );
        return error;
    }
};


export const generateErrorPostingTransactionFile = (info: any) => {

    try {

        const data = {
            fullName: `${get(info, 'fullName')}`,
            label: `${get(info, 'label')}`,
            actionUrl
        }

        const template = handlebars.compile(templateErrorPostTransactionFile);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html reject attachement mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

}

export const generateMailVisaDepassment = (info: any) => {

    try {
        const str = get(info, 'currentMonth').toString();
        const months = { '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril', '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août', '09': 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre' };
        const month = str.slice(str.length - 2);
        const year = str.slice(0, str.length - 2);
        const currentMonth = `${months[month]} ${year}`;

        const data = {
            name: `${get(info, 'name')}`,
            currentMonth,
            actionUrl
        }

        const template = handlebars.compile(templateVisaDepassment);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html reject attachement mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};

// ************************ daily push/pull MTN report **************************************************//
export const generateMailDailyReportTransaction = (request: any) => {

    try {
        const { date, nbre } = request;
        const data = { greetings: `Bonjour,`, date, nbre, actionUrl };

        const template = handlebars.compile(templateDailyReportPUSHPULL);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html daily PUSH/PULL report generation failed. \n${error?.stack}`);
        return error;
    }
};

const getNumberWithSpaces = (x: { toString: () => string; }) => {
    if (!x) { return '0' }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}