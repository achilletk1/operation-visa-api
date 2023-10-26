import { visaTransactionsTmpCollection } from "../collections/visa_transactions_tmp.collection";
import { visaTransactionsCollection } from "../collections/visa-transactions.collection";
import { onlinePaymentsCollection } from "../collections/online-payments.collection";
import { travelMonthsCollection } from "../collections/travel-months.collection";
import { templatesCollection } from "../collections/templates.collection";
import { settingCollection } from "../collections/settings.collection";
import { lettersCollection } from '../collections/letters.collection';
import { travelsCollection } from "../collections/travels.collection";
import { onlinePaymentsService } from "./online-payment.service";
import { OnlinePaymentMonth } from "../models/online-payment";
import { notificationService } from './notification.service';
import { OpeVisaStatus, VisaTransaction } from "../models/visa-operations";
import { Travel, TravelMonth, TravelType } from "../models/travel";
import { travelService } from "./travel.service";
import { commonService } from "./common.service";
import { QueueState } from "../class/statut";
import { get, isEmpty } from "lodash";
import { logger } from "../winston";
import {
    generateTravelByProcessing, generateTravelMonthByProcessing, generateNotificationData,
    checkTravelNumberOfMonths, generateOnlinePaymentMonth
} from "./helpers/visa-operations.service.helper";
import { ObjectId } from "mongodb";
import moment from 'moment';
export class VisaTransactonsProcessingService {
    transactions: any[];
    toBeDeleted: ObjectId[];
    aggregatedTransactions: any[];

    constructor() { }

    async startTransactionsProcessing(state: any): Promise<any> {
        try {
            if (state.getState(`visa_transaction_tmp_treatment`) === QueueState.PENDING) {
                state.setState(QueueState.PROCESSING, `visa_transaction_tmp_treatment`);
                console.log('===============-==================================-==================================');
                console.log('===============-==============  START TRAITMENT ====================-============');
                console.log('===============-========================================================-============');

                this.aggregatedTransactions = await visaTransactionsTmpCollection.getFormatedVisaTransactionsTmps();
                if (isEmpty(this.aggregatedTransactions)) {
                    state.setState(QueueState.PENDING, `visa_transaction_tmp_treatment`);
                    return;
                }
                this.transactions = [];
                this.toBeDeleted = [];
                for (const element of this.aggregatedTransactions) {
                    let { _id: cli, travel, onlinepayment } = element;

                    this.transactions.push(...travel, ...onlinepayment);

                    // Travel traitment
                    const transactionsGroupedByTravel = await this.travelDataGroupedByCli(cli, travel);
                    // Online payment traitment
                    const transactionsGroupedByOnlinePayment = await this.onlinePaymentGroupedByCli(cli, onlinepayment);

                    await this.travelTreatment(cli, transactionsGroupedByTravel);
                    await this.onlinePaymentTreatment(cli, transactionsGroupedByOnlinePayment);
                }

                this.toBeDeleted = this.transactions.map((elt) => new ObjectId(elt._id.toString()));

                //TODO verify if visa transactions collection is not used and delete this instruction
                await Promise.all([
                    visaTransactionsCollection.insertTransactions(this.transactions),
                    visaTransactionsTmpCollection.deleteManyVisaTransactionsTmpById(this.toBeDeleted),
                    this.sendNotifications(),
                ])

                await Promise.all([
                    travelsCollection.updateManyTravels({ notifications: { $exists: true } }, null, { notifications: true }),
                    onlinePaymentsCollection.updateManyOnlinePayments({ notifications: { $exists: true } }, null, { notifications: true }),

                ])

                state.setState(QueueState.PENDING, `visa_transaction_tmp_treatment`);
                console.log('===============-==================================-==================================');
                console.log('===============-==============  END TRAITMENT ====================-============');
                console.log('===============-========================================================-============');
            } else {
                console.log('===============-==============  A TRAITMENT IS IN PROCESSING ====================-============')
            }

        } catch (error) {
            state.setState(QueueState.PENDING, `visa_transaction_tmp_treatment`);
            console.log('===============-==================================-==================================');
            console.log('===============-==============  ERROR DURING TRAITMENT ====================-============');
            console.log('===============-========================================================-============');
            logger.error(`error during startTransactionTraitment \n${error.name} \n${error.stack}\n`);
            return error;
        }
    }

