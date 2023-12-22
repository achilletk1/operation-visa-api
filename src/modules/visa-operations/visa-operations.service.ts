import { generateTravelByProcessing, generateNotificationData, checkTravelNumberOfMonths, generateOnlinePaymentMonth, updateTravelMonth, updateTravel, getOrCreateTravelMonth, verifyExcedingOnTravel, sendSMSNotifications, sendEmailNotifications, markExceedTransaction } from "./helper";
import { FormalNoticeEvent, ListOfUsersToBloquedEvent, notificationEmmiter, TransactionOutsideNotJustifiedEvent } from 'modules/notifications';
import { VisaTransaction, VisaTransactionsController } from "modules/visa-transactions";
import { OnlinePaymentController, OnlinePaymentMonth } from 'modules/online-payment';
import { VisaOperationsRepository } from "./visa-operations.repository";
import { VisaOperationsController } from "./visa-operations.controller";
import { VisaTransactionsTmpAggregate } from "./visa-transactions-tmp";
import { Travel, TravelController, TravelType } from 'modules/travel';
import { User, UserCategory, UsersController } from 'modules/users';
import { TemplatesController } from "modules/templates";
import { SettingsController } from "modules/settings";
import { LettersController } from "modules/letters";
import { QueueState } from "common/helpers";
import { CrudService } from "common/base";
import { getTotal } from "common/utils";
import { OpeVisaStatus } from "./enum";
import { ObjectId } from "mongodb";
import { isEmpty } from "lodash";
import moment from "moment";

interface TravelDataGrouped {
    transactions: VisaTransaction[];
    travelId?: string;
}

interface OnlinePaymentGrouped {
    month: string;
    transactions: VisaTransaction[];
    travelId?: string;
    onlinePaymentId?: string;
}

interface ToBeUpdated {
    notifications: any;
    transactions?: any[];
    'proofTravel.nbrefOfMonth'?: any;
}

export class VisaOperationsService extends CrudService<any> {

    static visaOperationsRepository: VisaOperationsRepository;
    static queueState: QueueState = QueueState.PENDING;

    constructor() {
        VisaOperationsService.visaOperationsRepository = new VisaOperationsRepository();
        VisaOperationsService.queueState = QueueState.PENDING;
        super(VisaOperationsService.visaOperationsRepository);
    }

    async startTransactionsProcessing(): Promise<any> {
        try {
            if (VisaOperationsService.queueState === QueueState.PENDING) {
                VisaOperationsService.queueState = QueueState.PROCESSING;
                console.log('===============-==================================-==================================');
                console.log('===============-==============  START TRAITMENT ====================-============');
                console.log('===============-========================================================-============');

                const aggregatedTransactions: VisaTransactionsTmpAggregate[] = await VisaOperationsController.visaTransactionsTmpService.getFormatedVisaTransactionsTmps();

                if (isEmpty(aggregatedTransactions)) { VisaOperationsService.queueState = QueueState.PENDING; return; }

                const transactions: VisaTransaction[] = [];
                for (const element of aggregatedTransactions) {
                    let { _id: cli, travel, onlinepayment } = element;

                    // get or create user if it doesn't exists
                    const isExist = await VisaOperationsController.visaOperationsService.getOrCreateUserIfItDoesntExists(cli);
                    if (!isExist) { continue; }

                    transactions.push(...travel, ...onlinepayment);

                    // Travel traitment
                    const transactionsGroupedByTravel = await VisaOperationsController.visaOperationsService.travelDataGroupedByCli(cli, travel);
                    // Online payment traitment
                    const transactionsGroupedByOnlinePayment = await VisaOperationsController.visaOperationsService.onlinePaymentGroupedByCli(cli, onlinepayment);

                    await VisaOperationsController.visaOperationsService.travelTreatment(cli, transactionsGroupedByTravel);
                    await VisaOperationsController.visaOperationsService.onlinePaymentTreatment(cli, transactionsGroupedByOnlinePayment);
                }

                const toBeDeleted: ObjectId[] = transactions.map(elt => new ObjectId(elt?._id?.toString()));

                //TODO verify if visa transactions collection is not used and delete this instruction
                await Promise.all([
                    VisaTransactionsController.visaTransactionsService.createMany(transactions),
                    VisaOperationsController.visaTransactionsTmpService.deleteMany({ _id: { $in: toBeDeleted } }),
                    VisaOperationsController.visaOperationsService.sendNotifications(),
                ])

                await Promise.all([
                    TravelController.travelService.updateMany({ notifications: { $exists: true } }, {}, { notifications: true }),
                    OnlinePaymentController.onlinePaymentService.updateMany({ notifications: { $exists: true } }, {}, { notifications: true }),
                ])

                VisaOperationsService.queueState = QueueState.PENDING;
                console.log('===============-==================================-==================================');
                console.log('===============-==============  END TRAITMENT ====================-============');
                console.log('===============-========================================================-============');
            } else {
                console.log('===============-==============  A TRAITMENT IS IN PROCESSING ====================-============')
            }

        } catch (error: any) {
            VisaOperationsService.queueState = QueueState.PENDING;
            console.log('===============-==================================-==================================');
            console.log('===============-==============  ERROR DURING TRAITMENT ====================-============');
            console.log('===============-========================================================-============');
            this.logger.error(`error during startTransactionTraitment \n${error.stack}\n`);
            return error;
        }
    }

