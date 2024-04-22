import { averageTimeJustifyTravelData, chartDataOnlinePayment, generateConsolidateData, statusOperation } from "modules/reporting";
import { getNotificationsQuery } from "./helper";
import { BaseRepository } from "common/base";

export class OnlinePaymentRepository extends BaseRepository {

    constructor() { super(); this.collectionName = 'visa_operations_online_payments'; }

    async getOnlinePaymentReport(params: { status: any, start: number, end: number, regionCode:string }) {
        return await this.findAllAggregate(generateConsolidateData(params));
    }

    async getStatusOperationOnlinePaymentReport(params: { filterStatus: any, start: number, end: number, agencyCode: string, regionCode: string }) {
        return await this.findAllAggregate(statusOperation(params));
    }

    async getAverageTimeJustifyOnlinePaymentReport(params: { status: any, start: number, end: number }) {
        return await this.findAllAggregate(averageTimeJustifyTravelData(params));
    }

    async getChartDataOnlinePayment(param: { start: number, end: number }) {
        return await this.findAllAggregate(chartDataOnlinePayment(param));
    }

    async getOnlinePaymentNotifications() {
        const data = await this.findAllAggregate(getNotificationsQuery);
        return data[0]?.notifications || [];
    }

    async getOnlinePaymentWhichHaveTransactionsInPeriod(cli?: string, start?: number, end?: number) {
        // const query = { 'user.clientCode': cli, 'transactions.0': { $exists: true } };
        // const callback = (e) => {
        //     const parts = e..split("/");
        //     const timestamp = new Date(parts[1] + "/" + parts[0] + "/" + parts[2]).getTime();
        //     (start <= timestamp) && (timestamp <= end) && (e = undefined);
        // };
        // return (await this.getCollection()).find(query).forEach(callback).toArray();
        const data = await this.findAllAggregate(getNotificationsQuery);
        return data[0]?.notifications || [];
    }

}
