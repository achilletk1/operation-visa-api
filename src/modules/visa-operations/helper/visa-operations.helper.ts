import { DetectTransactionsEvent, notificationEmmiter, TemplateSmsEvent, VisaExceedingEvent } from 'modules/notifications';
import { generateTravelMonthByProcessing, generateNotificationData } from "./visa-operations-formatter.helper";
import { BankAccountManager, BankAccountManagerController } from 'modules/bank-account-manager';
import { OnlinePaymentController, OnlinePaymentMonth } from "modules/online-payment";
import { TravelMonth, TravelMonthController } from "modules/travel-month";
import { User, UserCategory, UsersController } from 'modules/users';
import { SettingsController, settingsKeys } from 'modules/settings';
import { VisaTransaction } from "modules/visa-transactions";
import { Travel, TravelController } from "modules/travel";
import { ToBeUpdated } from '../visa-operations.service';
import { Import } from 'modules/imports';
import { getTotal } from "common/utils";
import { logger } from "winston-config";
import { get, isEmpty } from "lodash";
import { ObjectId } from 'mongodb';
import moment from 'moment';

export const verifyExceedingOnTravel = (data: Travel | TravelMonth | OnlinePaymentMonth, ceiling: number, travel?: Travel) => {
    const totalAmount = getTotal(data?.transactions || []);
    if (totalAmount > ceiling) {
        // data.status = [OpeVisaStatus.CLOSED, OpeVisaStatus.JUSTIFY, OpeVisaStatus.VALIDATION_CHAIN].includes(Number(data?.status)) ? data?.status : OpeVisaStatus.EXCEEDED;
        const userData = travel ? travel : data;

        // TODO send increase notification after status change to exceeded
        logger.debug(`Exceeding data, id: ${data?._id}`);
        return [
            generateNotificationData({ ...userData, totalAmount }, "EMAIL", 'ceilingOverrun'),
            generateNotificationData({ ...userData, totalAmount }, "SMS", 'ceilingOverrun'),
        ];
    }

    return [];
}

export const getOrCreateTravelMonth = async (travel: Travel, month: string) => {
    let travelMonth;
    try { travelMonth = await TravelMonthController.travelMonthService.findOne({ filter: { travelId: travel?._id, month: month } }); } catch (e) { }

    if (isEmpty(travelMonth)) {
        travelMonth = generateTravelMonthByProcessing(travel?._id.toString(), String(travel?.user?._id), +month);
        const result = await TravelMonthController.travelMonthService.create(travelMonth);
        travelMonth._id = result?.data;
    }
    return travelMonth;
}

export const updateTravelMonth = async (travelMonth: TravelMonth, transactions: VisaTransaction[], toBeUpdated: ToBeUpdated, travel: Travel) => {
    travelMonth.transactions = isEmpty(travelMonth?.transactions) ? [...transactions] : [...(travelMonth?.transactions || []), ...transactions];
    toBeUpdated.notifications = verifyExceedingOnTravel(travelMonth, +Number(travel?.ceiling), travel);
    await TravelMonthController.travelMonthService.updateTravelMonthsById(travelMonth?._id, { transactions: travelMonth?.transactions, "dates.updated": new Date().valueOf() } as Partial<TravelMonth>);

}

export const updateTravel = async (travel: Travel, toBeUpdated: any) => {
    toBeUpdated['dates.updated'] = new Date().valueOf();
    await TravelController.travelService.update({ _id: get(travel, '_id') }, { ...toBeUpdated });
}

