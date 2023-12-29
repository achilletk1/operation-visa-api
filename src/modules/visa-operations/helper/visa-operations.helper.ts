import { DetectTransactionsEvent, notificationEmmiter, TemplateSmsEvent, VisaExcedingEvent } from 'modules/notifications';
import { generateTravelMonthByProcessing, generateNotificationData } from "./visa-operations-formatter.helper";
import { TravelMonth, TravelMonthController } from "modules/travel-month";
import { OnlinePaymentMonth } from "modules/online-payment";
import { VisaTransaction } from "modules/visa-transactions";
import { Travel, TravelController } from "modules/travel";
import { OpeVisaStatus } from "../enum";
import { getTotal } from "common/utils";
import { logger } from "winston-config";
import { get, isEmpty } from "lodash";
import moment from "moment";

export const verifyExcedingOnTravel = (data: Travel | TravelMonth | OnlinePaymentMonth, ceiling: number, travel?: Travel) => {
    const totalAmount = getTotal(data?.transactions || []);
    if (totalAmount > ceiling) {
        data.status = [OpeVisaStatus.CLOSED, OpeVisaStatus.JUSTIFY, OpeVisaStatus.VALIDATION_CHAIN].includes(Number(data?.status)) ? data?.status : OpeVisaStatus.EXCEDEED;
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

export const getOrCreateTravelMonth = async (travel: Travel, month: string) => {
    let travelMonth;
    try { travelMonth = await TravelMonthController.travelMonthService.findOne({ filter: { travelId: travel?._id, month: month } }); } catch(e) {}

    if (isEmpty(travelMonth)) {
        travelMonth = generateTravelMonthByProcessing(travel?._id.toString(), String(travel?.user?._id), month);
        const result = await TravelMonthController.travelMonthService.create(travelMonth);
        travelMonth._id = result?.data;
    }
    return travelMonth;
}

export const updateTravelMonth = async (travelMonth: TravelMonth, transactions: VisaTransaction[], toBeUpdated: any, travel: Travel) => {
    travelMonth?.transactions?.push(...transactions);
    toBeUpdated.notifications = verifyExcedingOnTravel(travelMonth, +Number(travel?.ceiling), travel);
    await TravelMonthController.travelMonthService.updateTravelMonthsById(travelMonth?._id, { transactions: travelMonth?.transactions, "dates.updated": moment().valueOf() } as Partial<TravelMonth>);

}

export const updateTravel = async (travel: Travel, toBeUpdated: any) => {
    toBeUpdated['dates.updated'] = moment().valueOf();
    await TravelController.travelService.update({ _id: get(travel, '_id') }, { ...toBeUpdated });
}

export const sendEmailNotifications = async (notification: any) => {
    const { data, lang, receiver, id, key } = notification.data;

    if (key === 'firstTransaction')
        notificationEmmiter.emit('detect-transactions-mail', new DetectTransactionsEvent(data, receiver, lang, id));
    // await NotificationsController.notificationsService.sendEmailDetectTransactions(data, receiver, lang, id);

    if (key === 'ceilingOverrun')
        notificationEmmiter.emit('visa-exceding-mail', new VisaExcedingEvent(data, receiver, lang, id));
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
        let exceding = 0;

        transactions?.forEach((transaction: any) => {
            exceding += transaction.amount;
            if (exceding > ceiling){
                transaction.isExceed = true;
            }
        })
    }
    return transactions;
}
