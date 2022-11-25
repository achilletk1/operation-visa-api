import { Letter } from './../../models/letter';
import  readFilePromise from 'fs-readfile-promise';
import  handlebars from 'handlebars';
import  http from 'request-promise';
import { logger } from "../../winston";
import { config } from '../../config';
import  moment from "moment";
import  XLSX from 'xlsx';
import { get } from 'lodash';
import { User } from '../../models/user';

let templateFormalNoticeLetter: any;
let templateExportNotification :any ;
// let templateFormalNoticeMail:any ; 
(async () => {
    templateFormalNoticeLetter = await readFilePromise(__dirname + '/templates/formal-notice-letter.template.html', 'utf8');
    templateExportNotification = await readFilePromise(__dirname + '/templates/export-notification.pdf.template.html', 'utf8');
    // templateFormalNoticeMail = await readFilePromise(__dirname + '/templates/formal-notice-template-mail.template.html', 'utf8');
})();

export const generateNotificationExportPdf = async (user: any, notification: any, start: any, end: any) => {

    try {
        const data = getTemplateNotificationPdfData(user, notification, start, end);

        const template = handlebars.compile(templateExportNotification);

        const html = template(data);


        const options = {
            method: 'POST',
            uri: `${config.get('pdfApiUrl')}/api/v1/generatePdf`,
            body: { html },
            json: true
        }

        return await http(options);
    } catch (error) {
        logger.error(
            'pdf export pdf generation failed.',
            'services.helper.notification.templateExportNotification()',
            error
        );
        return error;
    }
}

const getTemplateNotificationPdfData = (user: User,  notifications: any, start: any, end: any) => {
    
    const data: any = {};
    data.range_start = start;
    data.range_end = end;
    //var message

    if(!start){
        data.range_start =  moment().subtract(6,'M').format('DD/MM/YYYY');
    }

    if(!end){
        data.range_end =  moment().format('DD/MM/YYYY');
    }
  
    // Add export date
    data.export_date = moment().format('DD/MM/YYYY');

    data.notifications = notifications.map( elt =>{
        console.log("elt",elt)
        const dataStatus = { 100: 'CRÉÉE',200: 'ENVOYÉE', 300: 'REÇU',400:'LU'};
        const dataFormat = { 100: 'SMS',200: 'MAIL'};      

            return {
                notification_send_date: elt.dates.sentAt ? moment(elt.dates.sentAt).format('DD/MM/YYYY')  :'N/A',
                notification_received_date : elt.dates.receivedAt ? moment(elt.dates.receivedAt).format('DD/MM/YYYY')  : 'N/A',
                notification_read_at: elt.dates.readAt ?  moment(elt.dates.readAt).format('DD/MM/YYYY')  : 'N/A',
                notification_status : dataStatus[elt.status],
                notification_format : dataFormat[elt.format],
                notification_contact: elt.format ==100 ? elt.tel : elt.email,
                notification_message: elt.message,
            }
    })
    
    return data;
};


export const generateFormalNoticeLetter = async (content: any, userData: any, signature: string, isTest?: boolean) => {
    try {
        const values = {
            ...userData,
            'SYSTEM_TODAY_LONG': moment().locale('fr'),
            'SYSTEM_TODAY_SHORT': moment().format('dd/MM/YYYY'),
        }
        const data = replaceVariables(content, values, isTest);

        const templateData = generateTemplateFormalNoticeLetter(data, signature);

        const template = handlebars.compile(templateFormalNoticeLetter);

        const html = template(templateData);

        const options = {
            method: 'POST',
            uri: `${config.get('pdfApiUrl')}/api/v1/generatePdf`,
            body: { html },
            json: true
        }

        return await http(options);
    } catch (error) {
        logger.error(`\npdf RIB export generation failed ${JSON.stringify(error)}`);
        return error;
    }
};

// export const generateFormalNoticeMail = async (content: any, userData: any,  isTest?: boolean) => {
//     try {
//         const values = {
//             ...userData,
//             'SYSTEM_TODAY_LONG': moment().locale('fr'),
//             'SYSTEM_TODAY_SHORT': moment().format('dd/MM/YYYY'),
//         }
//         const data = replaceVariables(content, values, isTest);

