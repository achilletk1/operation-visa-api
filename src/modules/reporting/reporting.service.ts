import { getAGEListByBankCode, getStatementByStatus } from "common/utils";
import { OnlinePaymentController } from "modules/online-payment";
import { parseNumberFields, timeout } from "common/helpers";
import { TravelController } from "modules/travel";
import { generateChartByType } from "./helper";
import { CbsController } from 'modules/cbs';
import { BaseService } from "common/base";
import moment from "moment";

export class ReportingService extends BaseService {

    constructor() { super() }

    async getConsolidateData(fields: any) {
        try {
            parseNumberFields(fields);
            const { statemenType, travelType, status, start, end, regionCode } = fields
            const data = statemenType === 'TRAVEL' ?
                await TravelController.travelService.getTravelReport({ travelType, status, start, end, regionCode }) :
                await OnlinePaymentController.onlinePaymentService.getOnlinePaymentReport({ status, start, end, regionCode });

            return [
                { type: 101, total: data[0]?.total[0] || 0 },
                { type: 102, total: data[0]?.nbreTransactions[0] || 0, },
                { type: 103, total: data[0]?.amountTransactions[0] || 0, },
            ];
        } catch (error) { throw error; }

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

}