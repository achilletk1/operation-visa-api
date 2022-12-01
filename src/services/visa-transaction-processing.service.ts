import moment from 'moment';
import { logger } from "../winston";
import { get, isEmpty } from "lodash";
import { visaTransactinnsTmpCollection } from "../collections/visa_transactions_tmp.collection";
import { Travel, TravelType } from "../models/travel";
import { travelsCollection } from "../collections/travels.collection";
import { travelService } from "./travel.service";
import { OpeVisaStatus } from "../models/visa-operations";
import { travelMonthsCollection } from "../collections/travel-months.collection";
import { onlinePaymentsCollection } from "../collections/online-payments.collection";
import { visaTransactionsCollection } from "../collections/visa-transactions.collection";
import { onlinePaymentsService } from "./online-payment.service";
import { ObjectId } from 'mongodb';
import { notificationService } from './notification.service';
import { lettersCollection } from '../collections/letters.collection';
import { cbsService } from './cbs.service';


export const visaTransactonsProcessingService = {


    startTransactionsProcessing: async (): Promise<any> => {
        try {
            const content = await visaTransactinnsTmpCollection.getAllVisaTransactionTmps();
            if (isEmpty(content)) { return; }
            const transactions = extractTransactionsFromContent(content);
            const clientCodes = {};
            const toBeDeleted = [];

            // Organize transactions by clientcodes and types
            for (const transaction of transactions) {
                const cli = transaction?.clientCode.toString();
                const type = getOperationType(transaction?.type);
                if (isEmpty(clientCodes[cli])) { clientCodes[cli] = {} }

                if (isEmpty(clientCodes[cli][type])) { clientCodes[cli][type] = [] }

                clientCodes[cli][type].push(transaction);
                toBeDeleted.push(new ObjectId(transaction?._id.toString()));


            }

            // tslint:disable-next-line: forin
            for (const cli in clientCodes) {

                // Travel traitment
                const onlinePaymentMonthsTransactions = await travelTreatment(cli, clientCodes[cli].travel, clientCodes[cli].onlinepayment);


                // Online payment traitment
                await onlinePaymentTreatment(cli, onlinePaymentMonthsTransactions);




            }
            await visaTransactionsCollection.insertTransactions(transactions);
            await visaTransactinnsTmpCollection.deleteManyVisaTransactionsTmpById(toBeDeleted);
        } catch (error) {
            logger.error(`error during startTransactionTraitment \n${error.name} \n${error.stack}\n`);
            return error;
        }
    },

    startRevivalMail: async (): Promise<any> => {
        const travels = await travelsCollection.getTravelsBy({ 'proofTravel': OpeVisaStatus.PENDING });

        for (const travel of travels) {
            const firstDate = Math.min(...travel?.transactions.map((elt => elt.date)));
            const currentDate = moment().valueOf();
            let userData: any;
            if (moment(currentDate).diff(firstDate, 'days') === 30) {
                userData = await cbsService.getUserDataByCode(get(travel, 'user.clientCode'));
                const letter = await lettersCollection.getLetterBy({});
                if (!letter) { return; }
                await notificationService.sendEmailFormalNotice(letter, userData, get(travel, 'user'), get(travel, 'user.email'), 'fr');
                continue;
            }


            if (moment(currentDate).diff(firstDate, 'days') === 15) {
                userData = await cbsService.getUserDataByCode(get(travel, 'user.clientCode'));
                const letter = await lettersCollection.getLetterBy({});
                if (!letter) { return; }
                await notificationService.sendVisaTemplateEmail(travel, userData, 'Preuve de voyage non justifiée', 'relance');
                continue;
            }


        }
    }

};