//         const temlateData = generateTemplateFormalNoticeMail(data);

//         const template = handlebars.compile(templateFormalNoticeMail);

//         const html = template(temlateData);
//        /* const options = {
//             method: 'POST',
//             uri: `${config.get('pdfApiUrl')}/api/v1/generatePdf`,
//             body: { html },
//             json: true
//         }*/
//         return html;
//     } catch (error) {
//         logger.error(`\nPreview  template mail  generation failed ${JSON.stringify(error)}`);
//         return error;
//     }
// };

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
}

const generateTemplateFormalNoticeLetter = (letter: Letter, signature: string) => {

    const reg = '//'

    const data = {
        letterRef: get(letter, 'letterRef', ''),
        headLeftText: goToTheLine(`${get(letter, 'headLeftText', '')}`, reg),
        headRightText: goToTheLine(`${get(letter, 'headRightText', '')}`, reg),
        introductionTexT: goToTheLine(`${get(letter, 'introductionTexT', '')}`, reg),
        salutationText: goToTheLine(`${get(letter, 'salutationText', '')}`, reg),
        objectText: get(letter, 'objectText', ''),
        bodyText: goToTheLine(`${get(letter, 'bodyText', '')}`, reg),
        conclusionText: goToTheLine(`${get(letter, 'conclusionText', '')}`, reg),
        footerText: goToTheLine(`${get(letter, 'footerText', '')}`, reg),
        signatureText: get(letter, 'signatureText', ''),
        signature
    }

    return data;
};

