import { getPipelineLongTravels, getPipelineOnlinePayement, getPipelineShortTravels } from "modules/travel/helper";
import { OnlinePaymentController, OnlinePaymentMonth } from "modules/online-payment";
import { getAGEListByBankCode, getStatementByStatus } from "common/utils";
import { parseNumberFields, timeout } from "common/helpers";
import { Travel, TravelController } from "modules/travel";
import { generateChartByType } from "./helper";
import { CbsController } from 'modules/cbs';
import { TravelMonthController } from "..";
import { BaseService } from "common/base";
import moment from "moment";

export class ReportingService extends BaseService {

    constructor() { super() }

    async getConsolidateData(fields: any) {
        let totalOnelinePaymentBlocked: any = [];
        let allUserToBlocked = 0;
        const { statemenType, travelType } = fields;
        const filter = this.generateFilter(fields);
        const pipelineLongTravels = getPipelineLongTravels(filter);
        const pipelineShortTravels = getPipelineShortTravels(filter);
        const onlinePayementPipeline = getPipelineOnlinePayement(filter);
        const travels = (!travelType || +travelType === 100) ? await TravelController.travelService.findAllAggregate<Travel>(pipelineShortTravels) :
            await TravelMonthController.travelMonthService.findAllAggregate(pipelineLongTravels);
        const onlinePayments = await OnlinePaymentController.onlinePaymentService.findAllAggregate<OnlinePaymentMonth>(onlinePayementPipeline);
        let travelwithExceedDay: any[];
        // je retourne un objet de la forme suivante pour centraliser le traitement final après { clientCode, exceedDay(nombre de jour hors delais)}
        if (+travelType === 100 || !travelType && statemenType === 'TRAVEL') {
            travelwithExceedDay = this.getTravelByExceedDay(travels);
        } else {
            travelwithExceedDay = travels.filter((e: any) => {
                if (e.exceedDays) {
                    return {
                        "clientCode": e.clientCode,
                        "exceedDay": e.exceedDay
                    }
                }
            })
        }
        // je retourne un objet de la forme suivante pour centraliser le traitement final après { clientCode, exceedDay(nombre de jour hors delais)}
        if(statemenType !== 'TRAVEL') {
            totalOnelinePaymentBlocked = onlinePayments.map((e:any) => {
                let exceedDay=0;
                exceedDay = e.operationsExcess.filter((trl:any) => trl.exceedDay > 38);
                return { "clientCode": e.user?.clientCode , "exceedDay": exceedDay }
            });
        }
        // je recupere mes données centralisées et je retire les doublons
        allUserToBlocked = this.getTotalUserBlocked([...totalOnelinePaymentBlocked, ...travelwithExceedDay])
        try {
            const { statemenType, travelType, status, start, end, regionCode } = fields;
            const data = statemenType === 'TRAVEL' ?
                await TravelController.travelService.getTravelReport({ travelType: +travelType, status, start, end, regionCode }) :
                await OnlinePaymentController.onlinePaymentService.getOnlinePaymentReport({ status, start, end, regionCode });

            return [
                { type: 101, total: data[0]?.total[0] || 0 },
                { type: 102, total: data[0]?.nbreTransactions[0] || 0, },
                { type: 103, total: data[0]?.amountTransactions[0] || 0, },
                { type: 104, total: (statemenType === 'TRAVEL') ? travels.length - allUserToBlocked : onlinePayments.length - totalOnelinePaymentBlocked.length },
                { type: 105, total: (statemenType === 'TRAVEL') ? allUserToBlocked : totalOnelinePaymentBlocked.length },
            ];
        } catch (error) { throw error; }

    }

    getTotalUserBlocked(operation:any[]){
        return  [...new Set(operation.map((e:any) => e.clientCode))].length;
    }

    async getStatusOperation(fields: any) {
        try {
            parseNumberFields(fields);
            let { filterStatus, travelType, statemenType, start, end, agencyCode, regionCode } = fields;
            const data = statemenType === 'TRAVEL' ? await TravelController.travelService.getStatusOperationTravelReport({ travelType, filterStatus, start, end, agencyCode, regionCode }) :
                await OnlinePaymentController.onlinePaymentService.getStatusOperationOnlinePaymentReport({ filterStatus, start, end, agencyCode, regionCode });
            return getStatementByStatus(data);
        } catch (error) { throw error; }
    }

