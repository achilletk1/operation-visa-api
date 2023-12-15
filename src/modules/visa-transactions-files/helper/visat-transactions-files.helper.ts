import { OperationType } from "modules/visa-operations";
import { excelToJson, isDev } from "common/helpers";
import { config } from "convict-config";
import { get } from "lodash";
import moment from "moment";

export async function calculateOverruns(account: any, transactions: any[], month: any, ceilling: any, user: any) {
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
    cards = cards.filter((item: any, pos: any, self: any) => { return self.indexOf(item) === pos; });

    // verifier si il y'a dépassement de plafond
    if (sumPaymentOnline > ceilling.onp || sumElectornicPaymentTerminalsAndDAB > ceilling.tpew) {
        const operationTypes = [];
        if (sumElectornicPaymentTerminalsAndDAB > ceilling.tpew) { operationTypes.push(OperationType.ELECTRONIC_PAYMENT_TERMINAL); }

        if (sumPaymentOnline > ceilling.onp) { operationTypes.push(OperationType.ONLINE_PAYMENT); }

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
        operation = /*await visaOperationsCollection.getVisaOperationBy({ clientCode: account.split('-')[2], ncp: account.split('-')[1], currentMonth: +month })*/ [] as any[];
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
            // await visaOperationsCollection.updateVisaOperationById(get(operation, '_id').toString(), operation);

        } else {
            operation = {
                clientCode: account.split('-')[2],
                ncp: account.split('-')[1],
                userId: get(user, '_id').toString(),
                currentMonth: +month,
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
            // await visaOperationsCollection.insertOperations(operation);
        }
        // await visaTransactionsCollection.insertTransactions(transactonByNcp);
        const email = isDev ? 'dimitri.signe@londo.io' : get(user, 'email');
        // eslint-disable-next-line no-undef
        await Promise.all([
            // notificationService.sendEmailToVisaDepassementClient(email, { currentMonth: +month, name: `${get(user, 'fname')} ${get(user, 'lname')}`, ncp: account.split('-')[1] }),
            // notificationService.sendSMSToVisaDepassementClient(get(user, 'tel'), { currentMonth: +month, name: get(user, 'name'), ncp: account.split('-')[1] })
        ]);
    }
};

export function calculateOverrunsNotCustomers(clientCode: any, transactions: any[], ceilling: any) {
    const transactonByClientCodes = transactions.filter((e: any) => { return e.clientCode === clientCode });

    let isDepassed = false;
    let accounts = transactonByClientCodes.map((element: any) => {
        return `${element.ncp}`
    });
    accounts = accounts.filter((item: any, pos: any, self: any) => self.indexOf(item) === pos);

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
        cards = cards.filter((item: any, pos: any, self: any) => { return self.indexOf(item) === pos; });

        // verifier si il y'a dépassement de plafond
        if (sumPaymentOnline > ceilling.onp || sumElectornicPaymentTerminalsAndDAB > ceilling.tpew) {
            isDepassed = true;
        }
    }
    return isDepassed;
};

export async function insertNotCustomersCorporates(clientCodes: string[], transactions: any[], month: any, ceilling: any) {
    const depassedClientCodes = [];
    for (const clientCode of clientCodes) {
        const isDepassed = calculateOverrunsNotCustomers(clientCode, transactions, ceilling);
        if (isDepassed === true) {
            depassedClientCodes.push(clientCode);
            const transactionsByClientCode = transactions.filter(element => { return element?.clientCode === clientCode });
            let cards = transactionsByClientCode.map((element) => { return element?.card.code; });
            const existTransaction = /*await visaTransactionsCollection.getVisaTransactionsForNotCustomersBy({ clientCode, currentMonth: month })*/ [] as any[];
            if (existTransaction) { continue }
            cards = cards.filter((item, pos, self) => self.indexOf(item) === pos);
            const dataToInsert = {
                clientCode,
                cards,
                transactions: transactionsByClientCode,
                currentMonth: +month,
            }
            // await visaTransactionsCollection.insertTransactionsForNotCustomers(dataToInsert);
        }
    }

    if (depassedClientCodes.length !== 0) {
        let index = 0;
        do {
            const filteredClientCodes = depassedClientCodes.slice(index, index + 100)
            const dataTels = /*await cbsService.getClientsTels(filteredClientCodes)*/ [] as any[];
            const dataEmails = /*await cbsService.getClientsEmails(filteredClientCodes)*/ [] as any[];
            await Promise.all([
                ...dataEmails.map(async (element: any) => {
                    const email = config.get('env') === 'development' ? 'dimitri.signe@londo.io' : element.EMAIL;
                    // await notificationService.sendEmailToVisaDepassementClient(email, { name: element.NOMREST, currentMonth: +month });
                }),
                ...dataTels.map(async (element: any) => {
                    // await notificationService.sendSMSToVisaDepassementClient(element.TEL, { name: element.NOMREST, currentMonth: +month });
                })
            ]);
            index = index + 100
        } while (index < depassedClientCodes.length);
    }
};

