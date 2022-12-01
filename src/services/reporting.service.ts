import moment = require('moment');
import { commonService } from './common.service';
import { travelsCollection } from '../collections/travels.collection';
import { onlinePaymentsCollection } from '../collections/online-payments.collection';
import * as reportingHelper from '../collections/helpers/reporting.collection.helper';
import { getStatementByStatus } from './helpers/visa-operations.service.helper';


export const reportingService = {


    getConsolidateData: async (fields: any) => {
        commonService.parseNumberFields(fields);
        const { statemenType, travelType, status, start, end } = fields
        const data = statemenType === 'TRAVEL' ?
            await travelsCollection.getTravelReport({ travelType, status, start, end }) :
            await onlinePaymentsCollection.getOnlinePaymentReport({ status, start, end });

        return [
            {
                type: 101,
                total: data[0]?.total[0]
            },
            {
                type: 102,
                total: data[0]?.nbreTransactions[0],
            },
            {
                type: 103,
                total: data[0]?.amountTransactions[0],
            },

        ]

    },

    getStatusOperation: async (fields: any) => {
        commonService.parseNumberFields(fields);
        let { filterStatus, travelType, statemenType, status, start, end } = fields;
        const data = statemenType === 'TRAVEL' ? await travelsCollection.getStatusOperationTravelReport({ travelType, filterStatus, start, end }) :
            await onlinePaymentsCollection.getStatusOperationOnlinePaymentReport({ filterStatus, start, end });
        return getStatementByStatus(data);
    },

    getAverageTimeJustify: async (fields: any) => {
        commonService.parseNumberFields(fields);
        let { statemenType, travelType,status, start, end } = fields;

        const data = statemenType === 'TRAVEL'? await travelsCollection.getAverageTimeJustifyTravelReport({ travelType, status, start, end }):
        await onlinePaymentsCollection.getAverageTimeJustifyOnlinePaymentReport({ status, start, end });
        const dateTime = new Date(data[0]?.time);

        return `${dateTime.getDay() || 0} Jrs-${dateTime.getMinutes() || 0} min-${dateTime.getSeconds() || 0} s`
    },

    getChartData: async (fields: any): Promise<any> => {
        await commonService.timeout(1000);

        commonService.parseNumberFields(fields);

        const { start, end, travelType, statemenType } = fields;
        delete fields.start;
        delete fields.end;
        delete fields.type;

        const range = (start && end) ?
            { start: moment(start, 'YYYY-MM-DD').startOf('day').valueOf(), end: moment(start, 'YYYY-MM-DD').endOf('day').valueOf() }
            : { start: moment().startOf('year').valueOf(), end: moment().endOf('year').valueOf() }

        try {
            let data = [];
            if (statemenType === 'TRAVEL') {
                data = await travelsCollection.getChartDataTravel({ travelType, start, end });
            }
            else {
                data = await onlinePaymentsCollection.getChartDataOnlinePayment({ start, end });
            }

            let result = {};

            // tslint:disable-next-line: forin
            for (const types in data) {
                // if (!data.hasOwnProperty(types)) { break; }
                result = reportingHelper.generateChartByType(data);
                const r = ""
            }
            return result;
        } catch (error) {
            return error;
        }
    },


}











