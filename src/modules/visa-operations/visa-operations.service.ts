import { generateTravelByProcessing, generateNotificationData, checkTravelNumberOfMonths, generateOnlinePaymentMonth, updateTravelMonth, updateTravel, getOrCreateTravelMonth, verifyExcedingOnTravel, sendSMSNotifications, sendEmailNotifications, markExceedTransaction } from "./helper";
import { FormalNoticeEvent, ListOfUsersToBlockedEvent, notificationEmmiter, TemplateSmsEvent, TransactionOutsideNotJustifiedEvent } from 'modules/notifications';
import { BankAccountManager, BankAccountManagerController } from "modules/bank-account-manager";
import { VisaTransaction, VisaTransactionsController } from "modules/visa-transactions";
import { OnlinePaymentController, OnlinePaymentMonth } from 'modules/online-payment';
import { TravelMonth, TravelMonthController } from "modules/travel-month";
import { VisaOperationsRepository } from "./visa-operations.repository";
import { VisaOperationsController } from "./visa-operations.controller";
import { VisaTransactionsTmpAggregate } from "./visa-transactions-tmp";
import { Travel, TravelController, TravelType } from 'modules/travel';
import { TemplateForm, TemplatesController } from "modules/templates";
import { User, UserCategory, UsersController } from 'modules/users';
import { Letter, LettersController } from "modules/letters";
import { QueueState } from "common/helpers";
import { CrudService } from "common/base";
import { getTotal } from "common/utils";
import { ExpenseCategory, OpeVisaStatus } from "./enum";
import { ObjectId } from "mongodb";
import { isEmpty } from "lodash";
import moment from "moment";
import { SettingsController } from "modules/settings";
import { settingsKeys } from "modules/settings/model";
import { Import, ImportsController } from "..";

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
    'proofTravel.nbrefOfMonth'?: number;
}

export class VisaOperationsService extends CrudService<any> {

    static visaOperationsRepository: VisaOperationsRepository;
    static queueState: QueueState = QueueState.PENDING;
    static queueStateRevival: QueueState = QueueState.PENDING;

    constructor() {
        VisaOperationsService.visaOperationsRepository = new VisaOperationsRepository();
        VisaOperationsService.queueState = QueueState.PENDING;
        super(VisaOperationsService.visaOperationsRepository);
    }

