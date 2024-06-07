import { generateTravelByProcessing, generateNotificationData, checkTravelNumberOfMonths, generateOnlinePaymentMonth, updateTravelMonth, updateTravel, getOrCreateTravelMonth, verifyExceedingOnTravel, sendSMSNotifications, sendEmailNotifications, markExceedTransaction, getDeadlines, getStartDateOfClearance, getLastDateOfTravel, sortTransactionsByDateInAscendingOrder, getOnlinePaymentTransactionForTravel } from "./helper";
import { FormalNoticeEvent, ListOfUsersToBlockedEvent, notificationEmmiter, TransactionOutsideNotJustifiedEvent } from 'modules/notifications';
import { BankAccountManager, BankAccountManagerController } from "modules/bank-account-manager";
import { Travel, TravelController, TravelType, TravelsForProcessing } from 'modules/travel';
import { VisaTransaction, VisaTransactionsController } from "modules/visa-transactions";
import { OnlinePaymentController, OnlinePaymentMonth } from 'modules/online-payment';
import { TravelMonth, TravelMonthController } from "modules/travel-month";
import { VisaOperationsRepository } from "./visa-operations.repository";
import { VisaOperationsController } from "./visa-operations.controller";
import { VisaTransactionsTmpAggregate } from "./visa-transactions-tmp";
import { User, UserCategory, UsersController } from 'modules/users';
import { SettingsController, settingsKeys } from "modules/settings";
import { ExpenseCategory, OpeVisaStatus as OVS } from "./enum";
import { Import, ImportsController } from "modules/imports";
import { TemplatesController } from "modules/templates";
import { QueueState } from "common/helpers";
import { CrudService } from "common/base";
import { getTotal } from "common/utils";
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

export interface ToBeUpdated {
    notifications: any;
    transactions?: any[];
    'proofTravel.nbreOfMonth'?: number;
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

                const aggregatedTransactions: VisaTransactionsTmpAggregate[] = await VisaOperationsController.visaTransactionsTmpService.getFormattedVisaTransactionsTmp();

                if (isEmpty(aggregatedTransactions)) { VisaOperationsService.queueState = QueueState.PENDING; return; }
                console.log('===============-==================================-==================================');
                console.log('===============-==============  START TREATMENT ====================-============');
                console.log('===============-========================================================-============');