const travelTreatment = async (cli: string, travelTransactions: any[], onlinePaymentsTransactions: any[]): Promise<any[]> => {

    if (!travelTransactions) { return onlinePaymentsTransactions; }
    let foundIndex = 0
    const savingContent = [];

    for (const transaction of travelTransactions) {

        let travel = await travelsCollection.getTravelBy({ 'user.clientCode': cli, "proofTravel.dates.start": { $lte: transaction }, "proofTravel.dates.end": { $gte: transaction } });

        if (!travel) {
            const firstDate = Math.min(savingContent[foundIndex]?.transactions.map((elt => elt.date))) || 0;
            const maxDate = moment(firstDate).add(30, 'days');

            if ((transaction.date > maxDate || !!savingContent[foundIndex]?.travel) && foundIndex > 0) {
                foundIndex++;
            }


            if (isEmpty(savingContent[foundIndex])) { savingContent[foundIndex] = { transactions: [] } }


            savingContent[foundIndex].transactions.push(transaction);

            continue;

        }

        if (!savingContent[foundIndex]?.travel || savingContent[foundIndex]?.travel?._id !== travel?._id) {
            foundIndex++;
        }

        if (isEmpty(savingContent[foundIndex])) { savingContent[foundIndex] = { transactions: [] } }

        savingContent[foundIndex].transactions.push(transaction);

        savingContent[foundIndex].travel = travel;

    }

    return insertTransactionsInTravels(cli, savingContent, onlinePaymentsTransactions);

}


const onlinePaymentTreatment = async (cli: string, onlinepaymentTransactions: any[]) => {
    if (!onlinepaymentTransactions) { return; }

    const months = onlinepaymentTransactions.map((elt) => moment(elt.date).format('YYYYMM')).filter((item, pos, self) => self.indexOf(item) === pos);

    for (const month of months) {

        const selectedTransactions = onlinepaymentTransactions.filter(elt => moment(elt.date).format('YYYYMM') === month);

        let onlinePayment = await onlinePaymentsCollection.getOnlinePaymentBy({ 'user.clientCode': cli, currentMonth: +month });

        if (!onlinePayment) {
            onlinePayment = {
                user: {
                    clientCode: cli,
                    fullName: selectedTransactions[0].fullName

                },
                currentMonth: +month,
                status: OpeVisaStatus.PENDING,
                dates: {
                    created: null,
                },
                amounts: 0,
                ceiling: 0,
                statements: [],
                transactions: [],
                othersAttachements: []
            }
            const insertedId = await onlinePaymentsService.insertOnlinePayment(onlinePayment);
            onlinePayment._id = insertedId;
        }

        onlinePayment.transactions.push(...selectedTransactions);

        onlinePayment.dates.updated = moment().valueOf();

        const totalAmount = getTotal(onlinePayment.transactions);
        onlinePayment.amounts = totalAmount;
        const firstDate = Math.min(onlinePayment?.transactions.map((elt => elt.date))) || 0;


        if (totalAmount > onlinePayment.ceiling) {
            await notificationService.sendEmailVisaExceding(onlinePayment, get(onlinePayment, 'user.email'), firstDate, onlinePayment.dates.created, totalAmount)
            logger.debug(`Exeding online payment, id: ${onlinePayment._id}`);
        }

        await onlinePaymentsCollection.updateOnlinePaymentsById(onlinePayment?._id, onlinePayment);
    }

}


const getOperationType = (type: string) => {
    if (type === 'PAIEMENT INTERNET') { return 'onlinepayment' }
    if (['RETRAIT DAB', 'PAIEMENT TPE']) { return 'travel' }
};

const getTotal = (transactions: any[]) => {
    if (!transactions || isEmpty(transactions)) { return 0; }
    const totalAmountTransaction = transactions.map((elt) => elt.amount).reduce((elt, prev) => elt + prev, 0);

    return totalAmountTransaction;
};


const extractTransactionsFromContent = (dataArray) => {

    const transactions = dataArray.map((element) => {
        return {
            _id: element._id,
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
            currentMonth: moment(`${element['DATE'].trim()}`, 'dd/MM/YYYY').format('YYYYMM').toString(),
            reference: '',
            statementRef: '',
        }
    });

    return transactions;
}

