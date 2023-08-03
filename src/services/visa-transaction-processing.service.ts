import { visaTransactinnsTmpCollection } from "../collections/visa_transactions_tmp.collection";
import { visaTransactionsCollection } from "../collections/visa-transactions.collection";
import { onlinePaymentsCollection } from "../collections/online-payments.collection";
import { travelMonthsCollection } from "../collections/travel-months.collection";
import { settingCollection } from "../collections/settings.collection";
import { lettersCollection } from '../collections/letters.collection';
import { travelsCollection } from "../collections/travels.collection";
import { onlinePaymentsService } from "./online-payment.service";
import { OnlinePaymentMonth } from "../models/online-payment";
import { notificationService } from './notification.service';
import { OpeVisaStatus } from "../models/visa-operations";
import { Travel, TravelType } from "../models/travel";
import { travelService } from "./travel.service";
import { get, isEmpty, template } from "lodash";
import { logger } from "../winston";
import { ObjectId } from "mongodb";
import moment from 'moment';
import { commonService } from "./common.service";
import * as formatHelper from './helpers/format.helper';
import { templatesCollection } from "../collections/templates.collection";


export const visaTransactonsProcessingService = {


    startTransactionsProcessing: async (): Promise<any> => {
        try {
            const setting = await settingCollection.getSettingsByKey('visa_transaction_tmp_treatment_in_progress');
            if (setting?.value === true) { console.log('TRAITMENT IS IN PROGRESS WAITING WHEN IT WILL FINISH'); return }
            settingCollection.insertSetting({ key: 'visa_transaction_tmp_treatment_in_progress', value: true });

            const content = await visaTransactinnsTmpCollection.getAllVisaTransactionTmps();
            if (isEmpty(content)) { return; }

            let transactions = formatTransactions(content || []);

            // transactions = await verifyIfisInLongTermTravel(transactions);

            // const { onpTransactions, travelTransactions } = groupByType(transactions);

            // for (const transaction of onpTransactions) {
            //     // await onlinePaymentTreatment(onpTransactions);
            // }

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
                console.log('cli', cli);
                // Travel traitment
                const onlinePaymentMonthsTransactions = await travelTreatment(cli, clientCodes[cli]['travel'], clientCodes[cli]['onlinepayment']);

                // Online payment traitment
                await onlinePaymentTreatment(cli, onlinePaymentMonthsTransactions);

            }
            await visaTransactionsCollection.insertTransactions(transactions);
            await visaTransactinnsTmpCollection.deleteManyVisaTransactionsTmpById(toBeDeleted);
            const resp = await settingCollection.deleteSetting('visa_transaction_tmp_treatment_in_progress')
            console.log('resp', resp);

        } catch (error) {
            const resp = await settingCollection.deleteSetting('visa_transaction_tmp_treatment_in_progress')
            console.log('resp', resp);
            logger.error(`error during startTransactionTraitment \n${error.name} \n${error.stack}\n`);
            return error;
        }
    },

    startRevivalMail: async (): Promise<any> => {
        try {
            const setting = await settingCollection.getSettingsByKey('start_revival_mail_in_progress');
            if (setting?.value === true) { console.log('TRAITMENT IS IN PROGRESS WAITING WHEN IT WILL FINISH'); return }
            await settingCollection.insertSetting({ key: 'start_revival_mail_in_progress', value: true });

            const travels = await travelsCollection.getTravelsBy({ 'proofTravel.status': { $nin: [OpeVisaStatus.CLOSED, OpeVisaStatus.JUSTIFY, OpeVisaStatus.EXCEDEED, OpeVisaStatus.REJECTED] } });
            const letter = await lettersCollection.getLetterBy({});
            if (!letter) { return new Error('LetterNotFound'); }

            const visaTemplate = await templatesCollection.getTemplateBy({ key: 'transactionOutsideNotJustified' });

            for (const travel of travels) {
                const firstDate = Math.min(...travel?.transactions.map((elt => elt?.date)));
                const currentDate = moment().valueOf();

                let userData: any;
                userData = formatHelper.getVariablesValue({
                    transactions: travel?.transactions, ceiling: travel?.ceiling, amount: travel.transactions[0].amount
                })
                // if (moment(currentDate).diff(firstDate, 'days') >= letter?.period) {
                //     await Promise.all([
                //         notificationService.sendEmailFormalNotice(get(travel, 'user.email'), letter, userData, 'fr', 'Lettre de mise en demeure'),
                //         notificationService.sendEmailFormalNotice(get(travel, 'user.email'), letter, userData, 'en', 'Formal notice letter')
                //     ]);

                //     await travelsCollection.updateTravelsById(travel._id.toString(), { 'proofTravel.status': OpeVisaStatus.EXCEDEED });
                //     continue;
                // }
                if (moment(currentDate).diff(firstDate, 'days') >= visaTemplate.period) {
                    await Promise.all([
                        notificationService.sendVisaTemplateEmail(travel, userData, visaTemplate, 'fr'),
                        notificationService.sendVisaTemplateEmail(travel, userData, visaTemplate, 'en')
                    ]);
                    continue;
                }


            }
            const resp = await settingCollection.deleteSetting('start_revival_mail_in_progress')
            console.log('resp', resp);
        } catch (error) {
            const resp = await settingCollection.deleteSetting('start_revival_mail_in_progress')
            console.log('resp', resp);
            logger.error(`error during startRevivalMail \n${error.name} \n${error.stack}\n`);
            return error
        }
    }

};