export function extractTransactionsFromContent(content: any[], month: string) {

    const dataArray = excelToJson(content);


    const transactions = dataArray.map((element: any) => {
        return {
            clientCode: element.CLIENT.toString().trim(),
            fullName: element['NOM DETENTEUR'].trim(),
            beneficiary: element.BENEFICIAIRE.trim(),
            amount: +element.MONTANT_XAF || 0,
            amountTrans: +element.MONTANT_TRANS || 0,
            currencyTrans: +element.DEVISE_TRANS || 0,
            amountCompens: +element.MONTANT_COMPENS || 0,
            eur: +element.EUR || 0,
            cours_change: +element.COURS_CHANGE || 0,
            commission: +element.COMMISSION || 0,
            date: moment(`${element.DATE.trim()} ${element.HEURE.trim()}`, 'dd/MM/YYYY HH:mm:ss').valueOf(),
            type: element.NATURE,
            ncp: element.COMPTE.trim().split('-')[1],
            age: element.COMPTE.trim().split('-')[0],
            card: {
                code: element.CARTE.trim(),
                label: element.PRODUIT.trim(),
            },
            country: element.PAYS.trim(),
            category: element.CATEGORIE.trim(),
            currentMonth: month
        }
    });

    return transactions;
};

export function verifyTransactionFileTypeContent(dataArray: any) {
    let arrayIndex;
    const found = dataArray.find((element: any, index: number) => {
        arrayIndex = index;
        return !['PAIEMENT TPE', 'RETRAIT DAB', 'PAIEMENT INTERNET'].includes(element['NATURE']);
    });
    if (!found) { return null; }
    return { found, arrayIndex };
};

export function verifyTransactionFileContent(dataArray: any[], fileName: string) {
    const month = fileName.split('_')[3];
    return dataArray.findIndex((element) => {
        let currentMonth = element['DATE'].split('/');
        currentMonth.shift();
        currentMonth = [currentMonth[1].trim(), currentMonth[0].trim()].join('');
        return month !== currentMonth;
    });
};

export function verifyTransactionNotEmptyFile(dataArray: any[]) {
    return dataArray.length > 0;
};

export function verifyTransactionFileName(fileName: string) {
    fileName = fileName.toLowerCase();
    const data = fileName.split('_');
    return data[0] === 'bicec' && data[1] === 'hors' && data[2] === 'cemac' && /20\d{2}(0[ 1-9 ]|1[ 0-2 ])$/.test(data[3]);
};

export const verifyTransactionFile = (header: string[]) => {
    const data =
        [
            'DATE',
            'HEURE',
            'CLIENT',
            'COMPTE',
            'NOM DETENTEUR',
            'CARTE',
            'PRODUIT',
            'NATURE',
            'MONTANT_TRANS',
            'DEVISE_TRANS',
            'MONTANT_COMPENS',
            'EUR',
            'MONTANT_XAF',
            'COURS_CHANGE',
            'COMMISSION',
            'BENEFICIAIRE',
            'PAYS',
            'CATEGORIE',
        ];
    const containsAll = data.find(element => {
        return !header.includes(element);
    });

    return containsAll;
};
