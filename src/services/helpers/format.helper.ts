import moment from "moment";
import { VisaTransaction } from "../../models/visa-operations";
import * as visaHelper from "../helpers/visa-operations.service.helper";
import handlebars from 'handlebars';

export const replaceVariables = (content: any, values: any, isTest?: boolean) => {
    const obj: any = {};
    for (const key in content) {
        if (!content.hasOwnProperty(key)) { break; }
        obj[key] = goToTheLine(formatContent(content[key], values, isTest));
    }
    return obj;
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


const goToTheLine = (str: string) => {
    const reg = '//';
    str = str ?? '';
    return str.includes(reg) ? new handlebars.SafeString(str.split(reg).join('<br>')) : str;
}

export const getVariablesValue = (data: { transactions: VisaTransaction[], amount: number, ceiling: number }) => {
    const { transactions, amount, ceiling } = data;
    const transaction = transactions[0];
    const date = Math.min(...transactions.map(elt => elt?.date));
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
        PRODUIT: transaction?.card.label,
        DATE: moment(date).format('dd/MM/YYYY'),
        HEURE: moment(date).format('HH:mm:ss'),
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
        MOIS_DEPART: visaHelper.transformDateExpression(transaction?.currentMonth.toString()),
        DATE_COURANTE: moment().format('dd/MM/YYYY'),
        DATE_COURANTE_LONG: moment().locale('fr'),
    }

    return mapping;
}