    async startRevivalMail(): Promise<any> {
        try {
            const travels = await travelsCollection.getTravelsBy({ 'proofTravel.status': { $nin: [OpeVisaStatus.CLOSED, OpeVisaStatus.JUSTIFY, OpeVisaStatus.EXCEDEED, OpeVisaStatus.REJECTED] } });

            if (isEmpty(travels)) {
                const resp = await settingCollection.deleteSetting('start_revival_mail_in_progress')
                console.log('resp', resp);
                return;
            }
            const letter = await lettersCollection.getLetterBy({});
            if (!letter) { return new Error('LetterNotFound'); }

            const visaTemplate = await templatesCollection.getTemplateBy({ key: 'transactionOutsideNotJustified' });

            for (const travel of travels) {
                if (isEmpty(travel?.transactions)) continue;
                const firstDate = Math.min(...travel?.transactions?.map((elt => elt?.date)));
                const currentDate = moment().valueOf();
                if (!travel?.user?.email) continue;
                if (moment(currentDate).diff(firstDate, 'days') >= letter?.period) {
                    await Promise.all([
                        notificationService.sendEmailFormalNotice(get(travel, 'user.email'), letter, travel, 'fr', 'Lettre de mise en demeure', get(travel, '_id').toString()),
                        notificationService.sendEmailFormalNotice(get(travel, 'user.email'), letter, travel, 'en', 'Formal notice letter', get(travel, '_id').toString())
                    ]);

                    await travelsCollection.updateTravelsById(travel._id.toString(), { 'proofTravel.status': OpeVisaStatus.EXCEDEED, status: OpeVisaStatus.EXCEDEED });
                }
                if (moment(currentDate).diff(firstDate, 'days') >= visaTemplate.period) {
                    await Promise.all([
                        notificationService.sendVisaTemplateEmail(travel, get(travel, 'user.email'), visaTemplate, 'fr', get(travel, '_id').toString()),
                        notificationService.sendVisaTemplateEmail(travel, get(travel, 'user.email'), visaTemplate, 'en', get(travel, '_id').toString())
                    ]);
                }


            }

        } catch (error) {
            logger.error(`error during startRevivalMail \n${error.name} \n${error.stack}\n`);
            return error
        }
    }