const travelTreatment = async (cli: string, travelTransactions: any[], onlinePaymentsTransactions: any[]): Promise<any[]> => {

    if (!travelTransactions) { return onlinePaymentsTransactions; }
    let currentIndex = 0
    const transactionsGroupedByTravel: { transactions: any[], travel?: Travel }[] = [];

    // sort transactions by date in ascending order
    travelTransactions = travelTransactions.sort((a, b) => {
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
    });
    for (const transaction of travelTransactions) {

        // find travel which dates matchs with the current transaction date
        let travel = await travelsCollection.getTravelBy({ 'user.clientCode': cli, "proofTravel.dates.start": { $lte: transaction?.date }, "proofTravel.dates.end": { $gte: transaction?.date } });

        if (!travel || isEmpty(travel)) {

            //Insert the first transaction and continue
            if (currentIndex === 0 && isEmpty(transactionsGroupedByTravel[currentIndex])) {
                transactionsGroupedByTravel[currentIndex] = { transactions: [transaction] }
                continue;
            }

            // get the first date of the current transactions Grouped By Travel's transactions
            const firstDate = Math.min(...transactionsGroupedByTravel[currentIndex]?.transactions.map((elt => elt?.date)));
            const maxDate = moment(firstDate).endOf('month').valueOf();

            // verify if the date of the current transaction is out of current transactions Grouped By Travel's range or if current transactions Grouped By Travel does'nt containt travel
            if (transaction?.date > maxDate || !!transactionsGroupedByTravel[currentIndex]?.travel) {
                currentIndex++;
            }

            // verify if current transactions Grouped By Travel is empty
            if (isEmpty(transactionsGroupedByTravel[currentIndex])) { transactionsGroupedByTravel[currentIndex] = { transactions: [] } }

            transactionsGroupedByTravel[currentIndex]?.transactions?.push(transaction);

            continue;

        }

        if (!transactionsGroupedByTravel[currentIndex]?.travel || transactionsGroupedByTravel[currentIndex]?.travel?._id !== travel?._id) {
            currentIndex++;
        }

        if (isEmpty(transactionsGroupedByTravel[currentIndex])) { transactionsGroupedByTravel[currentIndex] = { transactions: [] } }

        transactionsGroupedByTravel[currentIndex]?.transactions.push(transaction);

        transactionsGroupedByTravel[currentIndex].travel = travel;

    }

    return await insertTransactionsInTravels(cli, transactionsGroupedByTravel, onlinePaymentsTransactions);

}