    async startTransactionsProcessing(): Promise<any> {
        try {
            if (VisaOperationsService.queueState === QueueState.PENDING) {
                VisaOperationsService.queueState = QueueState.PROCESSING;

                const aggregatedTransactions: VisaTransactionsTmpAggregate[] = await VisaOperationsController.visaTransactionsTmpService.getFormatedVisaTransactionsTmps();

                if (isEmpty(aggregatedTransactions)) { VisaOperationsService.queueState = QueueState.PENDING; return; }
                console.log('===============-==================================-==================================');
                console.log('===============-==============  START TRAITMENT ====================-============');
                console.log('===============-========================================================-============');

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
            if (VisaOperationsService.queueStateRevival !== QueueState.PENDING) { return; }
            VisaOperationsService.queueStateRevival = QueueState.PROCESSING;
            // TODO
            const travels = await TravelController.travelService.findAllAggregate([{ $match: { status: { $nin: [OpeVisaStatus.CLOSED, OpeVisaStatus.JUSTIFY, OpeVisaStatus.EXCEEDED, OpeVisaStatus.REJECTED] }, travelType: 100 } }]) as Travel[];

            if (isEmpty(travels)) {
                VisaOperationsService.queueStateRevival = QueueState.PENDING;
                return;
            }
            console.log('===============-==================================-==================================');
            console.log('===============-==============  START REVIVAL TRAITMENT ================-============');
            console.log('===============-========================================================-============');

            const letter = (await LettersController.lettersService.findAllAggregate([{ $match: {} }]))[0] as Letter;
            if (!letter) throw new Error('LetterNotFound');

            const visaTemplate = (await TemplatesController.templatesService.findAllAggregate([{ $match: { key: 'transactionOutsideNotJustified' } }]))[0] as TemplateForm;

            for (const travel of travels) {
                if (isEmpty(travel?.transactions)) continue;
                const firstDate = Math.min(...(travel.transactions || []).map(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').valueOf()));
                const currentDate = new Date().valueOf();
                if (!travel?.user?.email) continue;

                let user: User; let bankAccountManager!: BankAccountManager;
                try {
                    user = await UsersController.usersService.findOne({ filter: { clientCode: travel?.user?.clientCode, category: UserCategory.DEFAULT } });
                    bankAccountManager = await BankAccountManagerController.bankAccountManagerService.findOne({ filter: { CODE_GES: user.userGesCode } });
                } catch (error) { }

                // TODO set lang dynamically
                const lang = 'fr';

                if (moment(currentDate).diff(firstDate, 'days') >= Number(letter?.period)) {
                    notificationEmmiter.emit('formal-notice-mail', new FormalNoticeEvent(travel, lang, bankAccountManager?.EMAIL));
                    // await Promise.all([
                    //     NotificationsController.notificationsService.sendEmailFormalNotice(get(travel, 'user.email'), letter, travel, 'fr', 'Lettre de mise en demeure', get(travel, '_id').toString()),
                    //     NotificationsController.notificationsService.sendEmailFormalNotice(get(travel, 'user.email'), letter, travel, 'en', 'Formal notice letter', get(travel, '_id').toString())
                    // ]);

                    await TravelController.travelService.update({ _id: travel._id.toString() }, { /*'proofTravel.status': OpeVisaStatus.EXCEDEED, */status: OpeVisaStatus.EXCEEDED });
                }
                if (visaTemplate && moment(currentDate).diff(firstDate, 'days') >= visaTemplate?.period) {
                    notificationEmmiter.emit('visa-template-mail', new TransactionOutsideNotJustifiedEvent(travel, lang, bankAccountManager?.EMAIL));
                    // TODO notificationEmmiter.emit('template-sms', new TemplateSmsEvent(data, phone, key, lang, id, subject));
                    // await Promise.all([
                    //     NotificationsController.notificationsService.sendVisaTemplateEmail(travel, get(travel, 'user.email'), visaTemplate, 'fr', get(travel, '_id').toString()),
                    //     NotificationsController.notificationsService.sendVisaTemplateEmail(travel, get(travel, 'user.email'), visaTemplate, 'en', get(travel, '_id').toString())
                    // ]);
                }
            }
            VisaOperationsService.queueStateRevival = QueueState.PENDING;
            console.log('===============-==================================-==================================');
            console.log('===============-==============  END REVIVAL TRAITMENT ==================-============');
            console.log('===============-========================================================-============');
        } catch (e: any) {
            VisaOperationsService.queueStateRevival = QueueState.PENDING;
            console.log('===============-==================================-==================================');
            console.log('===============-==============  ERROR DURING REVIVAL TRAITMENT =========-============');
            console.log('===============-========================================================-============');
            this.logger.error(`error during revival mail cron execution \n${e.stack}\n`);
        }
    }

    async detectListOfUsersToBlocked(): Promise<void> {
        try {
            const travelsExceeded = (await TravelController.travelService.findAll({ filter: { status: { $in: [OpeVisaStatus.EXCEEDED] } } }))?.data;
            const onlinePaymentsExceeded = (await OnlinePaymentController.onlinePaymentService.findAll({ filter: { status: { $in: [OpeVisaStatus.EXCEEDED] } } }))?.data;
            let transactionsExceeded: VisaTransaction[] = [];
            if (isEmpty([...travelsExceeded, ...onlinePaymentsExceeded])) return;
            transactionsExceeded = await VisaOperationsController.visaOperationsService.getCustomerAccountToBlocked([...travelsExceeded, ...onlinePaymentsExceeded]);

            if (!isEmpty(transactionsExceeded)) {
                notificationEmmiter.emit('list-of-users-to-blocked-mail', new ListOfUsersToBlockedEvent(transactionsExceeded))
            }
        } catch (e: any) {
            this.logger.error(`detect users not justified transaction failed \n${e.stack}\n`);
        }
    }

    async detectOperationExceededCeiling(): Promise<void> {
        try {
            // TODO create aggregation to get folder (travel, travelMonth, onlinePaymentMonth, Importation) which match criteria like
            // It doesn't have property isUntimely
            // The first transaction, in transactions array, is more than 30 days old
            // It has not yet justify proofTravel for travel (folder.proofTravel.status not JUSTIFY, not CLOSED)
            // It has one transaction, in transactions array, which have property isExceed with value true
            // It has not yet justify expensesDetails step (folder.status not JUSTIFY, not CLOSED)

            const travelsMonths = await TravelMonthController.travelMonthService.findAllAggregate([{ $match: { "transactions.isExceed": true, isUntimely: { $exists: false } } }]) as TravelMonth[];
            const travelFilter = {
                $or: [
                    { _id: { $in: travelsMonths.map(e => new ObjectId(e.travelId?.toString())) } },
                    {
                        $and: [
                            { isUntimely: { $exists: false } },
                            {
                                $or: [{ "transactions.isExceed": true }, { "proofTravel.status": { $nin: [OpeVisaStatus.JUSTIFY, OpeVisaStatus.CLOSED] } }]
                            }]
                    },
                    {
                        $and: [
                            { isUntimely: { $exists: false } },
                            { "transactions.status": { $nin: [OpeVisaStatus.JUSTIFY, OpeVisaStatus.CLOSED] } }
                        ]
                    }

                ]
            };
            const shortTravels = await TravelController.travelService.findAllAggregate([{ $match: travelFilter }]) as Travel[];
            const onlinePayments = await OnlinePaymentController.onlinePaymentService.findAllAggregate([{ $match: { "transactions.isExceed": true, isUntimely: { $exists: false } } }]) as OnlinePaymentMonth[];
            if (![...travelsMonths, ...shortTravels, ...onlinePayments].length) return;
            await VisaOperationsController.visaOperationsService.UpdateDelayStatusFileOutTime(travelsMonths, shortTravels, onlinePayments);
        } catch (e: any) {
            this.logger.error(`detect users not justified transaction failed \n${e.stack}\n`);
        }
    }

    private async travelDataGroupedByCli(cli: string, travelTransactions: any[]): Promise<TravelDataGrouped[]> {

        let currentIndex = 0
        const transactionsGroupedByTravel: TravelDataGrouped[] = [];

        // sort transactions by date in ascending order
        travelTransactions = travelTransactions.sort((a, b) => {
            return moment(a.date, 'DD/MM/YYYY HH:mm:ss').valueOf() < moment(b.date, 'DD/MM/YYYY HH:mm:ss').valueOf() ? -1 : moment(a.date, 'DD/MM/YYYY HH:mm:ss').valueOf() > moment(b.date, 'DD/MM/YYYY HH:mm:ss').valueOf() ? 1 : 0;
        });
        for (const transaction of travelTransactions) {

            // find travel which dates matchs with the current transaction date
            let travel = await TravelController.travelService.getTravelsForPocessing({ cli, date: moment(transaction?.date, 'DD/MM/YYYY HH:mm:ss').valueOf() });

            if (isEmpty(travel)) {

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

            if (transactionsGroupedByTravel[currentIndex] && (!transactionsGroupedByTravel[currentIndex]?.travelId || transactionsGroupedByTravel[currentIndex]?.travelId !== travel?._id.toString())) {
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
            const travel = await TravelController.travelService.getTravelsForPocessing({ cli, date: moment(firstDate, 'DD/MM/YYYY HH:mm:ss').valueOf(), travelType: { $in: [TravelType.LONG_TERM_TRAVEL, TravelType.SHORT_TERM_TRAVEL] } });

            if (isEmpty(travel)) {
                try { onlinePayment = await OnlinePaymentController.onlinePaymentService.findOne({ filter: { 'user.clientCode': cli, currentMonth: month } }); } catch (e) { }
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

            try { travel = element?.travelId ? await TravelController.travelService.findOne({ filter: { _id: element?.travelId } }) : await TravelController.travelService.insertTravelFromSystem(travel); } catch (e) { }
            if (!travel || travel instanceof Error) { continue; }
            travel.notifications = [];

            if (travel.travelType === TravelType.SHORT_TERM_TRAVEL) {
                await this.addTransactionsInTravel(travel, element?.transactions, toBeUpdated);
            }

            if (travel.travelType === TravelType.LONG_TERM_TRAVEL) {
                const months = [...new Set(element.transactions.map(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM')))] as string[];
                for (const month of months) {
                    let selectedTransactions = element.transactions.filter(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM') === month);
                    await this.addTransactionsInTravel(travel, selectedTransactions, toBeUpdated);
                }
            }

            await updateTravel(travel, toBeUpdated);
        }
    }

    private async onlinePaymentTreatment(cli: string, transactionsGroupedByOnlinePayment: OnlinePaymentGrouped[]) {
        for (const element of transactionsGroupedByOnlinePayment) {
            let onlinePayment: OnlinePaymentMonth = new OnlinePaymentMonth();
            let travel: Travel = new Travel();
            const toBeUpdated: ToBeUpdated = { notifications: [] };

            const { month } = element;
            if (element.travelId) {
                try { travel = await TravelController.travelService.findOne({ filter: { _id: element.travelId } }); } catch (e) { }
                await this.addTransactionsInTravel(travel, element?.transactions, toBeUpdated, month);
                await updateTravel(travel, toBeUpdated);
                continue;
            }

            if (!element.onlinePaymentId) {
                onlinePayment = generateOnlinePaymentMonth(cli, element.transactions[0], month);
            }

            try {
                onlinePayment = element.onlinePaymentId
                    ? await OnlinePaymentController.onlinePaymentService.findOne({ filter: { _id: element.onlinePaymentId } })
                    : await OnlinePaymentController.onlinePaymentService.insertOnlinePayment(onlinePayment);
            } catch (e) { }

            onlinePayment.transactions = !element.onlinePaymentId ? [...element?.transactions] : [...travel?.transactions, ...element?.transactions];

            toBeUpdated.notifications = verifyExcedingOnTravel(onlinePayment, +Number(onlinePayment?.ceiling));
            toBeUpdated.transactions = onlinePayment.transactions;
            toBeUpdated.transactions = markExceedTransaction(toBeUpdated.transactions, +Number(onlinePayment?.ceiling));
            if (isEmpty(toBeUpdated.notifications)) {
                delete toBeUpdated.notifications;
            }

            await OnlinePaymentController.onlinePaymentService.updateOnlinePaymentsById(onlinePayment?._id, { ...toBeUpdated });
        }
    }

    private async addTransactionsInTravel(travel: Travel, transactions: VisaTransaction[], toBeUpdated: ToBeUpdated, month: string = '') {
        if (travel?.travelType === TravelType.SHORT_TERM_TRAVEL) {
            travel.transactions = isEmpty(travel?.transactions) ? [...transactions] : [...travel?.transactions, ...transactions];
            toBeUpdated.notifications = verifyExcedingOnTravel(travel, +Number(travel?.ceiling));
            const totalAmount = getTotal(travel?.transactions);
            if (travel?.transactions?.length === transactions?.length) { // to detect first transaction
                toBeUpdated.notifications.push(generateNotificationData({ ...travel, totalAmount }, "EMAIL", 'firstTransaction'));
                toBeUpdated.notifications.push(generateNotificationData({ ...travel, totalAmount }, "SMS", 'firstTransaction'));
            }

            toBeUpdated.transactions = travel.transactions;
            toBeUpdated.transactions = markExceedTransaction(toBeUpdated.transactions, +Number(travel?.ceiling));
        }

        if (travel?.travelType === TravelType.LONG_TERM_TRAVEL) {
            transactions = markExceedTransaction(transactions, +Number(travel?.ceiling));
            const travelMonth = await getOrCreateTravelMonth(travel, month);

            toBeUpdated['proofTravel.nbrefOfMonth'] = checkTravelNumberOfMonths(month, travel?.proofTravel?.nbrefOfMonth || 0, travel?.proofTravel?.dates?.start as number); // in case of new month creation check the number of months in the long term travel
            await updateTravelMonth(travelMonth, transactions, toBeUpdated, travel);
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

    private async UpdateDelayStatusFileOutTime(travelsMonths: TravelMonth[] = [], travels: Travel[] = [], onlinePayments: OnlinePaymentMonth[] = []): Promise<void> {
        try {
            let totalAmount!: number;

            const settings = await SettingsController.settingsService.findAll({
                filter: {
                    key: {
                        $in: [settingsKeys.SHORT_TRAVEL_DEADLINE_PROOF_TRAVEL, settingsKeys.SHORT_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES,
                        settingsKeys.LONG_TRAVEL_DEADLINE_PROOF_TRAVEL, settingsKeys.LONG_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES_MONTH,
                        settingsKeys.ONLINE_PAYMENT_DEADLINE_JUSTIFY, settingsKeys.IMPORT_GOODS_DEADLINE_JUSTIFY, settingsKeys.IMPORT_SERVICE_DEADLINE_JUSTIFY,
                        settingsKeys.IMPORT_GOODS_DEADLINE_JUSTIFY, settingsKeys.IMPORT_SERVICE_DEADLINE_JUSTIFY]
                    }
                }
            });

            const deadlineProofLongTravel = (settings.data.find(e => e.key === settingsKeys.LONG_TRAVEL_DEADLINE_PROOF_TRAVEL))?.data;
            const deadlineStatementExpensesLongTravel = (settings.data.find(e => e.key === settingsKeys.LONG_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES_MONTH))?.data;

            const deadlineProofShortTravel = (settings.data.find(e => e.key === settingsKeys.SHORT_TRAVEL_DEADLINE_PROOF_TRAVEL))?.data;
            const deadlineStatementExpensesShortTravel = (settings.data.find(e => e.key === settingsKeys.SHORT_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES))?.data;

            const settingOnlinePayment = (settings.data.find(e => e.key === settingsKeys.ONLINE_PAYMENT_DEADLINE_JUSTIFY))?.data;
            const deadlineOnlinePayment = settingOnlinePayment?.dataPeriod === 'month' ? settingOnlinePayment?.value * 30 : settingOnlinePayment?.value;

            const goodsDeadline = (settings.data.find(e => e.key === settingsKeys.IMPORT_GOODS_DEADLINE_JUSTIFY))?.data;
            const servicesDeadline = (settings.data.find(e => e.key === settingsKeys.IMPORT_SERVICE_DEADLINE_JUSTIFY))?.data;

            for (const travelMonth of travelsMonths) {
                totalAmount = getTotal(travelMonth?.transactions);
                const travel = travels.find(e => e._id.toString() === travelMonth.travelId?.toString());

                if ((travel?.ceiling && totalAmount > travel.ceiling) && (travelMonth?.transactions?.length && moment().diff(moment(travelMonth?.transactions[0]?.date), 'days') > deadlineStatementExpensesLongTravel)) {
                    await TravelMonthController.travelMonthService.update({ _id: travelMonth?._id }, { isUntimely: true })
                }

                if ((moment().diff(moment(travel?.proofTravel?.dates?.start), 'days') > deadlineProofLongTravel)) {
                    await TravelMonthController.travelMonthService.update({ _id: travelMonth?._id }, { isUntimely: true })
                }
            }

            const longTravels = travels.filter(travel => travel.travelType === TravelType.LONG_TERM_TRAVEL);
            const shortTravels = travels.filter(travel => travel.travelType === TravelType.SHORT_TERM_TRAVEL)

            for (const travel of longTravels) {
                if ((moment().diff(moment(travel?.proofTravel?.dates?.start), 'days') > deadlineProofLongTravel)) {
                    await TravelController.travelService.update({ _id: travel?._id }, { isUntimely: true })
                }
            }

            for (const travel of shortTravels) {
                if (travel.isUntimely || [OpeVisaStatus.JUSTIFY, OpeVisaStatus.CLOSED].includes(travel.status as OpeVisaStatus) || [OpeVisaStatus.JUSTIFY, OpeVisaStatus.CLOSED].includes(travel?.proofTravel?.status as OpeVisaStatus)) {
                    continue;
                }
                totalAmount = getTotal(travel?.transactions);

                if ((moment().diff(moment(travel?.proofTravel?.dates?.start), 'days') > deadlineProofShortTravel) && (travel?.transactions?.length && moment().diff(moment(travel?.transactions[0]?.date), 'days') > deadlineStatementExpensesShortTravel)) {
                    await TravelController.travelService.update({ _id: travel?._id }, { isUntimely: true })
                }
            }

            let importations: any[] = await ImportsController.importsService.findAllAggregate([{ $match: { "status": { $nin: [OpeVisaStatus.JUSTIFY, OpeVisaStatus.CLOSED] } } }]) as Import[];
            importations = importations.map(e => e._id);

            for (const onlinePayment of onlinePayments) {
                totalAmount = getTotal(onlinePayment?.transactions);
                if ((onlinePayment.ceiling && totalAmount > onlinePayment.ceiling) && (onlinePayment?.transactions?.length && moment().diff(moment(onlinePayment?.transactions[0]?.date), 'days') > deadlineOnlinePayment)) {
                    await OnlinePaymentController.onlinePaymentService.update({ _id: onlinePayment._id }, { isUntimely: true })
                }

                // check importations deadlines
                if (onlinePayment.transactions) {
                    for (const transaction of onlinePayment.transactions) {
                        if (transaction.importation && transaction.importation.finalPayment && importations.includes(transaction.importation._id)) {
                            const deadline = transaction.importation.type?.code === ExpenseCategory.IMPORT_OF_GOODS ? goodsDeadline : servicesDeadline;
                            if ((moment().diff(moment(transaction.justify_at), 'days') > deadline))
                                await ImportsController.importsService.update({ _id: transaction.importation._id }, { isUntimely: true })
                        }
                    }
                }

            }

        } catch (error) { throw error; }
    }

}