    private async travelDataGroupedByCli(cli: string, travelTransactions: any[]): Promise<any> {

        let currentIndex = 0
        const transactionsGroupedByTravel: { transactions: any[], travelId?: string }[] = [];

        // sort transactions by date in ascending order
        travelTransactions = travelTransactions.sort((a, b) => {
            return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
        });
        for (const transaction of travelTransactions) {

            // find travel which dates matchs with the current transaction date
            let travel = await travelsCollection.getTravelsForPocessing({ cli, date: moment(transaction?.date, 'DD/MM/YYYY HH:mm:ss').valueOf() });

            if (!travel || isEmpty(travel)) {

                //Insert the first transaction and continue
                if (currentIndex === 0 && isEmpty(transactionsGroupedByTravel[currentIndex])) {
                    transactionsGroupedByTravel[currentIndex] = { transactions: [transaction] }
                    continue;
                }

                // get the first date of the current transactions Grouped By Travel's transactions
                const firstDate = Math.min(...transactionsGroupedByTravel[currentIndex]?.transactions.map((elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').valueOf())));
                const maxDate = moment(firstDate).endOf('month').valueOf();

                // verify if the date of the current transaction is out of current transactions Grouped By Travel's range or if current transactions Grouped By Travel does'nt containt travel
                if (transaction?.date > maxDate) {
                    currentIndex++;
                }

                // verify if current transactions Grouped By Travel is empty
                if (isEmpty(transactionsGroupedByTravel[currentIndex])) { transactionsGroupedByTravel[currentIndex] = { transactions: [] } }

                transactionsGroupedByTravel[currentIndex]?.transactions?.push(transaction);

                continue;

            }

            if (!transactionsGroupedByTravel[currentIndex]?.travelId || transactionsGroupedByTravel[currentIndex]?.travelId !== travel?._id.toString()) {
                currentIndex++;
            }

            if (isEmpty(transactionsGroupedByTravel[currentIndex])) { transactionsGroupedByTravel[currentIndex] = { transactions: [] } }

            transactionsGroupedByTravel[currentIndex]?.transactions.push(transaction);

            transactionsGroupedByTravel[currentIndex].travelId = travel?._id.toString();
        }
        return transactionsGroupedByTravel;
    }

    private async onlinePaymentGroupedByCli(cli: string, onlinepaymentTransactions: any[]): Promise<any> {
        if (!onlinepaymentTransactions) { return onlinepaymentTransactions; }

        const months = [...new Set(onlinepaymentTransactions.map((elt) => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM')))];

        const transactionsGroupedByOnlinePayment: { month: string, transactions: any[], travelId?: string, onlinePaymentId?: string }[] = [];

        for (const month of months) {
            let onlinePayment: any;
            const selectedTransactions = onlinepaymentTransactions.filter(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM') === month);
            const firstDate = moment(month, 'YYYYMM').startOf('month').valueOf();
            const travel = await travelsCollection.getTravelsForPocessing({ cli, date: moment(firstDate, 'DD/MM/YYYY HH:mm:ss').valueOf(), travelType: TravelType.LONG_TERM_TRAVEL });

            if (isEmpty(travel)) {
                onlinePayment = await onlinePaymentsCollection.getOnlinePaymentBy({ 'user.clientCode': cli, currentMonth: month });
            }

            transactionsGroupedByOnlinePayment.push({ transactions: selectedTransactions, onlinePaymentId: onlinePayment?._id.toString() || null, travelId: travel?._id.toString() || null, month });
        }

        return transactionsGroupedByOnlinePayment;
    }

    private async travelTreatment(cli: string, transactionsGroupedByTravel: any[]) {
        for (const element of transactionsGroupedByTravel) {
            if (isEmpty(element?.transactions)) { return }
            const dates = element?.transactions.map((elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').valueOf()));
            const firstDate = moment(Math.min(...dates)).startOf('day').valueOf();
            const lastDate = moment(firstDate).add('days', 30).endOf('days').valueOf();

            let travel: Travel;
            const toBeUpdated: any = { notifications: [] };
            if (!element?.travelId) {
                travel = generateTravelByProcessing(cli, element?.transactions[0], { start: firstDate, end: lastDate });
            }

            travel = element?.travelId ? await travelService.getTravelById(element?.travelId) : await travelService.insertTravelFromSystem(travel);
            if (travel instanceof Error) { continue }
            travel.notifications = [];


            if (travel.travelType === TravelType.SHORT_TERM_TRAVEL) {
                travel.transactions = isEmpty(travel?.transactions) ? [...element?.transactions] : [...travel?.transactions, ...element?.transactions];
                toBeUpdated.notifications = verifyExcedingOnTravel(travel, +travel?.ceiling);
                const totalAmount = commonService.getTotal(travel?.transactions);
                if (travel?.transactions?.length === element?.transactions?.length) { // to detect first transaction
                    toBeUpdated.notifications.push(generateNotificationData({ ...travel, totalAmount }, "EMAIL", 'firstTransaction'));
                    toBeUpdated.notifications.push(generateNotificationData({ ...travel, totalAmount }, "SMS", 'firstTransaction'));
                }

                toBeUpdated.transactions = element.transactions;
            }

            if (travel.travelType === TravelType.LONG_TERM_TRAVEL) {
                const months = [...new Set(element.transactions.map((elt) => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM')))] as string[];
                for (const month of months) {
                    const selectedTransactions = element.transactions.filter(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM') === month);

                    const travelMonth = await getOrCreateTravelMonth(travel, month);

                    toBeUpdated['proofTravel.nbrefOfMonth'] = checkTravelNumberOfMonths(month, travel?.proofTravel?.nbrefOfMonth || 0, travel?.proofTravel?.dates?.start); // in case of new month creation check the number of months in the long term travel
                    await updateTravelMonth(travelMonth, selectedTransactions, toBeUpdated, travel);
                }

            }

            await updateTravel(travel, toBeUpdated);
        }
    }

    private async onlinePaymentTreatment(cli: string, transactionsGroupedByOnlinePayment: any[]) {
        for (const element of transactionsGroupedByOnlinePayment) {
            let onlinePayment: OnlinePaymentMonth;
            let travel: Travel;
            const toBeUpdated: any = { notifications: [] };

            const { month } = element;
            if (element.travelId) {
                travel = await travelsCollection.getTravelById(element.travelId);
                const travelMonth = await getOrCreateTravelMonth(travel, month);
                await updateTravelMonth(travelMonth, element.transactions, toBeUpdated, travel);
                await updateTravel(travel, toBeUpdated);
                continue;
            }

            if (!element.onlinePaymentId) {
                onlinePayment = generateOnlinePaymentMonth(cli, element.transactions[0], month);
            }

            onlinePayment = element.onlinePaymentId ? await onlinePaymentsCollection.getOnlinePaymentById(element.onlinePaymentId) : await onlinePaymentsService.insertOnlinePayment(onlinePayment)

            onlinePayment.transactions.push(element.transactions);

            toBeUpdated.notifications = verifyExcedingOnTravel(travel, +travel?.ceiling);
            if (isEmpty(toBeUpdated.notifications)) {
                delete toBeUpdated.notifications;
            }

            await onlinePaymentsCollection.updateOnlinePaymentsById(onlinePayment?._id, { ...toBeUpdated });
        }
    }

    private async sendNotifications() {

        const travelDataNotifications = await travelsCollection.getTravelNotifications();
        const onlinePaymentDataNotifications = await onlinePaymentsCollection.getOnlinePaymentNotifications();

        const notifications = [...travelDataNotifications, ...onlinePaymentDataNotifications];

        for (const notification of notifications) {
            if (notification.type === 'SMS') {
                await sendSMSNotifications(notification);
            }
            if (notification.type === 'EMAIL') {
                await sendEmailNotifications(notification);
            }
        }

    }
};

const verifyExcedingOnTravel = (data: Travel | TravelMonth | OnlinePaymentMonth, ceiling: number, travel?: Travel) => {
    const totalAmount = commonService.getTotal(data?.transactions);
    if (totalAmount > ceiling) {
        data.status = [OpeVisaStatus.CLOSED, OpeVisaStatus.JUSTIFY, OpeVisaStatus.VALIDATION_CHAIN].includes(data?.status) ? data?.status : OpeVisaStatus.EXCEDEED;
        const userData = travel ? travel : data;

        // TODO send increase notification after status change to exceeded
        logger.debug(`Exeding data, id: ${data?._id}`);
        return [
            generateNotificationData({ ...userData, totalAmount }, "EMAIL", 'ceilingOverrun'),
            generateNotificationData({ ...userData, totalAmount }, "SMS", 'ceilingOverrun'),
        ];
    }

    return [];
}

const getOrCreateTravelMonth = async (travel: Travel, month: string) => {
    let travelMonth = travelMonthsCollection.getTravelMonthBy({ travelId: travel?._id, month: month }) as TravelMonth;

    if (isEmpty(travelMonth)) {
        travelMonth = generateTravelMonthByProcessing(travel?._id.toString(), travel?.user?._id, month);
        const insertedId = await travelMonthsCollection.insertVisaTravelMonth(travelMonth);
        travelMonth._id = insertedId;
    }
    return travelMonth;
}


const updateTravelMonth = async (travelMonth: TravelMonth, transactions: VisaTransaction[], toBeUpdated: any, travel: Travel) => {
    travelMonth.transactions.push(...transactions);
    toBeUpdated.notifications = verifyExcedingOnTravel(travelMonth, +travel?.ceiling, travel);
    await travelMonthsCollection.updateTravelMonthsById(travelMonth?._id, { transactions: travelMonth?.transactions, "dates.updated": moment().valueOf() });

}

const updateTravel = async (travel: Travel, toBeUpdated: any) => {
    toBeUpdated['dates.updated'] = moment().valueOf();
    await travelsCollection.updateTravelsById(get(travel, '_id').toString(), { ...toBeUpdated });
}

const sendEmailNotifications = async (notification: any) => {
    const { data, lang, receiver, id, key } = notification.data;

    if (key === 'firstTransaction') {
        await notificationService.sendEmailDetectTransactions(data, receiver, lang, id);
    }

    if (key === 'ceilingOverrun') {
        await notificationService.sendEmailVisaExceding(data, receiver, lang, id);
    }


}

const sendSMSNotifications = async (notification: any) => {
    const { data, lang, id, phone, key, subject } = notification.data;
    await notificationService.sendTemplateSMS(data, phone, key, lang, id, subject);
}