const onlinePaymentTreatment = async (cli: string, onlinepaymentTransactions: any[]) => {
    if (!onlinepaymentTransactions) { return onlinepaymentTransactions; }

    const months = [...new Set(onlinepaymentTransactions.map((elt) => moment(elt?.date).format('YYYYMM')))];

    for (const month of months) {

        const selectedTransactions = onlinepaymentTransactions.filter(elt => moment(elt?.date).format('YYYYMM') === month);

        let onlinePayment: OnlinePaymentMonth = await onlinePaymentsCollection.getOnlinePaymentBy({ 'user.clientCode': cli, currentMonth: +month });

        if (!onlinePayment) {
            onlinePayment = {
                user: {
                    clientCode: cli,
                    fullName: selectedTransactions[0].fullName,
                    email: selectedTransactions[0].email,
                    tel: selectedTransactions[0].tel
                },
                currentMonth: +month,
                status: OpeVisaStatus.EMPTY,
                dates: {},
                amounts: 0,
                statementAmounts: 0,
                ceiling: 0,
                statements: [],
                statementsStatus: OpeVisaStatus.EMPTY,
                transactions: [],
            }
            onlinePayment = await onlinePaymentsService.insertOnlinePayment(onlinePayment);
        }
        const totalAmount = commonService.getTotal(selectedTransactions);

        const userData = formatHelper.getVariablesValue({
            transactions: selectedTransactions, ceiling: onlinePayment?.ceiling, amount: totalAmount,
        });
        if (isEmpty(onlinePayment?.transactions)) {
            await Promise.all([
                notificationService.sendEmailDetectTransactions(userData, selectedTransactions[0].email, 'fr'),
                notificationService.sendEmailDetectTransactions(userData, selectedTransactions[0].email, 'en')
            ]);
        }
        onlinePayment.transactions.push(...selectedTransactions);

        onlinePayment.dates.updated = moment().valueOf();

        onlinePayment.amounts = totalAmount;
        onlinePayment.statementAmounts = commonService.getTotal(onlinePayment?.statements, 'statement');

        const statut = commonService.getOnpStatementStepStatus(onlinePayment, 'onp');

        if (onlinePayment.statementsStatus !== statut) {
            onlinePayment.statementsStatus = statut;
            onlinePayment.status = statut;
        }

        if (+totalAmount > +onlinePayment?.ceiling) {
            await Promise.all([
                notificationService.sendEmailVisaExceding(userData, get(onlinePayment, 'user.email'), 'fr'),
                notificationService.sendEmailVisaExceding(userData, get(onlinePayment, 'user.email'), 'en')
            ]);
            logger.debug(`Exeding online payment, id: ${onlinePayment._id}`);
        }

        await onlinePaymentsCollection.updateOnlinePaymentsById(onlinePayment?._id, onlinePayment);
    }

}


const getOperationType = (type: string) => {
    return type === 'PAIEMENT INTERNET' ? 'onlinepayment'
        : ['RETRAIT DAB', 'PAIEMENT TPE'].includes(type) ?
            'travel' : ''
};

const getTotal = (transactions: any[]) => {
    if (!transactions || isEmpty(transactions)) { return 0; }
    const totalAmountTransaction = transactions.map((elt) => elt.amount).reduce((elt, prev) => elt + prev, 0);

    return totalAmountTransaction;
};