                const transactions: VisaTransaction[] = [];
                for (const element of aggregatedTransactions) {
                    let { _id: cli, travel, onlinepayment: onlinePayment } = element;

                    // get or create user if it doesn't exists
                    const isExist = await VisaOperationsController.visaOperationsService.getOrCreateUserIfItDoesNtExists(cli);
                    if (!isExist) { continue; }

                    transactions.push(...travel, ...onlinePayment);

                    // Travel treatment
                    const transactionsGroupedByTravel = await VisaOperationsController.visaOperationsService.travelDataGroupedByCli(cli, travel);
                    await VisaOperationsController.visaOperationsService.travelTreatment(cli, transactionsGroupedByTravel);

                    // Online payment treatment
                    const transactionsGroupedByOnlinePayment = await VisaOperationsController.visaOperationsService.onlinePaymentGroupedByCli(cli, onlinePayment);
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
                console.log('===============-==============  END TREATMENT ====================-============');
                console.log('===============-========================================================-============');
            } else {
                console.log('===============-==============  A TREATMENT IS IN PROCESSING ====================-============')
            }

        } catch (error: any) {
            VisaOperationsService.queueState = QueueState.PENDING;
            console.log('===============-==================================-==================================');
            console.log('===============-==============  ERROR DURING TREATMENT ====================-============');
            console.log('===============-========================================================-============');
            this.logger.error(`error during startTransactionTreatment \n${error.stack}\n`);
            return error;
        }
    }

    async startRevivalMail(): Promise<void> {
        const {
            deadlineProofLongTravel, deadlineStatementExpensesLongTravel, deadlineProofShortTravel,
            deadlineStatementExpensesShortTravel, deadlineOnlinePayment, servicesDeadline, goodsDeadline,
        } = await getDeadlines();

        try {
            if (VisaOperationsService.queueStateRevival !== QueueState.PENDING) { return; }
            VisaOperationsService.queueStateRevival = QueueState.PROCESSING;
            // TODO
            const onlinePayments = await OnlinePaymentController.onlinePaymentService.findAllAggregate<OnlinePaymentMonth>([{
                $match: { isUntimely: true, status: { $nin: [OVS.JUSTIFY, OVS.CLOSED] } }
            }]) ?? [];
            const importations = await ImportsController.importsService.findAllAggregate<Import>([{ $match: { status: { $nin: [OVS.JUSTIFY, OVS.CLOSED] }, finalPayment: true, isUntimely: true } }]);
            const travelsMonths = await TravelMonthController.travelMonthService.findAllAggregate<TravelMonth>([{
                $match: { isUntimely: true, status: { $nin: [OVS.JUSTIFY, OVS.CLOSED] } }
            }]) ?? [];

            const longTravels = await TravelController.travelService.findAllAggregate<Travel>([{ $match: { status: { $nin: [OVS.CLOSED, OVS.JUSTIFY] }, travelType: TravelType.LONG_TERM_TRAVEL, isUntimely: true } }]) ?? [];
            const shortTravels = await TravelController.travelService.findAllAggregate<Travel>([{ $match: { status: { $nin: [OVS.CLOSED, OVS.JUSTIFY] }, travelType: TravelType.SHORT_TERM_TRAVEL, isUntimely: true } }]) ?? [];

            if (shortTravels.length || longTravels.length || travelsMonths.length || onlinePayments.length || importations.length) { VisaOperationsService.queueStateRevival = QueueState.PENDING; return; }
            console.log('===============-==================================-==================================');
            console.log('===============-==============  START REVIVAL TREATMENT ================-============');
            console.log('===============-========================================================-============');

            //short travels
            for (const travel of shortTravels) {
                if (!travel?.transactions?.length || !travel?.user?.email) continue;

                if ((![OVS.JUSTIFY, OVS.CLOSED].includes(travel?.proofTravel?.status as OVS) && moment().diff(moment(travel?.proofTravel?.dates?.start).add(deadlineProofShortTravel), 'days') > 0) ||
                    (![OVS.JUSTIFY, OVS.CLOSED].includes(travel.status as OVS) && travel?.transactions?.length && moment().diff(moment(travel?.transactions[0]?.date).add(deadlineStatementExpensesShortTravel), 'days') > 0)) {
                    await this.sendFormalNoticeNotification(travel, 'proofTravel');
                    // await TravelController.travelService.update({ _id: travel._id.toString() }, { /*'proofTravel.status': OVS.EXCEDEED, */isUntimely: true });
                }
                if ((![OVS.JUSTIFY, OVS.CLOSED].includes(travel?.proofTravel?.status as OVS) && moment().diff(moment(travel?.proofTravel?.dates?.start).add(deadlineProofShortTravel), 'days') > 8) ||
                    (![OVS.JUSTIFY, OVS.CLOSED].includes(travel.status as OVS) && travel?.transactions?.length && moment().diff(moment(travel?.transactions[0]?.date).add(deadlineStatementExpensesShortTravel), 'days') > 8)) {
                    await this.sendBlockingCardNotification(travel);
                }
            }

            //long travels
            for (const travel of longTravels) {
                if (!travel?.transactions?.length || !travel?.user?.email) continue;

                if (![OVS.JUSTIFY, OVS.CLOSED].includes(travel?.proofTravel?.status as OVS) && moment().diff(moment(travel?.proofTravel?.dates?.start).add(deadlineProofLongTravel), 'days') > 0) {
                    await this.sendFormalNoticeNotification(travel, 'proofTravel');
                    // await TravelController.travelService.update({ _id: travel._id.toString() }, { /*'proofTravel.status': OVS.EXCEDEED, */isUntimely: true });
                }
                if (![OVS.JUSTIFY, OVS.CLOSED].includes(travel?.proofTravel?.status as OVS) && moment().diff(moment(travel?.proofTravel?.dates?.start).add(deadlineProofLongTravel), 'days') > 8) {
                    await this.sendBlockingCardNotification(travel);
                }
            }

            //long travels months
            for (let travelMonth of travelsMonths) {
                if (!travelMonth?.transactions?.length || !travelMonth?.userId) continue;
                const user = await UsersController.usersService.findOne({ filter: { _id: travelMonth?.userId } })
                const data: any = { ...travelMonth }; data.user = user
                if (![OVS.JUSTIFY, OVS.CLOSED].includes(travelMonth?.status as OVS) && travelMonth?.transactions?.length && moment().diff(moment(travelMonth?.transactions[0]?.date).add(deadlineStatementExpensesLongTravel), 'days') > 0) {
                    await this.sendFormalNoticeNotification(data, 'exceedingCeiling');
                    // await TravelMonthController.travelMonthService.update({ _id: travelMonth._id.toString() }, { isUntimely: true });
                }
                if (![OVS.JUSTIFY, OVS.CLOSED].includes(travelMonth?.status as OVS) && travelMonth?.transactions?.length && moment().diff(moment(travelMonth?.transactions[0]?.date).add(deadlineStatementExpensesLongTravel), 'days') > 8) {
                    await this.sendBlockingCardNotification(data);
                }
            }

            //online payments 
            for (const onlinePayment of onlinePayments) {
                if (!onlinePayment?.transactions?.length || !onlinePayment?.user?.email) continue;

                if (![OVS.JUSTIFY, OVS.CLOSED].includes(onlinePayment?.status as OVS) && onlinePayment?.transactions?.length && moment().diff(moment(onlinePayment?.transactions[0]?.date).add(deadlineOnlinePayment), 'days') > 0) {
                    await this.sendFormalNoticeNotification(onlinePayment, 'exceedingCeiling');
                    // await OnlinePaymentController.onlinePaymentService.update({ _id: onlinePayment._id.toString() }, { isUntimely: true });
                }
                if (![OVS.JUSTIFY, OVS.CLOSED].includes(onlinePayment?.status as OVS) && onlinePayment?.transactions?.length && moment().diff(moment(onlinePayment?.transactions[0]?.date).add(deadlineOnlinePayment), 'days') > 8) {
                    await this.sendBlockingCardNotification(onlinePayment);
                }
            }

            //importations 
            for (const importation of importations) {
                if (!importation?.transactions?.length || !importation?.user?.email) continue;
                const startDateOfClearance = await getStartDateOfClearance(importation);
                const deadline = importation.type?.code === ExpenseCategory.IMPORT_OF_GOODS ? goodsDeadline : servicesDeadline;

                if (![OVS.JUSTIFY, OVS.CLOSED].includes(importation?.status as OVS) && moment().diff(moment(startDateOfClearance).add(deadline), 'days') > 0) {
                    await this.sendFormalNoticeNotification(importation, 'import');
                    // await ImportsController.importsService.update({ _id: importation._id }, { isUntimely: true });
                }
                if (![OVS.JUSTIFY, OVS.CLOSED].includes(importation?.status as OVS) && moment().diff(moment(startDateOfClearance).add(deadline), 'days') > 0) {
                    await this.sendBlockingCardNotification(importation);
                }
            }

            VisaOperationsService.queueStateRevival = QueueState.PENDING;
            console.log('===============-==================================-==================================');
            console.log('===============-==============  END REVIVAL TREATMENT ==================-============');
            console.log('===============-========================================================-============');
        } catch (e: any) {
            VisaOperationsService.queueStateRevival = QueueState.PENDING;
            console.log('===============-==================================-==================================');
            console.log('===============-==============  ERROR DURING REVIVAL TREATMENT =========-============');
            console.log('===============-========================================================-============');
            this.logger.error(`error during revival mail cron execution \n${e.stack}\n`);
        }
    }

    async getSensitiveClient(operation: any): Promise<any> {
        let sensitiveClients = ((await SettingsController.settingsService.findOne({ filter: { key: settingsKeys.SENSITIVE_CUSTOMER_CODES } }))?.data || '')?.replace(/\s/g, '');
        sensitiveClients = sensitiveClients?.split(',');
        // get bank-account-manager and head-of-agency-email data for notify in cc with client
        let user!: User; let bankAccountManager!: BankAccountManager; let agencyHeadEmail!: string;
        try {
            user = await UsersController.usersService.findOne({ filter: { clientCode: operation?.user?.clientCode, category: { $in: [UserCategory.DEFAULT, UserCategory.ENTERPRISE] } } });
            bankAccountManager = await BankAccountManagerController.bankAccountManagerService.findOne({ filter: { CODE_GES: user.userGesCode } });
            agencyHeadEmail = (await UsersController.usersService.findOne({ filter: { category: UserCategory.AGENCY_HEAD, bankProfileCode: 'R204', 'age.code': user?.age?.code } }))?.email || '';
        } catch (error) { }
        const ccEmail = (user?.userGesCode?.substring(0, 1) === '9' || !bankAccountManager) ? agencyHeadEmail : bankAccountManager?.EMAIL;
        return { sensitiveClients, user, ccEmail }
    }

    async sendFormalNoticeNotification(operation: any, type: 'proofTravel' | 'exceedingCeiling' | 'import'): Promise<void> {
        const lang = 'fr';
        const { sensitiveClients, user, ccEmail } = await this.getSensitiveClient(operation);
        (sensitiveClients.includes(user?.bankProfileCode))
            ? notificationEmmiter.emit('formal-notice-mail', new FormalNoticeEvent(operation, true, lang, ccEmail, type))
            : notificationEmmiter.emit('formal-notice-mail', new FormalNoticeEvent(operation, false, lang, ccEmail, type));
        // TODO send formal-notice SMS 
    }

    async sendBlockingCardNotification(operation: any): Promise<void> {
        const lang = 'fr';
        const { sensitiveClients, user, ccEmail } = await this.getSensitiveClient(operation);
        (sensitiveClients.includes(user?.bankProfileCode))
            ? notificationEmmiter.emit('visa-template-mail', new TransactionOutsideNotJustifiedEvent(operation, true, lang, ccEmail))
            : notificationEmmiter.emit('visa-template-mail', new TransactionOutsideNotJustifiedEvent(operation, false, lang, ccEmail));
        // TODO send transaction outside not justified SMS,   notificationEmmiter.emit('template-sms', new TemplateSmsEvent(data, phone, key, lang, id, subject));
    }

    async detectListOfUsersToBlocked(): Promise<void> {
        try {
            const travelsExceeded = (await TravelController.travelService.findAll({ filter: { 'transactions.isExceed': { $exists: true } } }))?.data;
            const onlinePaymentsExceeded = (await OnlinePaymentController.onlinePaymentService.findAll({ filter: { status: { 'transactions.isExceed': { $exists: true } } } }))?.data;
            let transactionsExceeded: VisaTransaction[] = [];
            if (isEmpty([...travelsExceeded, ...onlinePaymentsExceeded])) return;
            transactionsExceeded = await VisaOperationsController.visaOperationsService.getCustomerAccountToBlocked([...travelsExceeded, ...onlinePaymentsExceeded]);

            if (!isEmpty(transactionsExceeded)) {
                notificationEmmiter.emit('list-of-users-to-blocked-mail', new ListOfUsersToBlockedEvent(transactionsExceeded));
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

            const { JUSTIFY, CLOSED } = OVS;

            const travelsMonths = await TravelMonthController.travelMonthService.findAllAggregate<TravelMonth>([{
                $match: { 'transactions.isExceed': true, isUntimely: { $exists: false }, status: { $nin: [JUSTIFY, CLOSED] } }
            }]);
            const travelFilter = {
                $or: [
                    { _id: { $in: travelsMonths.map(e => new ObjectId(e.travelId?.toString())) } },
                    {
                        $and: [
                            { isUntimely: { $exists: false } },
                            {
                                $or: [
                                    { 'proofTravel.status': { $nin: [JUSTIFY, CLOSED] } },
                                    {
                                        $and: [
                                            { 'transactions.isExceed': true },
                                            { status: { $nin: [JUSTIFY, CLOSED] } },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },

                ]
            };
            const shortTravels = await TravelController.travelService.findAllAggregate<Travel>([{ $match: travelFilter }]);
            const onlinePayments = await OnlinePaymentController.onlinePaymentService.findAllAggregate<OnlinePaymentMonth>([{
                $match: { 'transactions.isExceed': true, isUntimely: { $exists: false }, status: { $nin: [OVS.JUSTIFY, OVS.CLOSED] } }
            }]);
            const importations = await ImportsController.importsService.findAllAggregate<Import>([{ $match: { status: { $nin: [JUSTIFY, CLOSED] }, finalPayment: true } }]);
            if (![...travelsMonths, ...shortTravels, ...onlinePayments, ...importations].length) return;
            await VisaOperationsController.visaOperationsService.updateDelayStatusFileOutTime(travelsMonths, shortTravels, onlinePayments, importations);
        } catch (e: any) {
            this.logger.error(`detect users not justified transaction failed \n${e.stack}\n`);
        }
    }

    private async travelDataGroupedByCli(cli: string, travelTransactions: VisaTransaction[]): Promise<TravelDataGrouped[]> {

        let currentIndex = 0
        const transactionsGroupedByTravel: TravelDataGrouped[] = [];

        // sort transactions by date in ascending order
        travelTransactions = sortTransactionsByDateInAscendingOrder(travelTransactions);

        for (const transaction of travelTransactions) {

            // find travel which dates matchs with the current transaction date
            let travel: TravelsForProcessing = await TravelController.travelService.getTravelsForProcessing({ cli, date: moment(transaction?.date, 'DD/MM/YYYY HH:mm:ss').valueOf() });

            if (isEmpty(travel)) {

                // Insert the first transaction and continue
                if (currentIndex === 0 && isEmpty(transactionsGroupedByTravel[currentIndex])) {
                    transactionsGroupedByTravel[currentIndex] = { transactions: [transaction] }
                    continue;
                }

                // get the first date of the current transactions Grouped By Travel's transactions
                const firstDate = Math.min(...transactionsGroupedByTravel[currentIndex]?.transactions.map((elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').valueOf())));
                const maxDate = await getLastDateOfTravel(firstDate, cli);
                // let travel!: Travel;
                // try { travel = await TravelController.travelService.findOne({ filter: { 'user.clientCode': cli, 'proofTravel.dates.start': { $gt: firstDate } } }); } catch (e) { }
                // const firstDatePlus29Days = moment(firstDate).add(29, 'days').valueOf();
                // const maxDate = travel && travel?.proofTravel?.dates?.start && travel?.proofTravel?.dates?.start <= firstDatePlus29Days
                //     ? travel?.proofTravel?.dates?.start : firstDatePlus29Days;
                // // const maxDate = moment(firstDate).endOf('month').valueOf();

                // verify if the date of the current transaction is out of current transactions Grouped By Travel's range or if current transactions Grouped By Travel does'nt containt travel
                if (moment(transaction?.date, 'DD/MM/YYYY HH:mm:ss').valueOf() > maxDate) {
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

            transactionsGroupedByTravel[currentIndex].travelId = travel?._id?.toString();
        }
        return transactionsGroupedByTravel;
    }

    private async onlinePaymentGroupedByCli(cli: string, allOnlinePaymentTransactions: VisaTransaction[]): Promise<OnlinePaymentGrouped[]> {
        if (!allOnlinePaymentTransactions) { return allOnlinePaymentTransactions; }

        // sort transactions by date in ascending order
        allOnlinePaymentTransactions = allOnlinePaymentTransactions.sort((a, b) => {
            return moment(a.date, 'DD/MM/YYYY HH:mm:ss').valueOf() < moment(b.date, 'DD/MM/YYYY HH:mm:ss').valueOf() ? -1 : moment(a.date, 'DD/MM/YYYY HH:mm:ss').valueOf() > moment(b.date, 'DD/MM/YYYY HH:mm:ss').valueOf() ? 1 : 0;
        });
        const months = [...new Set(allOnlinePaymentTransactions.map((elt) => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM')))];

        const transactionsGroupedByOnlinePayment: OnlinePaymentGrouped[] = [];

        for (const month of months) {
            let onlinePayment: OnlinePaymentMonth | null = null;
            const selectedTransactions = allOnlinePaymentTransactions.filter(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM') === month);

            const onlinePaymentTransactions: VisaTransaction[] = []; let travelTransactions: VisaTransaction[] = []; let travelId: string | undefined = undefined;
            for (const transaction of selectedTransactions) {
                const travel: TravelsForProcessing = await TravelController.travelService.getTravelsForProcessing({ cli, date: moment(transaction?.date, 'DD/MM/YYYY HH:mm:ss').valueOf() });
                if (isEmpty(travel)) { onlinePaymentTransactions.push(transaction); continue; }
                (travelId) && (travelId !== travel?._id?.toString()) && transactionsGroupedByOnlinePayment.push({ transactions: travelTransactions, onlinePaymentId: undefined, travelId, month }) && (travelTransactions = []);
                travelId = travel?._id?.toString();
                travelTransactions.push(transaction);
            }

            (travelTransactions.length) && transactionsGroupedByOnlinePayment.push({ transactions: travelTransactions, onlinePaymentId: undefined, travelId, month });

            if (onlinePaymentTransactions.length) {
                try { onlinePayment = await OnlinePaymentController.onlinePaymentService.findOne({ filter: { 'user.clientCode': cli, currentMonth: month } }); } catch (e) { }
                transactionsGroupedByOnlinePayment.push({ transactions: onlinePaymentTransactions, onlinePaymentId: onlinePayment?._id?.toString() || undefined, travelId: undefined, month });
            }
        }

        return transactionsGroupedByOnlinePayment;
    }

    private async travelTreatment(cli: string, transactionsGroupedByTravel: TravelDataGrouped[]) {
        for (const element of transactionsGroupedByTravel) {
            if (isEmpty(element?.transactions)) { return }
            const dates = element?.transactions?.map((elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').valueOf()));
            const firstDate = moment(Math.min(...dates)).startOf('day').valueOf();
            const lastDate = await getLastDateOfTravel(firstDate, cli, true);

            let travel!: Travel;
            const toBeUpdated: ToBeUpdated = { notifications: [] };
            if (!element?.travelId) {
                travel = generateTravelByProcessing(cli, element?.transactions[0], { start: firstDate, end: lastDate });
            }

            try { travel = element?.travelId ? await TravelController.travelService.findOne({ filter: { _id: element?.travelId } }) : await TravelController.travelService.insertTravelFromSystem(travel); } catch (e) { }
            if (!travel || travel instanceof Error) { continue; }
            travel.notifications = [];

            // TODO check if it exists onlinePaymentMonth, which content transactions between period of travel
            // If it exist, you must extract this operation on this onlinePaymentMonth, save onlinePaymentMonth
            // Insert this operation on travel, sort ascending all transactions by date, and call method to add transactions on travel

            const onlinePaymentTransactions = await getOnlinePaymentTransactionForTravel(cli, firstDate, lastDate);
            element?.transactions?.push(...onlinePaymentTransactions);

            if (travel.travelType === TravelType.SHORT_TERM_TRAVEL) {
                await this.addTransactionsInTravel(travel, element?.transactions, toBeUpdated);
            }

            if (travel.travelType === TravelType.LONG_TERM_TRAVEL) {
                const months = [...new Set(element.transactions.map(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').format('YYYYMM')))];
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

            onlinePayment.transactions = !element.onlinePaymentId ? [...element?.transactions] : [...(travel?.transactions || []), ...element?.transactions];

            // sort transactions by date in ascending order
            onlinePayment.transactions = sortTransactionsByDateInAscendingOrder(onlinePayment.transactions);

            toBeUpdated.notifications = verifyExceedingOnTravel(onlinePayment, +Number(onlinePayment?.ceiling));
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
            // sort transactions by date in ascending order
            travel.transactions = sortTransactionsByDateInAscendingOrder(travel.transactions);
            toBeUpdated.notifications = verifyExceedingOnTravel(travel, +Number(travel?.ceiling));
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

            toBeUpdated['proofTravel.nbreOfMonth'] = checkTravelNumberOfMonths(month, travel?.proofTravel?.nbreOfMonth || 0, travel?.proofTravel?.dates?.start as number); // in case of new month creation check the number of months in the long term travel
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
    private async getCustomerAccountToBlocked(folders: (Travel | OnlinePaymentMonth)[]) {
        try {
            let transactionExceeded: VisaTransaction[] = [];
            const template = await TemplatesController.templatesService.findOne({ filter: { key: 'transactionOutsideNotJustified' } });

            for (const data of folders) {
                const firsDate = Math.min(...(data?.transactions || [])?.map(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').valueOf()));
                const transaction = data?.transactions?.find(elt => moment(elt?.date, 'DD/MM/YYYY HH:mm:ss').valueOf() === firsDate);

                const dateDiffInDays = moment().diff(moment(firsDate), 'days');

                if (template && dateDiffInDays > +template?.period && transaction) { transactionExceeded.push(transaction); } else { continue; }
            }

            return transactionExceeded || [];
        } catch (error) { throw error; }
    }

    private async getOrCreateUserIfItDoesNtExists(clientCode: string) {
        try {
            let user: User | null = null;
            try { user = await UsersController.usersService.findOne({ filter: { clientCode, category: { $in: [UserCategory.DEFAULT, UserCategory.ENTERPRISE] } } }); } catch (e) { }
            if (user) { return user; }

            const createData = { clientCode, enabled: true, category: UserCategory.DEFAULT };
            return await UsersController.usersService.createUser(createData, 'front-office');
        } catch (e: any) {
            this.logger.error(`error during when getAndCreateUserIfItDoesNtExists for visa-transactions integration \n${e.stack}\n`);
        }
    }

    // l add this method to getting public access on this method (getOrCreateUserIfItDoesNtExists) 
    async newGetOrCreateUserIfItDoesNtExists(clientCode: string) {
        await this.getOrCreateUserIfItDoesNtExists(clientCode);
    }

    private async updateDelayStatusFileOutTime(travelsMonths: TravelMonth[] = [], travels: Travel[] = [], onlinePayments: OnlinePaymentMonth[] = [], importations: Import[] = []): Promise<void> {
        try {
            const {
                deadlineProofLongTravel, deadlineStatementExpensesLongTravel, deadlineProofShortTravel,
                deadlineStatementExpensesShortTravel, deadlineOnlinePayment, servicesDeadline, goodsDeadline,
            } = await getDeadlines();
            let usersIdAbode: any[] = [];
            // check and update travel-months deadlines
            const travelsMonthsIds = travelsMonths.filter(travelMonth => travelMonth?.transactions?.length && moment().diff(moment(travelMonth?.transactions[0]?.date).add(deadlineStatementExpensesLongTravel), 'days') > 0).map(e => new ObjectId(e?._id?.toString()));
            await TravelMonthController.travelMonthService.updateMany({ _id: { $in: travelsMonthsIds } }, { isUntimely: true });
            // users = await TravelMonthController.travelMonthService.findAll({ filter: { _id: { $in: travelsMonthsIds } }, projection: { userId : 1} });

            // check and update travels deadlines
            const longTravelsIds = travels.filter(travel =>
                travel.travelType === TravelType.LONG_TERM_TRAVEL &&
                ![OVS.JUSTIFY, OVS.CLOSED].includes(travel?.proofTravel?.status as OVS) && moment().diff(moment(travel?.proofTravel?.dates?.start).add(deadlineProofLongTravel), 'days') > 0
            ).map(e => new ObjectId(e?._id?.toString()));
            const shortTravelsIds = travels.filter(travel =>
                travel.travelType === TravelType.SHORT_TERM_TRAVEL &&
                ((![OVS.JUSTIFY, OVS.CLOSED].includes(travel?.proofTravel?.status as OVS) && moment().diff(moment(travel?.proofTravel?.dates?.start).add(deadlineProofShortTravel), 'days') > 0) ||
                    (![OVS.JUSTIFY, OVS.CLOSED].includes(travel.status as OVS) && travel?.transactions?.length && moment().diff(moment(travel?.transactions[0]?.date).add(deadlineStatementExpensesShortTravel), 'days') > 0))
            ).map(e => new ObjectId(e?._id?.toString()));

            await TravelController.travelService.updateMany({ _id: { $in: [...longTravelsIds, ...shortTravelsIds] } }, { isUntimely: true });
            // check and update online-payments deadlines
            const onlinePaymentsIds = onlinePayments.filter(onlinePayment => onlinePayment?.transactions?.length && moment().diff(moment(onlinePayment?.transactions[0]?.date).add(deadlineOnlinePayment), 'days') > 0).map(e => new ObjectId(e?._id?.toString()));
            await OnlinePaymentController.onlinePaymentService.updateMany({ _id: { $in: onlinePaymentsIds } }, { isUntimely: true })
            // check and update importations deadlines
            for (const importation of importations) {
                const startDateOfClearance = await getStartDateOfClearance(importation);
                const deadline = importation.type?.code === ExpenseCategory.IMPORT_OF_GOODS ? goodsDeadline : servicesDeadline;
                (moment().diff(moment(startDateOfClearance).add(deadline), 'days') > 0) &&
                    (await ImportsController.importsService.update({ _id: importation._id }, { isUntimely: true }));
            }

        } catch (error) { throw error; }
    }

}