export const sendEmailNotifications = async (notification: any) => {
    const { data, lang, receiver, id, key, clientCode } = notification.data;
    let user: User; let bankAccountManager!: BankAccountManager;
    try {
        user = await UsersController.usersService.findOne({ filter: { clientCode, category: UserCategory.DEFAULT } });
        bankAccountManager = await BankAccountManagerController.bankAccountManagerService.findOne({ filter: { CODE_GES: user.userGesCode } });
    } catch (error) { }

    if (key === 'firstTransaction')
        notificationEmmiter.emit('detect-transactions-mail', new DetectTransactionsEvent(data, receiver, lang, id, bankAccountManager?.EMAIL));
    // await NotificationsController.notificationsService.sendEmailDetectTransactions(data, receiver, lang, id);

    if (key === 'ceilingOverrun')
        notificationEmmiter.emit('visa-exceding-mail', new VisaExceedingEvent(data, receiver, lang, id, bankAccountManager?.EMAIL));
    // await NotificationsController.notificationsService.sendEmailVisaExceding(data, receiver, lang, id);
}

export const sendSMSNotifications = async (notification: any) => {
    const { data, lang, id, phone, key, subject } = notification.data;
    notificationEmmiter.emit('template-sms', new TemplateSmsEvent(data, phone, key, lang, id, subject));
    // await NotificationsController.notificationsService.sendTemplateSMS(data, phone, key, lang, id, subject);
}

export const markExceedTransaction = (transactions: VisaTransaction[], ceiling: number) => {
    const totalAmount = getTotal(transactions || []);
    if (totalAmount > ceiling) {
        let exceeding = 0;

        transactions?.forEach(transaction => {
            exceeding += transaction?.amount || 0;
            if (exceeding > ceiling) {
                transaction.isExceed = true;
            }
        })
    }
    return transactions;
}

export const getDeadlines = async () => {
    try {
        const {
            SHORT_TRAVEL_DEADLINE_PROOF_TRAVEL, SHORT_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES,
            LONG_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES_MONTH, LONG_TRAVEL_DEADLINE_PROOF_TRAVEL,
            IMPORT_SERVICE_DEADLINE_JUSTIFY, IMPORT_GOODS_DEADLINE_JUSTIFY, ONLINE_PAYMENT_DEADLINE_JUSTIFY
        } = settingsKeys;

        const settings = await SettingsController.settingsService.findAll({
            filter: {
                key: {
                    $in: [
                        SHORT_TRAVEL_DEADLINE_PROOF_TRAVEL, SHORT_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES,
                        LONG_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES_MONTH, LONG_TRAVEL_DEADLINE_PROOF_TRAVEL,
                        IMPORT_SERVICE_DEADLINE_JUSTIFY, IMPORT_GOODS_DEADLINE_JUSTIFY, ONLINE_PAYMENT_DEADLINE_JUSTIFY,
                    ]
                }
            }
        });

        const deadlineProofLongTravel = (settings.data.find(e => e.key === LONG_TRAVEL_DEADLINE_PROOF_TRAVEL))?.data;
        const deadlineStatementExpensesLongTravel = (settings.data.find(e => e.key === LONG_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES_MONTH))?.data;

        const deadlineProofShortTravel = (settings.data.find(e => e.key === SHORT_TRAVEL_DEADLINE_PROOF_TRAVEL))?.data;
        const deadlineStatementExpensesShortTravel = (settings.data.find(e => e.key === SHORT_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES))?.data;

        const settingOnlinePayment = (settings.data.find(e => e.key === ONLINE_PAYMENT_DEADLINE_JUSTIFY))?.data;
        const deadlineOnlinePayment = settingOnlinePayment?.dataPeriod === 'month' ? settingOnlinePayment?.value * 30 : settingOnlinePayment?.value;

        const goodsDeadline = (settings.data.find(e => e.key === IMPORT_GOODS_DEADLINE_JUSTIFY))?.data;
        const servicesDeadline = (settings.data.find(e => e.key === IMPORT_SERVICE_DEADLINE_JUSTIFY))?.data;

        return {
            deadlineProofLongTravel, deadlineStatementExpensesLongTravel, deadlineProofShortTravel,
            deadlineStatementExpensesShortTravel, deadlineOnlinePayment, servicesDeadline, goodsDeadline,
        };
    } catch (error) { throw error; }
}