const formatTransactions = (dataArray: any[]) => {
    try {
        const transactions = dataArray.map((element: any) => {
            return {
                _id: element?._id,
                clientCode: element['CLIENT']?.toString()?.replace(/\s/g, ''),
                fullName: element['NOM_CLIENT'],
                manager: {
                    code: element['CODE_GESTIONNAIRE']?.replace(/\s/g, ''),
                    name: element['NOM_GESTIONNAIRE']?.replace(/\s/g, '')
                },
                tel: element['TELEPHONE_CLIENT'],
                email: element['EMAIL_CLIENT'],
                beneficiary: element['ACQUEREUR']?.replace(/\s/g, ''),
                amount: +element['MONTANT_XAF'] || 0,
                amountTrans: +element['MONTANT'] || 0,
                currencyTrans: +element['DEVISE'] || 0,
                amountCompens: +element['MONTANT_COMPENS'] || 0,
                currencyCompens: element['DEVISE_COMPENS']?.replace(/\s/g, ''),
                date: moment(`${element['DATE']?.replace(/\s/g, '')} ${element['HEURE']?.replace(/\s/g, '')}`, 'dd/MM/YYYY HH:mm:ss').valueOf(),
                type: element['TYPE_TRANS'],
                ncp: element['COMPTE']?.replace(/\s/g, ''),
                age: element['AGENCE']?.replace(/\s/g, ''),
                cha: element['CHAPITRE'],
                card: {
                    name: element['NOM_CARTE']?.replace(/\s/g, ''),
                    code: element['CARTE']?.replace(/\s/g, ''),
                    label: element['PRODUIT']?.replace(/\s/g, ''),
                },
                country: element['PAYS']?.trim(),
                category: element['CATEGORIE']?.replace(/\s/g, ''),
                currentMonth: moment(`${element['DATE']?.replace(/\s/g, '')}`, 'dd/MM/YYYY').format('YYYYMM')?.toString(),
                reference: '',
                statementRef: '',
            }
        });

        return transactions;
    } catch (error) {
        logger.error(`error during formatTransactions \n${error.name} \n${error.stack}\n`);
        return error;
    }
}