const insertTransactionsInTravels = async (cli: string, data: any[], onlinePaymentsTransactions: any[]) => {
    for (const element of data) {

        if (isEmpty(element.transactions)) { return }

        const firstDate = Math.min(element?.transactions.map((elt => elt.date)));
        const lastDate = Math.min(element?.transactions.map((elt => elt.date)));

        let travel = element.travel;

        if (travel && travel.travelType === TravelType.SHORT_TERM_TRAVEL) { travel.transactions.push(...element.transactions); }

        if (!travel) {
            travel = {
                status: OpeVisaStatus.PENDING,
                user: {
                    _id: null,
                    clientCode: cli,
                    fullName: element.transactions[0].fullName,

                },
                travelRef: '',
                travelType: TravelType.SHORT_TERM_TRAVEL,
                ceiling: 0,
                dates: {
                    created: moment().valueOf(),
                    updated: null,
                },
                proofTravel: {
                    continents: [],
                    countries: [],
                    dates: {
                        start: firstDate,
                        end: lastDate,
                    },
                    status: OpeVisaStatus.PENDING,
                    comment: '',
                    travelReason: {
                        _id: null,
                        label: '',
                        otherLabel: '',
                    },
                    isTransportTicket: false,
                    isVisa: false,
                    isPassOut: false,
                    isPassIn: false,
                    proofTravelAttachs: [],
                    rejectReason: '',
                    validators: []
                },
                expenseDetails: [],
                othersAttachements: [],
                transactions: element.transactions,
            };
            const insertedId = await travelService.insertTravelFromSystem(travel);

            if (insertedId instanceof Error) { continue }

            travel._id = insertedId;
        }


        if (travel.travelType === TravelType.LONG_TERM_TRAVEL) {
            const mergedTransactions = [...element.transactions, ...onlinePaymentsTransactions];
            const months = mergedTransactions.map((elt) => moment(elt.date).format('YYYYMM')).filter((item, pos, self) => self.indexOf(item) === pos);
            for (const month of months) {

                const selectedTransactions = element.transactions.filter(elt => moment(elt.date).format('YYYYMM') === month);
                const selectedTransactionsOnlinePayment = onlinePaymentsTransactions.filter(elt => moment(elt.date).format('YYYYMM') === month);
                onlinePaymentsTransactions = onlinePaymentsTransactions.filter(elt => moment(elt.date).format('YYYYMM') !== month);
                selectedTransactions.push(...selectedTransactionsOnlinePayment);
                let travelMonth = await travelMonthsCollection.getTravelMonthBy({ travelId: travel?._id, month });

                if (travelMonth) { travelMonth.transactions.push(...selectedTransactions) }

                if (!travelMonth) {
                    travelMonth = {
                        status: OpeVisaStatus.PENDING,
                        userId: travel?.user?._id,
                        clientCode: travel?.user?.clientCode,
                        travelId: travel?._id,
                        month,
                        dates: {
                            created: moment().valueOf(),
                            updated: null,
                        },
                        expenseDetails: [],
                        transactions: selectedTransactions

                    }

                    const insertedId = await travelMonthsCollection.insertVisaTravelMonth(travelMonth);

                    travelMonth._id = insertedId;
                }
                travelMonth.dates.updated = moment().valueOf();

                const totalAmount = getTotal(travelMonth.transactions);
                if (totalAmount > travel.ceiling) {
                    const firstDateTransactions = Math.min(...mergedTransactions.map((elt => elt.date)));
                    await notificationService.sendEmailVisaExceding(travel, get(travel, 'user.email'), firstDateTransactions, travelMonth.dates.created, totalAmount)
                    logger.debug(`Exeding travel month, id: ${travelMonth._id}`);

                }

                await travelMonthsCollection.updateTravelMonthsById(travelMonth?._id, travelMonth);

            }



        }

        travelsCollection.updateTravelsById(get(travel, '_id').toString(), travel);

        if (travel.travelType === TravelType.SHORT_TERM_TRAVEL) {
            const totalAmount = getTotal(travel.transactions);
            if (totalAmount > travel.ceiling) {
                await notificationService.sendEmailVisaExceding(travel, get(travel, 'user.email'), firstDate, travel.dates.created, totalAmount)
                logger.debug(`Exeding travel, id: ${travel?._id}`);

            }
        }
    }
    return onlinePaymentsTransactions;
}