export const getStartDateOfClearance = async (importation: Import) => {
    try {
        let folder: Travel | OnlinePaymentMonth | TravelMonth = {};

        // search in travel-month collection
        await getImportationParentFolder('travel-month', TravelMonthController.travelMonthService, folder, importation);
        // search in travel collection
        await getImportationParentFolder('travel', TravelController.travelService, folder, importation);
        // search in online-payment collection
        await getImportationParentFolder('online-payment', OnlinePaymentController.onlinePaymentService, folder, importation);

        return moment(folder?.transactions?.find(e => e.importation?.finalPayment === true && e.importation._id === importation?._id?.toString())?.date, 'DD/MM/YYYY HH:mm:ss').valueOf();

    } catch (error) { throw error; }
}

export const getLastDateOfTravel = async (firstDate: number, cli: string, isNewTravel = false) => {
    try {
        let travel!: Travel;
        try { travel = await TravelController.travelService.findOne({ filter: { 'user.clientCode': cli, 'proofTravel.dates.start': { $gt: firstDate } } }); } catch (e) { }

        const firstDatePlus29Days = moment(firstDate).add(29, 'days').valueOf();

        if (travel && travel?.proofTravel?.dates?.start && travel?.proofTravel?.dates?.start <= firstDatePlus29Days) {
            return !isNewTravel ? travel?.proofTravel?.dates?.start : moment(travel?.proofTravel?.dates?.start).subtract(22, 'hours').valueOf();
        }
        return firstDatePlus29Days;
    } catch (error) {
        logger.error(`error during gettingLastDate Of Travel, with param cli: ${cli}, start travel date: ${firstDate}, is new travel: ${isNewTravel}`);
        return moment(firstDate).add(29, 'days').valueOf();
    }
}

export const sortTransactionsByDateInAscendingOrder = (transactions: VisaTransaction[]) => {
    try {
        // sort transactions by date in ascending order
        return transactions.sort((a, b) => {
            return moment(a.date, 'DD/MM/YYYY HH:mm:ss').valueOf() < moment(b.date, 'DD/MM/YYYY HH:mm:ss').valueOf() ? -1 : moment(a.date, 'DD/MM/YYYY HH:mm:ss').valueOf() > moment(b.date, 'DD/MM/YYYY HH:mm:ss').valueOf() ? 1 : 0;
        });
    } catch (error) { throw error; }
}

export const getOnlinePaymentTransactionForTravel = async (cli: string, start: number, end: number): Promise<VisaTransaction[]> => {
    try {
        const onlinePayments = (await OnlinePaymentController.onlinePaymentService.getOnlinePaymentWhichHaveTransactionsInPeriod()) ?? [];
        const onlinePaymentTransactions: VisaTransaction[] = [];
        for (const onlinePayment of onlinePayments) {
            const transactions = onlinePayment?.transactions?.filter((transaction: any) => moment(transaction?.date, 'DD/MM/YYYY HH:mm:ss').valueOf() >= start && moment(transaction?.date, 'DD/MM/YYYY HH:mm:ss').valueOf() <= end);
            onlinePaymentTransactions.push(...onlinePaymentTransactions);
        }
        return onlinePaymentTransactions;
    } catch (error) {
        logger.error(`error during getting OnlinePaymentTransaction For Travel, with param cli: ${cli}, start travel date: ${start}, end travel date: ${end}`);
        return [];
    }
}

const getImportationParentFolder = async (type: string, service: any, folder: Travel | OnlinePaymentMonth | TravelMonth, importation: Import) => {
    try {
        const filter = { _id: { $in: [] as ObjectId[] }, 'transactions.importation.finalPayment': true, 'transactions.importation._id': importation?._id?.toString() };
        filter._id.$in = importation?.transactions?.filter(e => e?.parent?.type === type).map(e => new ObjectId(e?.parent?._id?.toString())) ?? [];
        try { filter._id.$in.length && (folder = await service.findOne({ filter })); } catch (e) { }
    } catch (error) { throw error; }
}