    async getAgencies({ filter }: any): Promise<{ CODE_AGENCE: string; NOM_AGENCE: string; }[]> {
        try {
            const bankList = await CbsController.cbsService.getBankList();
            return getAGEListByBankCode(filter?.CountryCode, filter?.bankCode, bankList);
        } catch (error) { throw (error); }
    }

    async getAverageTimeJustify(fields: any) {
        try {
            parseNumberFields(fields);
            let { statemenType, travelType, status, start, end } = fields;

            const data = statemenType === 'TRAVEL' ? await TravelController.travelService.getAverageTimeJustifyTravelReport({ travelType, status, start, end }) :
                await OnlinePaymentController.onlinePaymentService.getAverageTimeJustifyOnlinePaymentReport({ status, start, end });
            const dateTime = new Date(data[0]?.time);
            return { averageTime: `${dateTime.getDay() || 0} Jrs-${dateTime.getMinutes() || 0} min-${dateTime.getSeconds() || 0} s` };
        } catch (error) { throw error; }
    }

    async getChartData(fields: any) {
        await timeout(1000);

        parseNumberFields(fields);

        const { start, end, travelType, statemenType } = fields;
        delete fields.start;
        delete fields.end;
        delete fields.type;

        const range = (start && end) ?
            { start: moment(start, 'DD/MM/YYYY').startOf('day').valueOf(), end: moment(start, 'DD/MM/YYYY').endOf('day').valueOf() }
            : { start: moment().startOf('year').valueOf(), end: moment().endOf('year').valueOf() }

        try {
            let data = [];
            if (statemenType === 'TRAVEL') {
                data = await TravelController.travelService.getChartDataTravel({ travelType, start: range?.start, end: range?.end });
            }
            else {
                data = await OnlinePaymentController.onlinePaymentService.getChartDataOnlinePayment({ start: range?.start, end: range?.end });
            }

            let result = {};

            // tslint:disable-next-line: forin
            for (const types in data) {
                // if (!data.hasOwnProperty(types)) { break; }
                result = generateChartByType(data);
            }
            return result;
        } catch (error) { throw error; }
    }

    getTravelByExceedDay(travels: any[]) {
        let exceedDayForTravel: number;
        return travels.map((travel: any) => {
            exceedDayForTravel = this.getExceedDays(travel);
            return { "exceedDay": exceedDayForTravel, "clientCode": travel.user?.clientCode, "firstTransactionDate": travel.firstTransactionDate }
        });
    }

    getOnlinePaymentByExceedDay(payement: any[]) {
        let exceedDayForTravel: number;
        return payement.map((e: any) => {
            return e.operationsExcess.map((v: any) => {
                exceedDayForTravel = this.getExceedDaysPayement(v);
                return { "exceedDay": exceedDayForTravel, "clientCode": v._id, "firstTransactionDate": v.dateExcess }
            })
        });
    }

    getTravelBlocked(travels: Travel[]) {
        return travels.map(travel => {
            return this.getExceedDays(travel);
        }).filter(exceedDay => exceedDay !== 0 && exceedDay >= 38);
    }

    getExceedDays(currTravel: any) {
        const firstDate = moment(currTravel.firstTransactionDate, typeof currTravel.firstTransactionDate === 'string' ? 'DD/MM/YYYY HH:mm:ss' : '').valueOf();
        const exceedDays = moment().diff(moment(firstDate).add(30, 'days'), 'days');
        return exceedDays >= 0 ? exceedDays : 0;
    }
    getExceedDaysPayement(currTravel: any) {
        const firstDate = moment(currTravel.exceedDays, typeof currTravel.exceedDays === 'string' ? 'DD/MM/YYYY HH:mm:ss' : '').valueOf();
        const exceedDays = moment().diff(moment(firstDate).add(30, 'days'), 'days');
        return exceedDays >= 0 ? exceedDays : 0;
    }

    generateFilter(fields: any) {
        const { travelType, status, start, end, regionCode } = fields;

        let params: { [key: string]: any } = [];

        // if(statemenType) params["statemenType"] =  statemenType;

        if (travelType) params["travelType"] = +travelType;

        if (status) params["status"] = status;

        // if(agencyCode) params["agencyCode"] = agencyCode;

        if (start) params["start"] = start;

        if (end) params["end"] = end;

        if (regionCode) params["regionCode"] = regionCode;

        return params;
    }
}