    async startRevivalMail(): Promise<any> {
        try {
            const travels = (await TravelController.travelService.findAll({ filter: { 'proofTravel.status': { $nin: [OpeVisaStatus.CLOSED, OpeVisaStatus.JUSTIFY, OpeVisaStatus.EXCEDEED, OpeVisaStatus.REJECTED] } } }))?.data;

            if (isEmpty(travels)) {
                return await SettingsController.settingsService.deleteOne({ key: 'start_revival_mail_in_progress' });
            }

            const letter = await LettersController.lettersService.findOne({});
            if (!letter) throw new Error('LetterNotFound');

            const visaTemplate = await TemplatesController.templatesService.findOne({ filter: { key: 'transactionOutsideNotJustified' } });

            for (const travel of travels) {
                if (isEmpty(travel?.transactions)) continue;
                const firstDate = Math.min(...travel?.transactions?.map(elt => +(elt?.date || '')));
                const currentDate = moment().valueOf();
                if (!travel?.user?.email) continue;

                // TODO set lang dynamically
                const lang = 'fr';

                if (moment(currentDate).diff(firstDate, 'days') >= Number(letter?.period)) {
                    notificationEmmiter.emit('formal-notice-mail', new FormalNoticeEvent(travel, lang));
                    // await Promise.all([
                    //     NotificationsController.notificationsService.sendEmailFormalNotice(get(travel, 'user.email'), letter, travel, 'fr', 'Lettre de mise en demeure', get(travel, '_id').toString()),
                    //     NotificationsController.notificationsService.sendEmailFormalNotice(get(travel, 'user.email'), letter, travel, 'en', 'Formal notice letter', get(travel, '_id').toString())
                    // ]);

                    await TravelController.travelService.update({ _id: travel._id.toString() }, { 'proofTravel.status': OpeVisaStatus.EXCEDEED, status: OpeVisaStatus.EXCEDEED });
                }
                if (visaTemplate && moment(currentDate).diff(firstDate, 'days') >= visaTemplate?.period) {
                    notificationEmmiter.emit('visa-template-mail', new TransactionOutsideNotJustifiedEvent(travel, lang));
                    // await Promise.all([
                    //     NotificationsController.notificationsService.sendVisaTemplateEmail(travel, get(travel, 'user.email'), visaTemplate, 'fr', get(travel, '_id').toString()),
                    //     NotificationsController.notificationsService.sendVisaTemplateEmail(travel, get(travel, 'user.email'), visaTemplate, 'en', get(travel, '_id').toString())
                    // ]);
                }
            }
        } catch (e: any) {
            this.logger.error(`error during revival mail cron execution \n${e.stack}\n`);
        }
    }

    async detectListOfUsersToBlocked(): Promise<void> {
        try {
            const travelsExcedeed = (await TravelController.travelService.findAll({ filter: { status: { $in: [OpeVisaStatus.EXCEDEED] } } }))?.data;
            const onlinePaymentsExcedeed = (await OnlinePaymentController.onlinePaymentService.findAll({ filter: { status: { $in: [OpeVisaStatus.EXCEDEED] } } }))?.data;
            let transactionsExcedeed: VisaTransaction[] = [];
            if (isEmpty([...travelsExcedeed, ...onlinePaymentsExcedeed])) return;
            transactionsExcedeed = await VisaOperationsController.visaOperationsService.getCustomerAccountToBlocked([...travelsExcedeed, ...onlinePaymentsExcedeed]);

            if (!isEmpty(transactionsExcedeed)) {
                notificationEmmiter.emit('list-of-users-to-bloqued-mail', new ListOfUsersToBloquedEvent(transactionsExcedeed))
            }
        } catch (e: any) {
            this.logger.error(`detect users not justified transaction failed \n${e.stack}\n`);
        }
    }

