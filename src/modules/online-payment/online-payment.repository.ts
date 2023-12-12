import { averageTimeJustifyTravelData, chartDataOnlinePayment, generateConsolidateData, statusOperation } from "modules/reporting";
import { getNotficationsQuery } from "./helper";
import { BaseRepository } from "common/base";

export class OnlinePaymentRepository extends BaseRepository {

    constructor() { super(); this.collectionName = 'visa_operations_online_payments'; }

    async getOnlinePaymentReport(params: { status: any, start: number, end: number }) {
        return await this.findAllAggregate(generateConsolidateData(params));
    }

    async getStatusOperationOnlinePaymentReport(params: { filterStatus: any, start: number, end: number })  {
        return await this.findAllAggregate(statusOperation(params));
    }

    async getAverageTimeJustifyOnlinePaymentReport(params: { status: any, start: number, end: number }) {
        return await this.findAllAggregate(averageTimeJustifyTravelData(params));
    }

    async getChartDataOnlinePayment(param: { start: number, end: number }) {
        return await this.findAllAggregate(chartDataOnlinePayment(param));
    }

    async getOnlinePaymentNotifications() {
        const data = await this.findAllAggregate(getNotficationsQuery);
        return data[0]?.notifications || [];
    }

}
