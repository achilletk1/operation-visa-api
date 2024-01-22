import { VisaTransaction } from "modules/visa-transactions";
import { getYearMonthLabel } from "common/helpers";
import handlebars from "handlebars";
import moment from "moment";

export const replaceMailVariables = (content: any, userData: any, lang: 'fr' | 'en', signature?: string) => {
    const obj: any = {};
    const values = getVariablesValue({ transactions: userData?.transactions, ceiling: userData?.ceiling, amount: userData.amount || 0, lang });
    setVariablesInObject(content, values, obj);
    obj.name = values['NOM_CLIENT'];
    obj.civility = userData?.civility;
    if (signature) obj.signature = signature;
    return obj;
}

export const replaceSmsVariables = (content: any, userData: any, lang: 'fr' | 'en') => {
    const obj: any = {};
    const values = getVariablesValue({ transactions: userData?.transactions, ceiling: userData?.ceiling, amount: userData.amount || 0, lang });
    setVariablesInObject(content, values, obj, true);
    return obj;
}

function setVariablesInObject(content: any, values: any, obj: any, isSms?: boolean, isTest?: boolean) {
    for (const key in content) {
        if (!content.hasOwnProperty(key)) { continue; }
        obj[key] = goToTheLine(formatContent(content[key], values, isTest), isSms);
    }
}

// export const replaceVariables = (content: any, values: any, isSms?: boolean, isTest?: boolean) => {
//     const obj: any = {};
//     for (const key in content) {
//         if (!content.hasOwnProperty(key)) { break; }
//         obj[key] = goToTheLine(formatContent(content[key], values, isTest), isSms);
//     }
//     return obj;
// }

const getVariablesValue = (data: { transactions: VisaTransaction[], amount: number, ceiling: number, lang: string }) => {
    const { transactions, amount, ceiling, lang } = data;
    const transaction = transactions[0];
    const date = Math.min(...transactions.map(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').valueOf()));
    const mapping = {
        AGENCE: transaction?.age || 'Agence Inconnu',
        COMPTE: transaction?.ncp || 'Compte Inconnu',
        CHAPITRE: transaction?.cha || '',
        CLIENT: transaction?.clientCode || '',
        NOM_CLIENT: transaction?.fullName || '',
        CODE_GESTIONNAIRE: transaction?.manager?.code || '',
        NOM_GESTIONNAIRE: transaction?.manager?.name || '',
        TELEPHONE_CLIENT: transaction?.tel || '',
        EMAIL_CLIENT: transaction?.email || '',
        NOM_CARTE: transaction?.card?.name || '',
        CARTE: transaction?.card?.code || '',
        PRODUIT: transaction?.card?.label,
        DATE: moment(date).locale(`${lang || 'fr'}`).format('DD/MM/YYYY'),
        HEURE: moment(date).locale(`${lang || 'fr'}`).format('HH:mm:ss'),
        MONTANT: amount,
        DEVISE: transaction?.currencyTrans,
        MONTANT_COMPENS: transaction?.amountCompens,
        DEVISE_COMPENS: transaction?.amountCompens,
        MONTANT_XAF: transaction?.amount,
        TYPE_TRANS: transaction?.type,
        CATEGORIE: transaction?.category,
        PAYS: transaction?.country,
        ACQUEREUR: transaction?.beneficiary,
        PLAFOND: ceiling,
        MOIS_DEPART: getYearMonthLabel(transaction?.currentMonth?.toString() || '', 'both'),
        DATE_COURANTE: moment().locale(`${lang || 'fr'}`).format('DD/MM/YYYY'),
        DATE_COURANTE_LONG: moment().locale(`${lang || 'fr'}`).format('dddd, Do MMMM YYYY'),
    }

    return mapping;
}

const formatContent = (str: string, values: any, isTest?: boolean): string => {
    if (!str) { return '' }

    if (isTest) {
        str = str.split(`{{`).join(`[`);
        str = str.split(`}}`).join(`]`);
        return str;
    }
    for (const key in values) {
        if (str.includes(`{{${key}}}`)) {
            str = str.split(`{{${key}}}`).join(`${values[key]}`);
        }
    }

    return str;
}

const goToTheLine = (str: string, isSms?: boolean) => {
    const reg = '//';
    str = str ?? '';
    return str.includes(reg)
    ? isSms
        ? str?.replace(new RegExp(reg, 'g'), '\n')
        : new handlebars.SafeString(str.split(reg).join('<br>'))
    : str;
}