    private async travelDataGroupedByCli(cli: string, travelTransactions: any[]): Promise<TravelDataGrouped[]> {

        let currentIndex = 0
        const transactionsGroupedByTravel: TravelDataGrouped[] = [];

        // sort transactions by date in ascending order
        travelTransactions = travelTransactions.sort((a, b) => {
            return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
        });
        for (const transaction of travelTransactions) {

            // find travel which dates matchs with the current transaction date
            let travel = await TravelController.travelService.getTravelsForPocessing({ cli, date: moment(transaction?.date, 'DD/MM/YYYY HH:mm:ss').valueOf() });

            if (!travel || isEmpty(travel)) {

                // Insert the first transaction and continue
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

    private async onlinePaymentGroupedByCli(cli: string, onlinepaymentTransactions: any[]): Promise<OnlinePaymentGrouped[]> {
        if (!onlinepaymentTransactions) { return onlinepaymentTransactions; }

        const months = [...new Set(onlinepaymentTransactions.map((elt) => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM')))];

        const transactionsGroupedByOnlinePayment: OnlinePaymentGrouped[] = [];

        for (const month of months) {
            let onlinePayment: OnlinePaymentMonth | null = null;
            const selectedTransactions = onlinepaymentTransactions.filter(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM') === month);
            const firstDate = moment(month, 'YYYYMM').startOf('month').valueOf();
            const travel = await TravelController.travelService.getTravelsForPocessing({ cli, date: moment(firstDate, 'DD/MM/YYYY HH:mm:ss').valueOf(), travelType: TravelType.LONG_TERM_TRAVEL });

            if (isEmpty(travel)) {
                try { onlinePayment = await OnlinePaymentController.onlinePaymentService.findOne({ filter: { 'user.clientCode': cli, currentMonth: month } }); } catch(e) {}
            }

            transactionsGroupedByOnlinePayment.push({ transactions: selectedTransactions, onlinePaymentId: onlinePayment?._id.toString() || null, travelId: travel?._id.toString() || null, month });
        }

        return transactionsGroupedByOnlinePayment;
    }

    private async travelTreatment(cli: string, transactionsGroupedByTravel: TravelDataGrouped[]) {
        for (const element of transactionsGroupedByTravel) {
            if (isEmpty(element?.transactions)) { return }
            const dates = element?.transactions.map((elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').valueOf()));
            const firstDate = moment(Math.min(...dates)).startOf('day').valueOf();
            const lastDate = moment(firstDate).add(30, 'days').endOf('days').valueOf();

            let travel: Travel = new Travel();
            const toBeUpdated: ToBeUpdated = { notifications: [] };
            if (!element?.travelId) {
                travel = generateTravelByProcessing(cli, element?.transactions[0], { start: firstDate, end: lastDate });
            }

            try { travel = element?.travelId ? await TravelController.travelService.findOne({ filter: { _id: element?.travelId } }) : await TravelController.travelService.insertTravelFromSystem(travel); } catch(e) {}
            if (!travel || travel instanceof Error) { continue }
            travel.notifications = [];

            if (travel.travelType === TravelType.SHORT_TERM_TRAVEL) {
                travel.transactions = isEmpty(travel?.transactions) ? [...element?.transactions] : [...travel?.transactions, ...element?.transactions];
                toBeUpdated.notifications = verifyExcedingOnTravel(travel, +Number(travel?.ceiling));
                const totalAmount = getTotal(travel?.transactions);
                if (travel?.transactions?.length === element?.transactions?.length) { // to detect first transaction
                    toBeUpdated.notifications.push(generateNotificationData({ ...travel, totalAmount }, "EMAIL", 'firstTransaction'));
                    toBeUpdated.notifications.push(generateNotificationData({ ...travel, totalAmount }, "SMS", 'firstTransaction'));
                }

                toBeUpdated.transactions = element.transactions;
                toBeUpdated.transactions = markExceedTransaction(toBeUpdated.transactions, +Number(travel?.ceiling));
            }

            if (travel.travelType === TravelType.LONG_TERM_TRAVEL) {
                const months = [...new Set(element.transactions.map(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM')))] as string[];
                for (const month of months) {
                    let selectedTransactions = element.transactions.filter(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM') === month);
                    selectedTransactions = markExceedTransaction(selectedTransactions, +Number(travel?.ceiling));
                    const travelMonth = await getOrCreateTravelMonth(travel, month);

                    toBeUpdated['proofTravel.nbrefOfMonth'] = checkTravelNumberOfMonths(month, travel?.proofTravel?.nbrefOfMonth || 0, travel?.proofTravel?.dates?.start); // in case of new month creation check the number of months in the long term travel
                    await updateTravelMonth(travelMonth, selectedTransactions, toBeUpdated, travel);
                }

            }

            await updateTravel(travel, toBeUpdated);
        }
    }

    private async onlinePaymentTreatment(cli: string, transactionsGroupedByOnlinePayment: OnlinePaymentGrouped[]) {
        for (const element of transactionsGroupedByOnlinePayment) {
            let onlinePayment: OnlinePaymentMonth = new OnlinePaymentMonth();
            let travel: Travel = new Travel();
            const toBeUpdated: ToBeUpdated = { notifications: [], transactions: [] };

            const { month } = element;
            if (element.travelId) {
                try { travel = await TravelController.travelService.findOne({ filter: { _id: element.travelId } }); } catch(e) {}
                const travelMonth = await getOrCreateTravelMonth(travel, month);
                await updateTravelMonth(travelMonth, element.transactions, toBeUpdated, travel);
                await updateTravel(travel, toBeUpdated);
                continue;
            }

            if (!element.onlinePaymentId) {
                onlinePayment = generateOnlinePaymentMonth(cli, element.transactions[0], month);
            }

            try {
            onlinePayment = element.onlinePaymentId
                ? await OnlinePaymentController.onlinePaymentService.findOne({ filter: { _id: element.onlinePaymentId } })
                : await OnlinePaymentController.onlinePaymentService.insertOnlinePayment(onlinePayment); } catch(e) {}

            toBeUpdated.transactions?.push(...element.transactions);

            toBeUpdated.notifications = verifyExcedingOnTravel(travel, +Number(travel?.ceiling));
            if (isEmpty(toBeUpdated.notifications)) {
                delete toBeUpdated.notifications;
            }

            await OnlinePaymentController.onlinePaymentService.updateOnlinePaymentsById(onlinePayment?._id, { ...toBeUpdated });
        }
    }

    private async sendNotifications() {

        const travelDataNotifications = await TravelController.travelService.getTravelNotifications();
        const onlinePaymentDataNotifications = await OnlinePaymentController.onlinePaymentService.getOnlinePaymentNotifications();

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

    // The list of customers whose accounts must be blocked
    private async getCustomerAccountToBlocked(datas: (Travel | OnlinePaymentMonth)[]) {
        try {
            let transactionExcedeed: VisaTransaction[] = [];
            const template = await TemplatesController.templatesService.findOne({ filter: { key: 'transactionOutsideNotJustified' } });

            for (const data of datas) {
                const firsDate = Math.min(...(data?.transactions || [])?.map(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').valueOf()));
                const transaction = data?.transactions?.find(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').valueOf() === firsDate);

                const dateDiffInDays = moment().diff(moment(firsDate), 'days');

                if (template && dateDiffInDays > +template?.period && transaction) { transactionExcedeed.push(transaction); } else { continue; }
            }

            return transactionExcedeed || [];
        } catch (error) { throw error; }
    }

    private async getOrCreateUserIfItDoesntExists(clientCode: string) {
        try {
            let user: User | null = null;
            try { user = await UsersController.usersService.findOne({ filter: { clientCode, category: { $in: [UserCategory.DEFAULT, UserCategory.BILLERS] } } }); } catch (e) { }
            if (user) { return user; }

            const createData = { clientCode, enabled: true, category: UserCategory.DEFAULT };
            return await UsersController.usersService.createUser(createData, 'front-office');
        } catch (e: any) {
            this.logger.error(`error during when getAndCreateUserIfItDoesntExists for visa-transactions integration \n${e.stack}\n`);
        }
    }

}