const insertTransactionsInTravels = async (cli: string, transactionsGroupedByTravel: { transactions: any[], travel?: Travel }[], onlinePaymentsTransactions: any[]) => {
    for (const element of transactionsGroupedByTravel) {

        if (isEmpty(element?.transactions)) { return }

        const firstDate = Math.min(...element?.transactions.map((elt => elt?.date)));
        const lastDate = Math.max(...element?.transactions.map((elt => elt?.date)));

        let travel: Travel = element?.travel;
        if (travel) { travel.transactions = !isEmpty(travel?.transactions) && !isEmpty(travel) ? travel?.transactions : []; }


        if (!travel) {
            travel = {
                status: OpeVisaStatus.TO_COMPLETED,
                user: {
                    clientCode: cli,
                    fullName: element?.transactions[0]?.fullName,
                    email: element?.transactions[0]?.email,
                    tel: element?.transactions[0]?.tel,

                },
                travelRef: '',
                travelType: TravelType.SHORT_TERM_TRAVEL,
                ceiling: 0,
                dates: {
                    created: moment().valueOf(),
                },
                proofTravel: {
                    continents: [],
                    countries: [],
                    dates: {
                        start: firstDate,
                        end: lastDate,
                    },
                    status: OpeVisaStatus.TO_COMPLETED,
                    travelReason: {},
                    isTransportTicket: false,
                    isVisa: false,
                    isPassOut: true,
                    isPassIn: true,
                    proofTravelAttachs: [],
                    validators: []
                },
                expenseDetails: [],
                expenseDetailsStatus: OpeVisaStatus.EMPTY,
                expenseDetailAmount: 0,
                othersAttachements: [],
                otherAttachmentAmount: 0,
                othersAttachmentStatus: OpeVisaStatus.EMPTY,
                transactions: []
            };

            travel = await travelService.insertTravelFromSystem(travel);

            if (travel instanceof Error) { continue }
        }

        if (isEmpty(travel?.transactions)) {
            const userData = formatHelper.getVariablesValue({
                transactions: element?.transactions, ceiling: travel?.ceiling, amount: commonService.getTotal(element?.transactions),
            });

            await Promise.all([
                notificationService.sendEmailDetectTransactions(userData, get(travel, 'user.email'), 'fr'),
                notificationService.sendEmailDetectTransactions(userData, get(travel, 'user.email'), 'en')
            ]);
        }

        if (travel?.travelType === TravelType.SHORT_TERM_TRAVEL) { travel?.transactions.push(...element?.transactions); }


        if (travel.travelType === TravelType.LONG_TERM_TRAVEL) {
            const mergedTransactions = [...element.transactions, ...onlinePaymentsTransactions];
            const months = mergedTransactions.map((elt) => moment(elt?.date).format('YYYYMM')).filter((item, pos, self) => self.indexOf(item) === pos);
            for (const month of months) {
                const selectedTransactions = element.transactions.filter(elt => moment(elt?.date).format('YYYYMM') === month);
                const selectedTransactionsOnlinePayment = onlinePaymentsTransactions.filter(elt => moment(elt?.date).format('YYYYMM') === month);
                onlinePaymentsTransactions = onlinePaymentsTransactions.filter(elt => moment(elt?.date).format('YYYYMM') !== month);
                selectedTransactions.push(...selectedTransactionsOnlinePayment);
                let travelMonth = await travelMonthsCollection.getTravelMonthBy({ travelId: travel?._id, month });

                if (travelMonth) { travelMonth.transactions.push(...selectedTransactions) }

                if (!travelMonth) {
                    travelMonth = {
                        status: OpeVisaStatus.TO_COMPLETED,
                        userId: travel?.user?._id,
                        clientCode: travel?.user?.clientCode,
                        travelId: travel?._id,
                        month,
                        dates: {
                            created: moment().valueOf(),
                        },
                        expenseDetails: [],
                        expenseDetailsStatus: OpeVisaStatus.EMPTY,
                        expenseDetailAmount: 0,
                        transactions: selectedTransactions

                    }

                    const insertedId = await travelMonthsCollection.insertVisaTravelMonth(travelMonth);

                    travelMonth._id = insertedId;
                }
                travelMonth.dates.updated = moment().valueOf();

                const totalAmount = commonService.getTotal(travelMonth?.transactions);
                travelMonth.expenseDetailAmount = commonService.getTotal(travelMonth?.transactions, 'stepAmount');
                travelMonth.expenseDetailsStatus = commonService.getOnpStatementStepStatus(travelMonth, 'month');

                if (totalAmount > travel?.ceiling) {
                    const userData = formatHelper.getVariablesValue({
                        transactions: travel?.transactions, ceiling: travel?.ceiling, amount: totalAmount
                    });
                    await Promise.all([
                        notificationService.sendEmailVisaExceding(userData, get(travel, 'user.email'), 'fr'),
                        notificationService.sendEmailVisaExceding(userData, get(travel, 'user.email'), 'en')
                    ]);

                    logger.debug(`Exeding travel month, id: ${travelMonth?._id}`);
                }

                await travelMonthsCollection.updateTravelMonthsById(travelMonth?._id, travelMonth);

            }



        }

        const totalAmount = commonService.getTotal(travel?.transactions);

        travel.expenseDetailAmount = commonService.getTotal(travel.expenseDetails, 'stepAmount');
        travel.expenseDetailsStatus = commonService.getOnpStatementStepStatus(travel, 'expenseDetail');

        travel.otherAttachmentAmount = commonService.getTotal(travel.othersAttachements, 'stepAmount');
        travel.othersAttachmentStatus = commonService.getOnpStatementStepStatus(travel, 'othersAttachs');

        travelsCollection.updateTravelsById(get(travel, '_id').toString(), travel);

        if (travel.travelType === TravelType.SHORT_TERM_TRAVEL) {
            if (totalAmount > +travel?.ceiling) {
                const userData = formatHelper.getVariablesValue({
                    transactions: travel?.transactions, ceiling: travel?.ceiling, amount: totalAmount
                })

                await Promise.all([
                    notificationService.sendEmailVisaExceding(userData, get(travel, 'user.email'), 'fr'),
                    notificationService.sendEmailVisaExceding(userData, get(travel, 'user.email'), 'fr')
                ]);
                logger.debug(`Exeding travel, id: ${travel?._id}`);

            }
        }
    }
    return onlinePaymentsTransactions;
}

const groupByType = (transactions: any[]): any => {
    let onpTransactions = transactions.filter(elt => ['PAIEMENT INTERNET'].includes(elt.type))
    let travelTransactions = transactions.filter(elt => ['RETRAIT DAB', 'PAIEMENT TPE'].includes(elt.type))
    return { onpTransactions, travelTransactions };

}


