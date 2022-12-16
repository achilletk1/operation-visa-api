import { visaOperationsCollection } from '../../collections/visa-operations.collection';
import { settingsFilesCollection } from '../../collections/settings-files.collection';
import moment = require('moment');
import { isEmpty } from 'lodash';
import { OpeVisaStatus } from '../../models/visa-operations';

export const getTransactionType = (type: string) => {
    const data = {
        100: ['PAIEMENT TPE', 'RETRAIT DAB'],
        200: ['PAIEMENT INTERNET'],
    }

    return { $in: data[type] };

}

export const updateOperationStatus = async (operation: any) => {
    if (!operation.attachements || operation.attachements.length === 0) {
        operation.status = 100;
        return
    }
    operation.status = 101;
    const settingsFiles = await settingsFilesCollection.getSettingsFilesBy({ types: [...operation.operationTypes] });
    let isExist;
    let isValidate;
    let isRejected;
    let files = [];

    settingsFiles.forEach((element) => {
        files.push(...element.files.map(e => { return { ...e, type: element.type } }).filter(elt => elt.isRequired === true));
    })
    for (let element of files) {
        const index = operation.attachements.findIndex(att => att.type === element.type && att.label === element.label);
        isExist = index >= 0;
        if (!isExist) break;
    }

    if (isExist) {
        operation.status = 200;
        for (let element of files) {
            const file = operation.attachements.find(att => att.type === element.type && att.label === element.label);
            isRejected = file.status === 400;
            if (isRejected) break;
        }
        if (isRejected) {
            return operation.status = 202;
        }

        for (let element of files) {
            const file = operation.attachements.find(att => att.type === element.type && att.label === element.label);
            isValidate = file && file.status === 300
            if (!isValidate) break;
        }
        if (isValidate) {
            operation.status = 201;
        }
    }

}


export const verifyTransactionFileName = (fileName: string) => {
    fileName = fileName.toLowerCase();
    const data = fileName.split('_');
    return data[0] === 'bci' && data[1] === 'hors' && data[2] === 'cemac' && /20\d{2}(0[ 1-9 ]|1[ 0-2 ])$/.test(data[3]);
}

export const verifyTransactionNotEmptyFile = (dataArray: any[]) => {
    return dataArray.length > 0;
}

export const verifyTransactionFileContent = (dataArray: any[], fileName: string) => {
    const month = fileName.split('_')[3];
    return dataArray.findIndex((element) => {
        let currentMonth = element['DATE'].split('/');
        currentMonth.shift();
        currentMonth = [currentMonth[1].trim(), currentMonth[0].trim()].join('');
        return month !== currentMonth;
    });
}

export const verifyTransactionFileTypeContent = (dataArray: any) => {
    let arrayIndex: any;
    const found = dataArray.find((element: any, index: number) => {
        arrayIndex = index;
        return !['PAIEMENT TPE', 'RETRAIT DAB', 'PAIEMENT INTERNET'].includes(element['NATURE']);
    });
    if (!found) {
        return null;
    }
    return { found, arrayIndex }
}

export const getExtensionByContentType = (contentType: string) => {
    const data = {
        'image/bmp': '.bmp',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/epub+zip': '.epub',
        'image/gif': '.gif',
        'image/jpeg': '.jpeg',
        'image/png': '.png',
        'application/pdf': '.pdf',
        'application/vnd.ms-powerpoint': '.ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
        'application/rtf': '.rtf',
        'application/vnd.rar': '.rar',
        'image/svg+xml': '.svg',
        'application/x-tar': '.tar',
        'image/tiff': '.tiff',
        'text/plain': '.txt',
        'application/vnd.visio': '.vsd',
        'application/vnd.ms-excel': '.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
        'application/xml': '.xml',
        'text/xml': '.xml',
        'application/atom+xml': '.xml',
        'application/zip': '.zip',
        'application/x-7z-compressed': '.7z',
    }

    return data[contentType];

}

export const getContentTypeByExtension = (extension: string) => {
    const data = {
        '.bmp': 'image/bmp',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.epub': 'application/epub+zip',
        '.gif': 'image/gif',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.pdf': 'application/pdf',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.rtf': 'application/rtf',
        '.rar': 'application/vnd.rar',
        '.svg': 'image/svg+xml',
        '.tar': 'application/x-tar',
        '.tiff': 'image/tiff',
        '.txt': 'text/plain',
        '.vsd': 'application/vnd.visio',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xml': 'application/xml',
        '.zip': 'application/zip',
        '.7z': 'application/x-7z-compressed',
    }

    return data[extension];

}

export const generateOperationData = async (clientCode: string): Promise<void> => {
    const operations = await visaOperationsCollection.getVisaOperationsBy({ clientCode });
    const currentMonth = moment().subtract(1, 'M').startOf('M').valueOf();
    let operation: any
    if (operations) {
        operation = operations.find(e => {
            return e.currentMonth === currentMonth;
        })
    }
    if (!operation) {
        operation = {
            clientCode,
            currentMonth,
            nbrTransactions: {
                tpew: 15, // Retrait et payement tpe
                onp: 15, // payement en ligne
            },
            amounts: {
                tpew: 15000000, // Retrait et payement tpe
                onp: 15000000, // payement en ligne
            },
            operationTypes: [100, 200],
            attachements: [],
            date: {
                created: moment().valueOf(),
            },
            status: 100,
        }
        await visaOperationsCollection.insertOperations(operation)
    }
}
export const getStatementByStatus = (statement: any[]) => {
    const tabStatus = [100, 200, 300, 400]
    let data = []
    for (const iterator of tabStatus) {
        const found = statement.filter(v => {
            return v._id === iterator
        }).map((elt) => elt.valueResult);
        let valueResult = 0;
        if (!isEmpty(found)) {
            valueResult = found.reduce((u, v) => u + v)
        }
        data.push({
            _id: iterator,
            valueResult: valueResult

        })

    }

    return data;
}
export const getStatusExpression = (status: OpeVisaStatus) => {
    const dataLabel = { 100: 'NON RENSEGNEE', 200: 'VALIDÉE', 300: 'REJETÉE', 400: 'EN COURS' };
    return dataLabel[status];
}

export const transformDateExpression = (str: any): any => {
    if (!str) { return '' }
    str = str.toString()
    const months = { '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril', '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août', '09': 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre' }
    const month = str.slice(str.length - 2);
    const year = str.slice(0, str.length - 2);
    return `${months[month]} ${year}`;
}

export const transformStepExpression = (str: any): any => {
    if (!str) { return '' }

    const data = {
        'proofTravel': 'la preuve de voyage',
        'expenseDetails': 'Etat détaillé des dépenses',
        'othersAttachements': 'Autre justificatis de dépense',
    }

    return data[str];
}

