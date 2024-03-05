import { OnlinePaymentMonth } from "modules/online-payment";
import { VisaTransaction } from "modules/visa-transactions";
import { Travel, TravelType } from "modules/travel";
import { TravelMonth } from "modules/travel-month";
import { OpeVisaStatus } from "../enum";
import { get } from "lodash";
import moment from "moment";

export const generateTravelByProcessing = (cli: string, transaction: VisaTransaction, dates: any): Travel => {
    return {
        status: OpeVisaStatus.TO_COMPLETED,
        user: {
            clientCode: cli,
            fullName: transaction?.fullName,
            email: transaction?.email,
            tel: transaction?.tel,
            lang: transaction?.lang
        },
        travelRef: '',
        travelType: TravelType.SHORT_TERM_TRAVEL,
        ceiling: 0,
        dates: {
            created: new Date().valueOf(),
        },
        proofTravel: {
            // continents: [],
            // countries: [],
            dates: {
                start: dates.start,
                end: dates.end,
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
        // expenseDetails: [],
        expenseDetailsStatus: OpeVisaStatus.EMPTY,
        expenseDetailAmount: 0,
        othersAttachements: [],
        // otherAttachmentAmount: 0,
        // othersAttachmentStatus: OpeVisaStatus.EMPTY,
        transactions: []
    }
}

export const generateTravelMonthByProcessing = (travelId: string, userId: string, month: string): TravelMonth => {
    return {
        status: OpeVisaStatus.TO_COMPLETED,
        userId,
        travelId,
        month,
        dates: {
            created: new Date().valueOf(),
        },
        // expenseDetails: [],
        expenseDetailsStatus: OpeVisaStatus.EMPTY,
        expenseDetailAmount: 0,
        transactions: []

    }
}

export const generateNotificationData = (data: any, type: 'SMS' | 'EMAIL', template: string) => {
    const baseData = {
        data: { transactions: data.transactions, ceiling: data.ceiling, amount: data.totalAmount },
        lang: get(data, 'user.lang'),
        id: get(data, '_id').toString(),
        clientCode: get(data, 'user.clientCode'),
        key: template,
    }
    if (template === 'firstTransaction' && type === 'EMAIL') {
        return {
            data: {
                ...baseData,
                receiver: get(data, 'user.email'),
            },
            type,
        }
    }

    if (template === 'firstTransaction' && type === 'SMS') {
        return {
            data: {
                ...baseData,
                phone: get(data, 'user.tel'),
                subject: 'Détection d\'une transaction  Hors zone CEMAC',
            },
            type,
        }
    }

    if (template === 'ceilingOverrun' && type === 'EMAIL') {
        return {
            data: {
                ...baseData,
                receiver: get(data, 'user.email'),
            },
            type,
        }
    }

    if (template === 'ceilingOverrun' && type === 'SMS') {
        return {
            data: {
                ...baseData,
                phone: get(data, 'user.tel'),
                subject: 'Dépassement de plafond sur transactions hors zone cemac',
            },
            type,
        }
    }

}

export const checkTravelNumberOfMonths = (month: string, nbrefOfMonth: number, firstDate: number) => {
    const nbMonths = moment(month, 'YYYYMM').diff(moment(firstDate).startOf('months'), 'months') + 1;
    return nbMonths > nbrefOfMonth ? nbMonths : nbrefOfMonth;
}

export const generateOnlinePaymentMonth = (clientCode: string, transaction: VisaTransaction, month: string): OnlinePaymentMonth => {
    return {
        user: {
            clientCode,
            fullName: transaction.fullName,
            email: transaction.email,
            tel: transaction.tel,
            lang: transaction?.lang
        },
        currentMonth: +month,
        status: OpeVisaStatus.EMPTY,
        dates: {},
        amounts: 0,
        // statementAmounts: 0,
        ceiling: 0,
        // statements: [],
        transactions: [],
    }
}