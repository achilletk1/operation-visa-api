import { visaTransactionsCeillingsCollection } from '../collections/visa-transactions-ceilings.collection';
import { visaTransactionsFilesCollection } from '../collections/visa-transactions-files.collections';
import { visaTransactionsCollection } from '../collections/visa-transactions.collection';
import { visaOperationsCollection } from '../collections/visa-operations.collection';
import { OperationType } from './../models/visa-operations';
import { usersCollection } from '../collections/users.collection';
import  helper from './helpers/visa-operations.service.helper';
import { filesCollection } from '../collections/files.collection';
import { notificationService } from './notification.service';
import httpContext = require('express-http-context');
import { commonService } from './common.service';
// import { cbsService } from './cbs.service';
import { logger } from '../winston';
import { config } from '../config';
import moment = require('moment');
import { get } from 'lodash';

export const visaTransactionsService = {

    getVisaTransactions: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit, userId, card, type } = filters;
            // if (userId) {
            //     // const { clientCode } = await notSubscriberCollection.getNotSubscriberById(userId);
            //     if (!clientCode) { return new Error('ClientNotFound') }
            //     filters['clientCode'] = clientCode;
            //     delete filters.userId;
            // }
            if (card) {
                filters['card.code'] = card;
                delete filters.card;
            }

            if (type) {
                filters['type'] = helper.getTransactionType(type);
            }
            delete filters.offset;
            delete filters.limit;
            return await visaTransactionsCollection.getVisaTransactions(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting visa operations \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },


    getVisaTransactionById: async (id: string) => {
        try {
            return await visaTransactionsCollection.getVisaTransactionsById(id);
        } catch (error) {
            logger.error(`\nError getting visa transaction by id \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    verifyTransactionFiles: async (data: any) => {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) { return new Error('Forbbiden'); }

            const user = await usersCollection.getUserById(get(authUser, '_id'));
            if (!user) { return new Error('Forbbiden'); }

            let { content, label, email } = data;
            content = Buffer.from(content).toString('base64');

            const fileName = label.replace('.xlsx' || '.xls', '');
            const found = await visaTransactionsFilesCollection.getVisaTransactionsFileBy({ label });
            if (found) { return new Error('FileAlreadyExist') }
            const isNameCorrect = helper.verifyTransactionFileName(fileName);
            if (!isNameCorrect) { return new Error('IncorrectFileName') }

            const dataArray = commonService.excelToJson(content);

            const fileIsNotEmpty = helper.verifyTransactionNotEmptyFile(dataArray);
            if (!fileIsNotEmpty) { return new Error('FileIsEmpty'); }
            const containsAll = helper.verifyTransactionFile(Object.keys(dataArray[0]));
            if (containsAll) {
                const error = new Error('IncorrectFileColumn');
                error['index'] = containsAll; return error
            }
            const monthsMatch = helper.verifyTransactionFileContent(dataArray, fileName);
            if (monthsMatch > -1) {
                const error = new Error('IncorrectFileMonth');
                error['index'] = monthsMatch + 2; return error
            }
            const typesMatch = helper.verifyTransactionFileTypeContent(dataArray);
            if (typesMatch) { const error = new Error('IncorrectFileType'); error['index'] = typesMatch.arrayIndex + 2; error['type'] = typesMatch.found['NATURE']; return error }
            if (!email) { email = get(user, 'email') };
            const transactionsFile = {
                label,
                month: parseInt(fileName.split('_')[3]),
                date: {
                    created: moment().valueOf(),
                },
                userId: get(authUser, '_id').toString(),
                // pending: moment().add(config.get('visaTransactionFilePendingValue'), 'minutes').valueOf(),
                content,
                email,
                status: 100

            }

            const insertedId = await visaTransactionsFilesCollection.insertVisaTransactionsFiles(transactionsFile);

            return { insertedId }

        } catch (error) {
            logger.error(`\nError verify transaction file \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    confirmTransactionFiles: async (id: string) => {
        try {

            const authUser = httpContext.get('user');
            if (!authUser) {
                return new Error('Forbbiden');
            }
            let transactionsFile = await visaTransactionsFilesCollection.getVisaTransactionsFilesById(id);

            const { userId, content, label } = transactionsFile;
            const fileName = label.replace('.xlsx' || '.xls', '');
            if (userId !== get(authUser, '_id').toString()) { return new Error('Forbbiden') }
            delete transactionsFile.pending;
            transactionsFile.status = 400;
            const code = `${get(transactionsFile, '_id').toString()}-${fileName}`
            transactionsFile = { ...transactionsFile, code };
            await filesCollection.saveFile({ key: code, value: content });
            return await visaTransactionsFilesCollection.updateVisaTransactionsFilesById(get(transactionsFile, '_id').toString(), transactionsFile, { pending: true });

        } catch (error) {
            logger.error(`\nError confirm transaction file \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    startTraitment: async (id: string) => {
        try {
            const transactionsFile = await visaTransactionsFilesCollection.getVisaTransactionsFilesById(id);

            const { content, month } = transactionsFile;

            const transactions = extractTransactionsFromContent(content, month);
            let accounts = transactions.map((element) => {
                return `${element.age}-${element.ncp}-${element.clientCode}`
            });

            accounts = accounts.filter((item, pos, self) => self.indexOf(item) === pos);
            const otherAccounts = [];
            const ceillings = await visaTransactionsCeillingsCollection.getVisaTransactionsCeillingsBy({});
            const ceilling = { onp: 0, tpew: 0 };
            ceilling.onp = ceillings.find(e => e.type === 100)?.value;
            ceilling.tpew = ceillings.find(e => e.type === 200)?.value;
            for (const account of accounts) {
                const user = await usersCollection.getUserBy({ clientCode: account.split('-')[2] });
                if (!user) {
                    otherAccounts.push(account);
                    continue;
                }
                await calculateOverruns(account, transactions, month, ceilling, user);

            }
            if (otherAccounts.length > 0) {
                let index = 0;
                let corporateAccounts = [];
                let otherClientCodes = otherAccounts.map(e => e.split('-')[2]);
                otherClientCodes = otherClientCodes.filter((item, pos, self) => self.indexOf(item) === pos);
                do {
                    const filteredClientCodes = otherClientCodes.slice(index, index + 100)
                    // const data = await cbsService.checkIfIsRetailClient(filteredClientCodes);
                    // corporateAccounts.push(...data);
                    index = index + 100
                } while (index < otherAccounts.length);
                await insertNotCustomersCorporates(corporateAccounts, transactions, month, ceilling);
            }
            transactionsFile.status = 200;
            delete transactionsFile.content;
            return await visaTransactionsFilesCollection.updateVisaTransactionsFilesById(get(transactionsFile, '_id').toString(), transactionsFile, { content: true });

        } catch (error) {
            logger.error(`\nError start transaction file traitment\n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    restartConfirmTransactionFiles: async (id: string) => {
        try {

            const authUser = httpContext.get('user');
            if (!authUser) {
                return new Error('Forbbiden');
            }
            let transactionsFile = await visaTransactionsFilesCollection.getVisaTransactionsFilesById(id);
            const { userId } = transactionsFile;
            if (userId !== get(authUser, '_id').toString()) { return new Error('Forbbiden') }
            return await visaTransactionsFilesCollection.updateVisaTransactionsFilesById(get(transactionsFile, '_id').toString(), { status: 400 }, { pending: true });

        } catch (error) {
            logger.error(`\nError restart confirm transaction file \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    restartTraitment: async (id: string) => {
        try {
            const transactionsFile = await visaTransactionsFilesCollection.getVisaTransactionsFilesById(id);

            const { content, month } = transactionsFile;
            await visaTransactionsCollection.deleteVisaTransactionsMany({ currentMonth: month });
            const transactions = extractTransactionsFromContent(content, month);
            let accounts = transactions.map((element) => {
                return `${element.age}-${element.ncp}-${element.clientCode}`
            });

            accounts = accounts.filter((item, pos, self) => self.indexOf(item) === pos);
            const otherAccounts = [];
            const ceillings = await visaTransactionsCeillingsCollection.getVisaTransactionsCeillingsBy({});
            const ceilling = { onp: 0, tpew: 0 };
            ceilling.onp = ceillings.find(e => e.type === 100).value;
            ceilling.tpew = ceillings.find(e => e.type === 200).value;
            for (const account of accounts) {
                const user = await usersCollection.getUserBy({ clientCode: account.split('-')[2] });
                if (!user) {
                    otherAccounts.push(account);
                    continue;
                }
                await calculateOverruns(account, transactions, month, ceilling, user);

            }
            if (otherAccounts.length > 0) {
                let index = 0;
                let corporateAccounts = [];
                let otherClientCodes = otherAccounts.map(e => e.split('-')[2]);
                otherClientCodes = otherClientCodes.filter((item, pos, self) => self.indexOf(item) === pos);
                do {
                    const filteredClientCodes = otherClientCodes.slice(index, index + 100)
                    // const data = await cbsService.checkIfIsRetailClient(filteredClientCodes);
                    // corporateAccounts.push(...data);
                    index = index + 100
                } while (index < otherAccounts.length);
                await insertNotCustomersCorporates(corporateAccounts, transactions, month, ceilling);
            }
            transactionsFile.status = 200;
            delete transactionsFile.content;
            return await visaTransactionsFilesCollection.updateVisaTransactionsFilesById(get(transactionsFile, '_id').toString(), transactionsFile, { content: true });

        } catch (error) {
            logger.error(`\nError restart transaction file traitment \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    sendPostTransactionFileThreadError: async (id: string) => {
        try {
            const transactionsFile = await visaTransactionsFilesCollection.getVisaTransactionsFilesById(id);
            const authUser = httpContext.get('user');
            if (!authUser) {
                return new Error('Forbbiden');
            }
            const { email, label } = transactionsFile;
            const response = await visaTransactionsFilesCollection.updateVisaTransactionsFilesById(id, { status: 300 });
            // await notificationService.sendPostTransactionFileThreadError({ fullName: `${get(authUser, 'fname')} ${get(authUser, 'lname')}`, label }, email)
            return response;
        } catch (error) {
            logger.error(`\nError sendPostTransactionFileThreadError \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    abortTransactionFiles: async (id: string) => {
        try {

            const authUser = httpContext.get('user');
            if (!authUser) {
                return new Error('Forbbiden');
            }
            return await visaTransactionsFilesCollection.deleteVisaTransactionsFile(id);
        } catch (error) {
            logger.error(`\nError post transaction file \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getTransactionFilesDataArray: async (id) => {
        try {
            const authUser = httpContext.get('user');
            if (!authUser) {
                return new Error('Forbbiden');
            }
            const transactionsFile = await visaTransactionsFilesCollection.getVisaTransactionsFilesById(id);

            const { content } = transactionsFile;

            let dataArray = commonService.excelToJson(content);
            dataArray = dataArray.slice(0, 40 || dataArray.length);
            return { dataArray };

        } catch (error) {
            logger.error(`\nError post transaction file \n${error.message}\n${error.stack}\n`);
            return error;
        }
    }
};


const extractTransactionsFromContent = (content, month) => {

    const dataArray = commonService.excelToJson(content);


    const transactions = dataArray.map((element) => {
        return {
            clientCode: element['CLIENT'].toString().trim(),
            fullName: element['NOM DETENTEUR'].trim(),
            beneficiary: element['BENEFICIAIRE'].trim(),
            amount: parseFloat(element['MONTANT_XAF']) || 0,
            amountTrans: parseFloat(element['MONTANT_TRANS']) || 0,
            currencyTrans: parseFloat(element['DEVISE_TRANS']) || 0,
            amountCompens: parseFloat(element['MONTANT_COMPENS']) || 0,
            eur: parseFloat(element['EUR']) || 0,
            cours_change: parseFloat(element['COURS_CHANGE']) || 0,
            commission: parseFloat(element['COMMISSION']) || 0,
            date: moment(`${element['DATE'].trim()} ${element['HEURE'].trim()}`, 'dd/MM/YYYY HH:mm:ss').valueOf(),
            type: element['NATURE'],
            ncp: element['COMPTE'].trim().split('-')[1],
            age: element['COMPTE'].trim().split('-')[0],
            card: {
                code: element['CARTE'].trim(),
                label: element['PRODUIT'].trim(),
            },
            country: element['PAYS'].trim(),
            category: element['CATEGORIE'].trim(),
            currentMonth: month
        }
    });

    return transactions;
}

const calculateOverruns = async (account: any, transactions: any, month: any, ceilling: any, user: any) => {
    const transactonByNcp = transactions.filter((e: any) => { return e.age === account.split('-')[0] && e.ncp === account.split('-')[1] && e.clientCode === account.split('-')[2] });    // filtrer les transactions pour Paiement TPE et Retrait DAB
    const electornicPaymentTerminalsAndDAB = transactonByNcp.filter((elt: any) => { return ['PAIEMENT TPE', 'RETRAIT DAB'].includes(elt.type); });
    let sumElectornicPaymentTerminalsAndDAB = 0;
    // calculer la somme des motants des transactions TPE et Retrait DAB
    if (electornicPaymentTerminalsAndDAB && electornicPaymentTerminalsAndDAB.length > 0) {
        sumElectornicPaymentTerminalsAndDAB = electornicPaymentTerminalsAndDAB.map((e: any) => e.amount).reduce((prev, next) => { return prev + next });
    }

    // filtrer les transactions pour Paiement en ligne
    const onlinePayment = transactonByNcp.filter((elt: any) => { return ['PAIEMENT INTERNET'].includes(elt.type); });
    let sumPaymentOnline = 0;
    // calculer la somme des motants des transactions Paiement en ligne
    if (onlinePayment && onlinePayment.length > 0) {
        sumPaymentOnline = onlinePayment.map((e: any) => e.amount).reduce((prev, next) => { return prev + next });
    }
    // Recuperer la liste des cartes
    let cards = transactonByNcp.map((element: any) => { return element.card.code; });

    // tslint:disable-next-line: only-arrow-functions
    cards = cards.filter(function (item, pos, self) { return self.indexOf(item) === pos; });

    // verifier si il y'a dépassement de plafond
    if (sumPaymentOnline > ceilling.onp || sumElectornicPaymentTerminalsAndDAB > ceilling.tpew) {
        const operationTypes = [];
        if (sumElectornicPaymentTerminalsAndDAB > ceilling.tpew) { operationTypes.push(200); }

        if (sumPaymentOnline > ceilling.onp) { operationTypes.push(100); }

        const transactionsBycards = cards.map((element: any) => {
            const tpewByCard = transactonByNcp.filter((elt: any) => {
                return ['PAIEMENT TPE', 'RETRAIT DAB'].includes(elt.type) && elt.card.code === element;
            });
            const onpByCard = transactonByNcp.filter((elt: any) => {
                return ['PAIEMENT INTERNET'].includes(elt.type) && elt.card.code === element;
            });
            return {
                card: element,
                amounts: {
                    tpew: tpewByCard.length > 0 ? tpewByCard.map(e => e.amount).reduce((prev, next) => { return prev + next }) : 0,
                    onp: onpByCard.length > 0 ? onpByCard.map(e => e.amount).reduce((prev, next) => { return prev + next }) : 0,
                },
                nbrTransactions: {
                    tpew: tpewByCard.length,
                    onp: onpByCard.length
                },
            };


        });
        let operation: any;
        operation = await visaOperationsCollection.getVisaOperationBy({ clientCode: account.split('-')[2], ncp: account.split('-')[1], currentMonth: parseInt(month) });
        if (operation) {
            operation.nbrTransactions = {
                tpew: electornicPaymentTerminalsAndDAB.length,
                onp: onlinePayment.length,
            };
            operation.amounts = {
                tpew: sumElectornicPaymentTerminalsAndDAB,
                onp: sumPaymentOnline,
            };
            operation.operationTypes = operationTypes;
            operation.cards = transactionsBycards;
            operation.date.updated = moment().valueOf();
            await visaOperationsCollection.updateVisaOperationById(get(operation, '_id').toString(), operation);

        } else {
            operation = {
                clientCode: account.split('-')[2],
                ncp: account.split('-')[1],
                userId: get(user, '_id').toString(),
                currentMonth: parseInt(month),
                nbrTransactions: {
                    tpew: electornicPaymentTerminalsAndDAB.length,
                    onp: onlinePayment.length,
                },
                amounts: {
                    tpew: sumElectornicPaymentTerminalsAndDAB,
                    onp: sumPaymentOnline,
                },
                operationTypes,
                cards: transactionsBycards,
                attachements: [],
                date: {
                    created: moment().valueOf(),
                },
                status: 100,
            };
            await visaOperationsCollection.insertOperations(operation);
        }
        await visaTransactionsCollection.insertTransactions(transactonByNcp);
        const email = config.get('env') === 'development' ? 'dimitri.signe@londo.io' : get(user, 'email');
        // eslint-disable-next-line no-undef
     /*    await Promise.all([
            notificationService.sendEmailToVisaDepassementClient(email, { currentMonth: parseInt(month), name: `${get(user, 'fname')} ${get(user, 'lname')}`, ncp: account.split('-')[1] }),
            notificationService.sendSMSToVisaDepassementClient(get(user, 'tel'), { currentMonth: parseInt(month), name: get(user, 'name'), ncp: account.split('-')[1] })
        ]); */
    }
}

const calculateOverrunsNotCustomers = (clientCode: any, transactions: any, ceilling: any) => {
    const transactonByClientCodes = transactions.filter((e: any) => { return e.clientCode === clientCode });

    let isDepassed = false;
    let accounts = transactonByClientCodes.map((element) => {
        return `${element.ncp}`
    });
    accounts = accounts.filter((item, pos, self) => self.indexOf(item) === pos);

    for (const ncp of accounts) {
        const transactonByNcp = transactions.filter((e: any) => { return e.ncp === ncp });
        // filtrer les transactions pour Paiement TPE et Retrait DAB
        const electornicPaymentTerminalsAndDAB = transactonByNcp.filter((elt: any) => { return ['PAIEMENT TPE', 'RETRAIT DAB'].includes(elt.type); });
        let sumElectornicPaymentTerminalsAndDAB = 0;
        // calculer la somme des motants des transactions TPE et Retrait DAB
        if (electornicPaymentTerminalsAndDAB && electornicPaymentTerminalsAndDAB.length > 0) {
            sumElectornicPaymentTerminalsAndDAB = electornicPaymentTerminalsAndDAB.map((e: any) => e.amount).reduce((prev, next) => { return prev + next });
        }

        // filtrer les transactions pour Paiement en ligne
        const onlinePayment = transactonByNcp.filter((elt: any) => { return ['PAIEMENT INTERNET'].includes(elt.type); });
        let sumPaymentOnline = 0;
        // calculer la somme des motants des transactions Paiement en ligne
        if (onlinePayment && onlinePayment.length > 0) {
            sumPaymentOnline = onlinePayment.map((e: any) => e.amount).reduce((prev, next) => { return prev + next });
        }
        // Recuperer la liste des cartes
        let cards = transactonByNcp.map((element: any) => { return element.card.code; });

        // tslint:disable-next-line: only-arrow-functions
        cards = cards.filter(function (item, pos, self) { return self.indexOf(item) === pos; });

        // verifier si il y'a dépassement de plafond
        if (sumPaymentOnline > ceilling.onp || sumElectornicPaymentTerminalsAndDAB > ceilling.tpew) {
            isDepassed = true;
        }
    }
    return isDepassed;
}

const insertNotCustomersCorporates = async (clientCodes: string[], transactions: any[], month: any, ceilling: any) => {
    const depassedClientCodes = [];
    for (const clientCode of clientCodes) {
        const isDepassed = calculateOverrunsNotCustomers(clientCode, transactions, ceilling);
        if (isDepassed === true) {
            depassedClientCodes.push(clientCode);
            const transactionsByClientCode = transactions.filter(element => { return element?.clientCode === clientCode });
            let cards = transactionsByClientCode.map((element) => { return element?.card.code; });
            const existTransaction = await visaTransactionsCollection.getVisaTransactionsForNotCustomersBy({ clientCode, currentMonth: month });
            if (existTransaction) { continue }
            cards = cards.filter((item, pos, self) => self.indexOf(item) === pos);
            const dataToInsert = {
                clientCode,
                cards,
                transactions: transactionsByClientCode,
                currentMonth: parseInt(month)
            }
            // await visaTransactionsCollection.insertTransactionsForNotCustomers(dataToInsert);
        }
    }

    // if (depassedClientCodes.length !== 0) {
    //     let index = 0;
    //     do {
    //         const filteredClientCodes = depassedClientCodes.slice(index, index + 100)
    //         const dataTels = await cbsService.getClientsTels(filteredClientCodes);
    //         const dataEmails = await cbsService.getClientsEmails(filteredClientCodes);
    //         await Promise.all([
    //             ...dataEmails.map(async (element) => {
    //                 const email = config.get('env') === 'development' ? 'dimitri.signe@londo.io' : element.EMAIL;
    //                 await notificationService.sendEmailToVisaDepassementClient(email, { name: element.NOMREST, currentMonth: +month });
    //             }),
    //             ...dataTels.map(async (element) => {
    //                 await notificationService.sendSMSToVisaDepassementClient(element.TEL, { name: element.NOMREST, currentMonth: +month });
    //             })
    //         ]);
    //         index = index + 100
    //     } while (index < depassedClientCodes.length);
    // }

}