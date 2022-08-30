import replaceSpecialCharacters = require('replace-special-characters');
import { Transaction } from '../models/transaction';
import { isString, isNumber } from 'lodash';
import { logger } from '../winston';
import { config } from '../config';
import * as moment from 'moment';
import XLSX = require('xlsx');

export const commonService = {

    parseNumberFields: (fields?: any) => {
        for (const key in fields) {
            if (!fields.hasOwnProperty(key)) { continue; }
            if (RegExp(/[a-z]/i).test(fields[key])) { continue; }
            if (key === 'internalRef') { fields[key] = `${fields[key]}`.trim(); continue; }
            if (key.includes('niu')) { fields[key] = `${fields[key]}`.trim(); continue; }
            if (key.includes('clientCode')) { fields[key] = `${fields[key]}`.trim(); continue; }
            if (key.includes('contryCode')) { fields[key] = `${fields[key]}`.trim(); continue; }
            if (key.includes('bankCode')) { fields[key] = `${fields[key]}`.trim(); continue; }
            if (key.includes('tel')) { fields[key] = `${fields[key]}`.trim(); continue; }
            if (key.includes('ncp')) { fields[key] = `${fields[key]}`.trim(); continue; }
            if (key.includes('originator.ncp')) { fields[key] = `${fields[key]}`.trim(); continue; }
            if (key.includes('country.code')) { fields[key] = `${fields[key]}`.trim(); continue; }
            if (key.includes('age')) { fields[key] = `${fields[key]}`.trim(); continue; }
            if (key.includes('vouchercode')) { fields[key] = `${fields[key]}`.trim(); continue; }
            fields[key] = (isString(fields[key]) && /^[0-9]+$/.test(fields[key])) ? +fields[key] : fields[key];
        }

    },

    timeout: (ms: number) => { return new Promise(resolve => setTimeout(resolve, ms)); },

    getRandomInt: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },

    getRandomString: (size: number, numberOnly?: boolean) => {
        size = size || 10;
        const chars = numberOnly ?
            '0123456789' :
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
        let randomstring = '';
        for (let i = 0; i < size; i++) {
            const rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        return randomstring;
    },

    generateErrResponse: (message: string, err: Error, title?: string) => {
        const errResp: any = { details: message };
        if (title) { errResp.title = title; }

        if (config.get('env') !== 'production') { errResp.name = err.message; }

        return errResp;
    },

    gimacErrorsArray: (message: string) => {
        const ErrorArrays = [
            { err: 'TransactionAmountNotProvided', code: 404, msg: `échec de génération de l\'otp de la transaction` },
            { err: 'Forbidden', code: 400, msg: 'Cette opération est interdite vers un wallet marchand.' },
            { err: 'NotGimacTransaction', code: 400, msg: `Cette transaction n'est pas GIMAC` },
            { err: 'TransactionOwnershipFailed', code: 403, msg: 'opération interdite' },
            { err: 'UserNotFound', code: 404, msg: 'utilisateur non trouvé' },
            { err: 'tokenExpired', code: 400, msg: 'Le temps de validité de la transaction a expiré' },
            { err: 'TransactionBodyNotConform', code: 400, msg: 'Corps de la requête non conforme' },
            { err: 'TransactionIntentNotValide', code: 400, msg: 'Le champ intent est manquant dans le corps de la transaction' },
            { err: 'WalletDestinationNotFound', code: 400, msg: `Aucun client n'est lié à ce wallet. Essayez un autre.` },
            { err: 'NoWalletDestinationSpecified', code: 400, msg: 'Le wallet du destinataire n\'as pas été fourni' },
            { err: 'MemberNotFound', code: 400, msg: `Aucun  membre GIMAC n'est lié à ce code!` },
            { err: 'BadFieldsProvided', code: 400, msg: `Le corps de la requête n'est pas conforme aux données attendues` },
            { err: 'VoucherCodeNotProvided', code: 400, msg: `Le champ vouchercode n'as pas été fourni` },
            { err: 'AlreadyExist', code: 400, msg: `Un profil existe déjà avec ce label` },
            { err: 'AllreadyConfirmed', code: 400, msg: `la transaction a déjà été ACCEPTÉE` },
            { err: 'AllreadyRejected', code: 400, msg: `la transaction a déjà été REJETÉE` },
            { err: 'IssuerTransactionRefNotFound', code: 400, msg: `référence de la transaction de l\'émétteur non fournie` },
            { err: 'TransactionNotFound', code: 400, msg: `La référence de transaction de l'émétteur ne correspond à aucune transaction` },
            { err: 'TransactionAmountNotValide', code: 400, msg: `valeur du montant de la transaction non valide` },
            { err: 'TransactionAmountNotValid', code: 400, msg: `Le montant de la transaction doit être un multiple de 5000` },
            { err: 'badTokenProvided', code: 400, msg: `mauvais jeton fourni` },
            { err: 'TransactionRejected', code: 400, msg: `Transaction rejetée` },
            { err: 'UpdateStateInvalid', code: 400, msg: `Statut mis à jour non valide` },
            { err: 'ForAdmin', code: 400, msg: `reservé aux administrateurs` },
            { err: 'participantNotFound', code: 400, msg: `participant non trouvé` },
            { err: 'CommissionProfilNotFound', code: 400, msg: `Aucun profil de commissions affecté à cet utilisateur` },
            { err: 'NotBciTransaction', code: 400, msg: `Cette transaction n'est pas issue de la BCI.` },
            { err: 'CeillingNotFound', code: 400, msg: `Nous ne trouvons pas de plafond pour cette transaction` },
            { err: 'CeillingLimitReached', code: 400, msg: `Vous avez atteint votre plafond de transaction autorisée.` },
            { err: 'CeillingLimitWillBeReached', code: 400, msg: `En effectuant cette transaction vous dépassez votre plafond de transaction autorisée.` },
            { err: 'WalletGIMACUnknown', code: 400, msg: `Ce wallet est inconnu.` },
            { err: 'AMAIsNotUP', code: 400, msg: `Oops! AMA Platform is not up.` },
            { err: 'WalletGIMACUnable', code: 400, msg: `Ce wallet est désactivé.` },
            { err: 'InsufficientBalance', code: 400, msg: `Solde du compte du client est insufissant pour effectuer l'opération.` },
            { err: 'BadAccountSelected', code: 400, msg: `Le compte sélectionner n\'est pas autorisé pour cette transaction.` },
            { err: 'WalletMerchantNotFound', code: 400, msg: `La wallet marchand non trouvé.` },
            { err: 'GimacCodeNotFound', code: 400, msg: `Code participant non trouvé.` },
            { err: 'UnknownError', code: 500, msg: `Une erreur s'est produite lors du traitement de la transaction` },
        ];
        if (!message) { return ErrorArrays.find(elt => elt.err === 'UnknownError'); }
        return ErrorArrays.find(elt => elt.err === message);
    },

    generateAMAErrResponse: (message: string, description: string) => {
        return { error: message, error_description: description };
    },

    removeTraillingWhiteSpaces: (fields: any) => {
        for (const key in fields) {
            if (!fields.hasOwnProperty(key)) { continue; }
            if (isNumber(fields[key])) { continue; }
            fields[key] = `${fields[key]}`.trim();
        }
    },

    formatNumber: (strNumber: any) => {
        const isStringe = typeof strNumber === 'string';
        if (!isStringe) { strNumber = strNumber.toString(); }
        strNumber = strNumber.replace(/ /g, '');
        strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return strNumber;
    },

    generateConfirmTransactionSMSData: (transaction: Transaction, solde?: number) => {
        const data: any = {};
        data.ncp = `*****${transaction.originator.ncp.slice(5, 10)}`;
        data.type = ([4, 7].includes(transaction.type)) ? 'Credit' : 'Debit';
        data.amount = commonService.formatNumber(`${transaction.amounts.amount}`);
        data.date = `${moment(transaction.dates.paid).format('DD.MM.YYYY')}`;
        data.time = `${moment(transaction.dates.paid).add(1, 'hours').format('HH:mm')}`;
        data.solde = commonService.formatNumber(`${solde - transaction.amounts.amount}`);
        data.description = `${transaction.label}`;
        return data;
    },

    toFixedNumber(num: number, digits: number) {
        const pow = Math.pow(10, digits);
        return Math.round(num * pow) / pow;
    },

    maskFirstDigits: (ncp: string): string => {
        if (!ncp || ncp.length !== 11) { return; }
        const last6digits = ncp.slice(5, 11);
        return `*****${last6digits}`;
    },

    validateDate: (str: string) => {
        str = str.split('/').join('-');
        const regex = /^((0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-[12]\d{3})$/;
        return regex.test(str);
    },

    getNewSolde: (oldSold: number, amount: number, state?: 'debit' | 'credit'): number => {
        logger.info(`old sold get from cbs ${oldSold}; amount of transaction ${amount}`);
        const newSold = state === 'credit' ? oldSold + amount : oldSold - amount;
        logger.info(`new sold ${newSold}`);
        return newSold;
    },

    excelToJson(content: any) {
        const wb = XLSX.read(content);
        const sheetNames = wb.SheetNames;

        return XLSX.utils.sheet_to_json(wb.Sheets[sheetNames[0]], { raw: true });
    },

}

const removeSpecialCharacter = (str) => {
    if (!str) { return; }
    str = str.replace(/@/g, '');
    str = str.replace(/\|/g, '');
    str = str.replace(/\//g, '');
    str = str.replace(/\\/g, '');
    str = str.replace(/\$/g, 's');
    str = str.replace(/€/g, 'e');
    str = str.replace(/d/g, '');
    str = str.replace(/&/g, '');
    str = str.replace(/#/g, '');
    str = str.replace(/\^/g, '');
    str = str.replace(/\¨/g, '');
    str = str.replace(/\µ/g, '');
    str = str.replace(/\£/g, '');
    str = str.replace(/\~/g, '');
    str = str.replace(/\`/g, '');
    return replaceSpecialCharacters(str);
}