const generateTemplateFormalNoticeMail = (content: any) => {
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

export const generateTransactionExportXlsx = (transactions) => {

    // if (typeof XLSX === 'undefined') import  XLSX from 'xlsx';

    const { result } = transactions;

    // Format Excel file columns headers;
    if (result) {
        const excelData = result.map(transaction => {
            const excelInvoice = {};
            excelInvoice['COMPTE '] = `${get(transaction, 'COMPTE')}`;
            excelInvoice['DATE '] = `${moment(get(transaction, 'DATE_OPERATION')).format('DD/MM/YYYY')}`;
            excelInvoice['MONTANT (XAF)'] = `${getNumberWithSpaces(get(transaction, 'MONTANT_OPERATION'))}`;
            excelInvoice['OPÉRATION '] = `${get(transaction, 'SENS')}` === `C` ? 'CREDIT' : 'DEBIT';
            excelInvoice['DATE DE VALEUR '] = `${moment(get(transaction, 'DATE_VALEUR')).format('DD/MM/YYYY')}`;
            excelInvoice['LIBELÉ '] = `${get(transaction, 'LIBELLE_OPERATION')}`;
            return excelInvoice;
        });

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();

        // Set Excel file columns width;
        ws['!cols'] = [{ wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 35 }];

        XLSX.utils.book_append_sheet(wb, ws, `export_${new Date().getTime()}`);
        return XLSX.write(wb, { type: 'base64' });
    }

}

const getNumberWithSpaces = (x) => {
    if (!x) { return '0' }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


export const generateVisaTransactionExportXlsx = (transactions: any[]) => {


    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `export_${new Date().getTime()}`);
    return XLSX.write(wb, { type: 'base64' });


}


export const visaTransaction = [
    {
        "DATE": "  01/03/2022 ",
        "HEURE": "00:00:30",
        "CLIENT": 87654321,
        "COMPTE": "01100-37207297996",
        "NOM DETENTEUR": "TACHUM Achille",
        "CARTE": "445411******7134=2308",
        "PRODUIT": "VISA Gold",
        "NATURE": "RETRAIT DAB",
        "MONTANT_TRANS": 7700,
        "DEVISE_TRANS": "AED",
        "MONTANT_COMPENS": 1885.71,
        "EUR": "EUR",
        "MONTANT_XAF": 1236945,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "6000",
        "BENEFICIAIRE": "BANIYAS BRANCH ATM 4",
        "PAYS": "Émirats Arabes Unis",
        "CATEGORIE": "Automated Cash Disburse"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "00:01:33",
        "CLIENT": "75023431",
        "COMPTE": "01100-37107096755",
        "NOM DETENTEUR": "SIGNE KARL-DIMITRI",
        "CARTE": "445411******5950=2307",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 3.99,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 3.99,
        "EUR": "EUR",
        "MONTANT_XAF": 2617,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "AMZNDigital",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Digital Goods: Large Digital Goods Merchant"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "00:02:01",
        "CLIENT": "75023431",
        "COMPTE": "01300-37207297662",
        "NOM DETENTEUR": "SIGNE KARL-DIMITRI",
        "CARTE": "445411******7274=2308",
        "PRODUIT": "VISA Gold",
        "NATURE": "RETRAIT DAB",
        "MONTANT_TRANS": 7800,
        "DEVISE_TRANS": "AED",
        "MONTANT_COMPENS": 1910.2,
        "EUR": "EUR",
        "MONTANT_XAF": 1253009,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "6000",
        "BENEFICIAIRE": "BANIYAS BRANCH ATM 4",
        "PAYS": "Émirats Arabes Unis",
        "CATEGORIE": "Automated Cash Disburse"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "00:02:16",
        "CLIENT": "70089528",
        "COMPTE": "01100-37207168845",
        "NOM DETENTEUR": "Kevin MOUTASSI",
        "CARTE": "445410******1389=2302",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 45.72,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 45.72,
        "EUR": "EUR",
        "MONTANT_XAF": 29990,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "LA REDOUTE FR",
        "PAYS": "France",
        "CATEGORIE": "Direct Marketing - Combination Catalog and Retail Merchant"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "00:04:52",
        "CLIENT": "70089528",
        "COMPTE": "01300-37207087476",
        "NOM DETENTEUR": "Kevin MOUTASSI",
        "CARTE": "445411******5478=2204",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 27.43,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 24.67,
        "EUR": "EUR",
        "MONTANT_XAF": 16182,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "WM SUPERCENTER #5968",
        "PAYS": "États-Unis",
        "CATEGORIE": "Grocery Stores, Supermarkets"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "00:18:18",
        "CLIENT": 12275801,
        "COMPTE": "01200-37207029455",
        "NOM DETENTEUR": "SPECIAL JUS DE FRUITS",
        "CARTE": "445410******3746=2211",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 141.68,
        "DEVISE_TRANS": "BRL",
        "MONTANT_COMPENS": 24.08,
        "EUR": "EUR",
        "MONTANT_XAF": 10057950,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "DING   *100117569",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Telecommunication Services"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "00:22:00",
        "CLIENT": 12275531,
        "COMPTE": "01100-37207134414",
        "NOM DETENTEUR": "AFRIQUE GAZ",
        "CARTE": "445410******3686=2308",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 7.99,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 7.99,
        "EUR": "EUR",
        "MONTANT_XAF": 5241,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "Nintendo CD680090895",
        "PAYS": "Pays-Bas",
        "CATEGORIE": "Digital Goods: Games"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "00:24:32",
        "CLIENT": 12875535,
        "COMPTE": "02100-02000030930",
        "NOM DETENTEUR": "SOLUTION TRANS",
        "CARTE": "445410******9343=2206",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 1,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 1,
        "EUR": "EUR",
        "MONTANT_XAF": 656,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "SULLY",
        "PAYS": "France",
        "CATEGORIE": "Miscellaneous General Services"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "00:44:43",
        "CLIENT": 12875456,
        "COMPTE": "01100-37207097195",
        "NOM DETENTEUR": "Restaurant le Citron Vert",
        "CARTE": "445411******3391=2211",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 200,
        "DEVISE_TRANS": "AED",
        "MONTANT_COMPENS": 48.9,
        "EUR": "EUR",
        "MONTANT_XAF": 32076,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "ETISALAT-DUBAI AIRP9",
        "PAYS": "Émirats Arabes Unis",
        "CATEGORIE": "Telecommunication Services"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "00:47:42",
        "CLIENT": 12875456,
        "COMPTE": "01100-37207097195",
        "NOM DETENTEUR": "Restaurant le Citron Vert",
        "CARTE": "445411******3391=2211",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 2.12,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 2.12,
        "EUR": "EUR",
        "MONTANT_XAF": 1391,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "DDF DXB T1 331",
        "PAYS": "Émirats Arabes Unis",
        "CATEGORIE": "Duty Free Stores"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "01:10:15",
        "CLIENT": 12875456,
        "COMPTE": "01100-37207097195",
        "NOM DETENTEUR": "Restaurant le Citron Vert",
        "CARTE": "445411******3391=2211",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 68,
        "DEVISE_TRANS": "AED",
        "MONTANT_COMPENS": 16.63,
        "EUR": "EUR",
        "MONTANT_XAF": 10909,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "DUBAI TAXI",
        "PAYS": "Émirats Arabes Unis",
        "CATEGORIE": "Commuter Transport, Ferries"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "01:20:11",
        "CLIENT": 12300450,
        "COMPTE": "02000-37207175968",
        "NOM DETENTEUR": "SHAWARMA DU GROOVE",
        "CARTE": "445410******6686=2210",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 75.2,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 75.2,
        "EUR": "EUR",
        "MONTANT_XAF": 4932800,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "SERVICE NAVIGO",
        "PAYS": "France",
        "CATEGORIE": "Tolls/Bridge Fees"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "01:34:44",
        "CLIENT": "70052759",
        "COMPTE": "01100-37207221617",
        "NOM DETENTEUR": "MR   BOUYA ONDAYI JEAN",
        "CARTE": "445411******4463=2203",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 8.99,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 8.07,
        "EUR": "EUR",
        "MONTANT_XAF": 5294,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "OnlyFans",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Direct Marketing - Inbound Tele"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "02:02:08",
        "CLIENT": "70063021",
        "COMPTE": "02000-37207279985",
        "NOM DETENTEUR": "MR   KIDIMBA MODESTE",
        "CARTE": "445411******8407=2208",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 9.99,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 8.9,
        "EUR": "EUR",
        "MONTANT_XAF": 5838,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "APPLE.COM/BILL",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Digital Goods: Media, Books, Movies, Music"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "02:30:13",
        "CLIENT": 12875456,
        "COMPTE": "01100-37207097195",
        "NOM DETENTEUR": "Restaurant le Citron Vert",
        "CARTE": "445411******3391=2211",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 30,
        "DEVISE_TRANS": "AED",
        "MONTANT_COMPENS": 7.25,
        "EUR": "EUR",
        "MONTANT_XAF": 4756,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "RADISSON BLU",
        "PAYS": "Émirats Arabes Unis",
        "CATEGORIE": "Hotels/Motels/Inns/Resorts"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "02:55:01",
        "CLIENT": "70065616",
        "COMPTE": "02000-37207292003",
        "NOM DETENTEUR": "MLLE BANGO CLAURA",
        "CARTE": "445410******3062=2304",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 2.99,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 2.67,
        "EUR": "EUR",
        "MONTANT_XAF": 1751,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "APPLE.COM/BILL",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Digital Goods: Media, Books, Movies, Music"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "04:31:07",
        "CLIENT": 12875535,
        "COMPTE": "02100-02000030930",
        "NOM DETENTEUR": "SOLUTION TRANS",
        "CARTE": "445410******9343=2206",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 1,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 1,
        "EUR": "EUR",
        "MONTANT_XAF": 656,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "SULLY",
        "PAYS": "France",
        "CATEGORIE": "Miscellaneous General Services"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "05:18:19",
        "CLIENT": "21489100",
        "COMPTE": "02000-37207117458",
        "NOM DETENTEUR": "MR   LOKO ODIFAX JEAN HUBERT R",
        "CARTE": "445411******9488=2209",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 7.99,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 7.09,
        "EUR": "EUR",
        "MONTANT_XAF": 4651,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "APPLE.COM/BILL",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Digital Goods: Media, Books, Movies, Music"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "05:51:09",
        "CLIENT": "70038623",
        "COMPTE": "02000-37207127580",
        "NOM DETENTEUR": "MR   MOUNDANGA INIAMY LHOMMI",
        "CARTE": "445410******3179=2302",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 11.99,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 10.69,
        "EUR": "EUR",
        "MONTANT_XAF": 7012,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "NETFLIX.COM",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Cable, Satellite, and Other Pay Television and Radio"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "05:56:55",
        "CLIENT": "12223900",
        "COMPTE": "01500-02000086420",
        "NOM DETENTEUR": "MR   KIBA NGAPOULA",
        "CARTE": "445410******0407=2301",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 11.99,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 10.69,
        "EUR": "EUR",
        "MONTANT_XAF": 7012,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "NETFLIX.COM",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Cable, Satellite, and Other Pay Television and Radio"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "06:23:33",
        "CLIENT": "21954000",
        "COMPTE": "02000-02000598330",
        "NOM DETENTEUR": "MILANDOU NEE KANZA/.MME",
        "CARTE": "445411******0376=2311",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 15.4,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 15.4,
        "EUR": "EUR",
        "MONTANT_XAF": 10102,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "SNCF",
        "PAYS": "France",
        "CATEGORIE": "Passenger Railways"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "06:31:32",
        "CLIENT": "70057307",
        "COMPTE": "01100-37207249300",
        "NOM DETENTEUR": "MR   ONKOUNA VOULABELI JEAN",
        "CARTE": "445410******6591=2302",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 6049,
        "DEVISE_TRANS": "RUB",
        "MONTANT_COMPENS": 70.52,
        "EUR": "EUR",
        "MONTANT_XAF": 46258,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "ESHOPWORLD NIKE",
        "PAYS": "Suède",
        "CATEGORIE": "Sports and Riding Apparel Stores"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "06:39:49",
        "CLIENT": "70062363",
        "COMPTE": "01500-37207276916",
        "NOM DETENTEUR": "M.   ONKOUNA ZEPHIRIN/ SHELLA/",
        "CARTE": "445410******2347=2207",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 7.99,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 7.12,
        "EUR": "EUR",
        "MONTANT_XAF": 4670,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "NETFLIX.COM",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Cable, Satellite, and Other Pay Television and Radio"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "06:42:48",
        "CLIENT": "12223900",
        "COMPTE": "01500-02000086420",
        "NOM DETENTEUR": "MR   KIBA NGAPOULA",
        "CARTE": "445410******0407=2301",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 11.99,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 10.69,
        "EUR": "EUR",
        "MONTANT_XAF": 7012,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "NETFLIX.COM",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Cable, Satellite, and Other Pay Television and Radio"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "07:11:51",
        "CLIENT": "07822100",
        "COMPTE": "01300-02000595770",
        "NOM DETENTEUR": "MME  AKOLI MARTHE",
        "CARTE": "445411******2120=2207",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 39.95,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 35.87,
        "EUR": "EUR",
        "MONTANT_XAF": 23529,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "hptvgn.com",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Dating/Escort Services"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "07:13:17",
        "CLIENT": "70033358",
        "COMPTE": "02000-37207120859",
        "NOM DETENTEUR": "MR   ELENGA-BONGO CHARLEY LOUM",
        "CARTE": "445410******1256=2302",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 11.99,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 10.69,
        "EUR": "EUR",
        "MONTANT_XAF": 7012,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "NETFLIX.COM",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Cable, Satellite, and Other Pay Television and Radio"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "07:28:37",
        "CLIENT": "12156800",
        "COMPTE": "01100-01000109200",
        "NOM DETENTEUR": "MLLE ZEPHO LISETTE MARIE ELEON",
        "CARTE": "445410******4908=2305",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 4,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 4,
        "EUR": "EUR",
        "MONTANT_XAF": 2624,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "KEOLIS ORLEANS",
        "PAYS": "France",
        "CATEGORIE": "Commuter Transport, Ferries"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "07:35:57",
        "CLIENT": "21954000",
        "COMPTE": "02000-02000598330",
        "NOM DETENTEUR": "MILANDOU NEE KANZA/.MME",
        "CARTE": "445411******0376=2311",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 17.8,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 17.8,
        "EUR": "EUR",
        "MONTANT_XAF": 11676,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "SNCF",
        "PAYS": "France",
        "CATEGORIE": "Passenger Railways"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:00:37",
        "CLIENT": "11882900",
        "COMPTE": "01300-02000476030",
        "NOM DETENTEUR": "MR   MADOUNGA MOUANDA ABDOU",
        "CARTE": "445410******1945=2308",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 5.7,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 5.7,
        "EUR": "EUR",
        "MONTANT_XAF": 3739,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "RATP",
        "PAYS": "France",
        "CATEGORIE": "Commuter Transport, Ferries"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:03:25",
        "CLIENT": "11882900",
        "COMPTE": "01300-02000476030",
        "NOM DETENTEUR": "MR   MADOUNGA MOUANDA ABDOU",
        "CARTE": "445410******1945=2308",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 22.8,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 22.8,
        "EUR": "EUR",
        "MONTANT_XAF": 14956,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "RATP",
        "PAYS": "France",
        "CATEGORIE": "Commuter Transport, Ferries"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:06:35",
        "CLIENT": "70033203",
        "COMPTE": "02400-37207120169",
        "NOM DETENTEUR": "MR   SINDIKOU FAYCAL-SEDRIQUE",
        "CARTE": "445411******5635=2205",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 9.99,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 8.87,
        "EUR": "EUR",
        "MONTANT_XAF": 5818,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "APPLE.COM/BILL",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Digital Goods: Large Digital Goods Merchant"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:09:11",
        "CLIENT": "70027233",
        "COMPTE": "01100-37207102847",
        "NOM DETENTEUR": "MME  PROVOST STELLA",
        "CARTE": "445411******7533=2306",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 606.29,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 544.39,
        "EUR": "EUR",
        "MONTANT_XAF": 357096,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "CHILDRENSALON LTD",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Family Clothing Stores"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:11:49",
        "CLIENT": "70027233",
        "COMPTE": "01100-37207102847",
        "NOM DETENTEUR": "MME  PROVOST STELLA",
        "CARTE": "445411******7533=2306",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 65698,
        "DEVISE_TRANS": "XAF",
        "MONTANT_COMPENS": 100.16,
        "EUR": "EUR",
        "MONTANT_XAF": 65701,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "AMZN Mktp FR",
        "PAYS": "Luxembourg",
        "CATEGORIE": "Miscellaneous Specialty Retail"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:13:46",
        "CLIENT": "70027233",
        "COMPTE": "01100-37207102847",
        "NOM DETENTEUR": "MME  PROVOST STELLA",
        "CARTE": "445411******7533=2306",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 25.02,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 25.02,
        "EUR": "EUR",
        "MONTANT_XAF": 16412,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "AMAZON PRIME",
        "PAYS": "France",
        "CATEGORIE": "Direct Marketing - Combination Catalog and Retail Merchant"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:17:27",
        "CLIENT": "70011755",
        "COMPTE": "02000-37207062053",
        "NOM DETENTEUR": "MR   YOKA AMEYA FIRMIN",
        "CARTE": "445410******4962=2209",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 2.35,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 2.11,
        "EUR": "EUR",
        "MONTANT_XAF": 1384,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "GOOGLE *ADS6607118252",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Advertising Services"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:24:07",
        "CLIENT": "70059235",
        "COMPTE": "01100-37107258129",
        "NOM DETENTEUR": "ETS E.V.E.S",
        "CARTE": "445411******8747=2308",
        "PRODUIT": "VISA Gold",
        "NATURE": "RETRAIT DAB",
        "MONTANT_TRANS": 100,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 100,
        "EUR": "EUR",
        "MONTANT_XAF": 65596,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "6000",
        "BENEFICIAIRE": "LA BANQUE POSTALE",
        "PAYS": "France",
        "CATEGORIE": "Automated Cash Disburse"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:32:13",
        "CLIENT": "70011449",
        "COMPTE": "02000-37207060663",
        "NOM DETENTEUR": "MR   CHELALA ELIE",
        "CARTE": "445411******6880=2207",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 45,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 45,
        "EUR": "EUR",
        "MONTANT_XAF": 29518,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "FEDERAL EXPRESS FRANCE",
        "PAYS": "Pays-Bas",
        "CATEGORIE": "Courier Services"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:34:45",
        "CLIENT": "70032188",
        "COMPTE": "01850-37207115442",
        "NOM DETENTEUR": "MR   ETOKA MABONGO PERPETUE VI",
        "CARTE": "445411******6600=2304",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 156,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 156,
        "EUR": "EUR",
        "MONTANT_XAF": 102329,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "trainline",
        "PAYS": "Royaume-Uni",
        "CATEGORIE": "Passenger Railways"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:35:41",
        "CLIENT": "70046023",
        "COMPTE": "02000-37207168936",
        "NOM DETENTEUR": "MR   CHOPADE SATISH",
        "CARTE": "445411******2849=2209",
        "PRODUIT": "VISA Gold",
        "NATURE": "RETRAIT DAB",
        "MONTANT_TRANS": 10000,
        "DEVISE_TRANS": "INR",
        "MONTANT_COMPENS": 120.48,
        "EUR": "EUR",
        "MONTANT_XAF": 79030,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "6000",
        "BENEFICIAIRE": "GANESH AANGAN NARHE 1",
        "PAYS": "Inde",
        "CATEGORIE": "Automated Cash Disburse"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:36:45",
        "CLIENT": "70046023",
        "COMPTE": "02000-37207168936",
        "NOM DETENTEUR": "MR   CHOPADE SATISH",
        "CARTE": "445411******2849=2209",
        "PRODUIT": "VISA Gold",
        "NATURE": "RETRAIT DAB",
        "MONTANT_TRANS": 10000,
        "DEVISE_TRANS": "INR",
        "MONTANT_COMPENS": 120.48,
        "EUR": "EUR",
        "MONTANT_XAF": 79030,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "6000",
        "BENEFICIAIRE": "GANESH AANGAN NARHE 1",
        "PAYS": "Inde",
        "CATEGORIE": "Automated Cash Disburse"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:37:44",
        "CLIENT": "70046023",
        "COMPTE": "02000-37207168936",
        "NOM DETENTEUR": "MR   CHOPADE SATISH",
        "CARTE": "445411******2849=2209",
        "PRODUIT": "VISA Gold",
        "NATURE": "RETRAIT DAB",
        "MONTANT_TRANS": 10000,
        "DEVISE_TRANS": "INR",
        "MONTANT_COMPENS": 120.48,
        "EUR": "EUR",
        "MONTANT_XAF": 79030,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "6000",
        "BENEFICIAIRE": "GANESH AANGAN NARHE 1",
        "PAYS": "Inde",
        "CATEGORIE": "Automated Cash Disburse"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:38:46",
        "CLIENT": "70046023",
        "COMPTE": "02000-37207168936",
        "NOM DETENTEUR": "MR   CHOPADE SATISH",
        "CARTE": "445411******2849=2209",
        "PRODUIT": "VISA Gold",
        "NATURE": "RETRAIT DAB",
        "MONTANT_TRANS": 10000,
        "DEVISE_TRANS": "INR",
        "MONTANT_COMPENS": 120.48,
        "EUR": "EUR",
        "MONTANT_XAF": 79030,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "6000",
        "BENEFICIAIRE": "GANESH AANGAN NARHE 1",
        "PAYS": "Inde",
        "CATEGORIE": "Automated Cash Disburse"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:39:17",
        "CLIENT": "70008164",
        "COMPTE": "01100-37207033229",
        "NOM DETENTEUR": "MLLE BAZEBIKOUELA FRANCESCA MA",
        "CARTE": "445410******1703=2202",
        "PRODUIT": "VISA Classique",
        "NATURE": "RETRAIT DAB",
        "MONTANT_TRANS": 305,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 305,
        "EUR": "EUR",
        "MONTANT_XAF": 200067,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "6000",
        "BENEFICIAIRE": "497208300026214",
        "PAYS": "France",
        "CATEGORIE": "Automated Cash Disburse"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:39:45",
        "CLIENT": "70046023",
        "COMPTE": "02000-37207168936",
        "NOM DETENTEUR": "MR   CHOPADE SATISH",
        "CARTE": "445411******2849=2209",
        "PRODUIT": "VISA Gold",
        "NATURE": "RETRAIT DAB",
        "MONTANT_TRANS": 10000,
        "DEVISE_TRANS": "INR",
        "MONTANT_COMPENS": 120.48,
        "EUR": "EUR",
        "MONTANT_XAF": 79030,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "6000",
        "BENEFICIAIRE": "GANESH AANGAN NARHE 1",
        "PAYS": "Inde",
        "CATEGORIE": "Automated Cash Disburse"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:43:09",
        "CLIENT": "02912500",
        "COMPTE": "01100-02000344660",
        "NOM DETENTEUR": "MR   BOKIBA ANDRE",
        "CARTE": "445411******9465=2202",
        "PRODUIT": "VISA Gold",
        "NATURE": "RETRAIT DAB",
        "MONTANT_TRANS": 165,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 165,
        "EUR": "EUR",
        "MONTANT_XAF": 108233,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "6000",
        "BENEFICIAIRE": "453347147060324",
        "PAYS": "France",
        "CATEGORIE": "Automated Cash Disburse"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:50:44",
        "CLIENT": "70034666",
        "COMPTE": "01100-37107125311",
        "NOM DETENTEUR": "SERFIN S.A",
        "CARTE": "445411******6676=2305",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 33.95,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 30.26,
        "EUR": "EUR",
        "MONTANT_XAF": 19849,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "EIG*BLUEHOST.COM",
        "PAYS": "États-Unis",
        "CATEGORIE": "Direct Marketing - Subscription"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:52:59",
        "CLIENT": "70064535",
        "COMPTE": "01100-37207288307",
        "NOM DETENTEUR": "MR   POATY STEEVE",
        "CARTE": "445410******9441=2212",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 38.42,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 34.11,
        "EUR": "EUR",
        "MONTANT_XAF": 22375,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "TREWOLS.COM",
        "PAYS": "États-Unis",
        "CATEGORIE": "Direct Marketing - Inbound Tele"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "08:57:17",
        "CLIENT": "70064535",
        "COMPTE": "01100-37207288307",
        "NOM DETENTEUR": "MR   POATY STEEVE",
        "CARTE": "445410******9441=2212",
        "PRODUIT": "VISA Classique",
        "NATURE": "PAIEMENT INTERNET",
        "MONTANT_TRANS": 34.82,
        "DEVISE_TRANS": "USD",
        "MONTANT_COMPENS": 30.91,
        "EUR": "EUR",
        "MONTANT_XAF": 20276,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "DONUPP.COM",
        "PAYS": "États-Unis",
        "CATEGORIE": "Direct Marketing - Inbound Tele"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "09:06:08",
        "CLIENT": "70025493",
        "COMPTE": "01100-37207099575",
        "NOM DETENTEUR": "MME  HAJJ NOHAD",
        "CARTE": "445411******2652=2202",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 150,
        "DEVISE_TRANS": "EUR",
        "MONTANT_COMPENS": 150,
        "EUR": "EUR",
        "MONTANT_XAF": 98394,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "NEURO-JMG",
        "PAYS": "Belgique",
        "CATEGORIE": "Opticians, Eyeglasses"
    },
    {
        "DATE": " 01/03/2022 ",
        "HEURE": "09:07:23",
        "CLIENT": 12875456,
        "COMPTE": "01100-37207097195",
        "NOM DETENTEUR": "Restaurant le Citron Vert",
        "CARTE": "445411******3391=2211",
        "PRODUIT": "VISA Gold",
        "NATURE": "PAIEMENT TPE",
        "MONTANT_TRANS": 56,
        "DEVISE_TRANS": "AED",
        "MONTANT_COMPENS": 13.69,
        "EUR": "EUR",
        "MONTANT_XAF": 8980,
        "COURS_CHANGE": "655.957",
        "COMMISSION": "3000",
        "BENEFICIAIRE": "CARS TAXI SERVICES CO",
        "PAYS": "Émirats Arabes Unis",
        "CATEGORIE": "Commuter Transport, Ferries"
    }
]

