import { generateChartByType, listOfUntimelyClientCodesProofTravelAggregation, listOfUntimelyClientCodesTransactionsAggregation } from "./helper";
import { getAGEListByBankCode, getStatementByStatus } from "common/utils";
import { isDev, parseNumberFields, timeout } from "common/helpers";
import { OnlinePaymentController } from "modules/online-payment";
import { TravelMonthController } from "modules/travel-month";
import { TravelController } from "modules/travel";
import { CbsController } from 'modules/cbs';
import { BaseService } from "common/base";
import { cloneDeep } from "lodash";
import moment from "moment";
import { UsersController } from "modules/users";

export class ReportingService extends BaseService {

    constructor() { super() }

    async getConsolidateData(fields: { [key: string]: string }) {
        // fields = parseNumberFields(fields);
        const filter = this.generateFilter(fields);

        const { formalNoticeClientCodes, blockedClientCodes } = await UsersController.usersService.getUserInDemeureAndToBlock(filter);

        try {
            const { statemenType: statementType, travelType, status, start, end, regionCode } = fields;
            const data = statementType === 'TRAVEL' ?
                await TravelController.travelService.getTravelReport({ travelType: +travelType, status, start: +start, end: +end, regionCode }) :
                await OnlinePaymentController.onlinePaymentService.getOnlinePaymentReport({ status, start: +start, end: +end, regionCode });

            return [
                { type: 101, total: data[0]?.total[0] || 0 },
                { type: 102, total: data[0]?.nbreTransactions[0] || 0, },
                { type: 103, total: data[0]?.amountTransactions[0] || 0, },
                { type: 104, total: formalNoticeClientCodes?.length, },
                { type: 105, total: blockedClientCodes?.length },
            ];
        } catch (error) { throw error; }

    }

    async getStatusOperation(fields: { [key: string]: string }) {
        try {
            parseNumberFields(fields);
            let { filterStatus, travelType, statemenType: statementType, start, end, agencyCode, regionCode } = fields;
            const data = statementType === 'TRAVEL' ? await TravelController.travelService.getStatusOperationTravelReport({ travelType, filterStatus, start: +start, end: +end, agencyCode, regionCode }) :
                await OnlinePaymentController.onlinePaymentService.getStatusOperationOnlinePaymentReport({ filterStatus, start: +start, end: +end, agencyCode, regionCode });
            return getStatementByStatus(data);
        } catch (error) { throw error; }
    }

    async getAgencies({ filter }: { filter: { [key: string]: string } }): Promise<{ CODE_AGENCE: string; NOM_AGENCE: string; }[]> {
        try {
            const bankList = await CbsController.cbsService.getBankList();
            return getAGEListByBankCode(filter?.CountryCode, filter?.bankCode, bankList);
        } catch (error) { throw (error); }
    }

    async getAverageTimeJustify(fields: { [key: string]: string }) {
        try {
            parseNumberFields(fields);
            let { statemenType: statementType, travelType, status, start, end } = fields;

            const data = statementType === 'TRAVEL' ? await TravelController.travelService.getAverageTimeJustifyTravelReport({ travelType, status, start: +start, end: +end }) :
                await OnlinePaymentController.onlinePaymentService.getAverageTimeJustifyOnlinePaymentReport({ status, start: +start, end: +end });
            const dateTime = new Date(data[0]?.time);
            return { averageTime: `${dateTime.getDay() || 0} Jrs-${dateTime.getMinutes() || 0} min-${dateTime.getSeconds() || 0} s` };
        } catch (error) { throw error; }
    }

    async getChartData(fields: { [key: string]: string }) {
        isDev && await timeout(1000);

        parseNumberFields(fields);

        const { start, end, travelType, statemenType } = fields;
        delete fields.start;
        delete fields.end;
        delete fields.type;

        const range = (start && end) ?
            { start: moment(start, 'DD/MM/YYYY').startOf('day').valueOf(), end: moment(start, 'DD/MM/YYYY').endOf('day').valueOf() }
            : { start: moment().startOf('year').valueOf(), end: moment().endOf('year').valueOf() }

        try {
            const data = (statemenType === 'TRAVEL')
                ? await TravelController.travelService.getChartDataTravel({ travelType, start: range?.start, end: range?.end })
                : await OnlinePaymentController.onlinePaymentService.getChartDataOnlinePayment({ start: range?.start, end: range?.end });

            let result = {};

            // tslint:disable-next-line: forin
            for (const types in data) {
                // if (!data.hasOwnProperty(types)) { break; }
                result = generateChartByType(data);
            }
            return result;
        } catch (error) { throw error; }
    }

    private generateFilter(fields: { [key: string]: string }) {
        const { travelType, status, start, end, regionCode } = fields;

        let params: { [key: string]: string | number } = {};

        // (statemenType) && (params["statemenType"] =  statemenType);

        (travelType) && (params["travelType"] = +travelType);

        (status) && (params["status"] = status);

        // (agencyCode) && (params["agencyCode"] = agencyCode);

        (start) && (params["start"] = start);

        (end) && (params["end"] = end);

        (regionCode) && (params["regionCode"] = regionCode);

        return params;
    }

}