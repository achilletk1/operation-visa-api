import { averageTimeJustifyTravelData, chartDataTravel, generateConsolidateData, statusOperation } from "modules/reporting";
import { getNotficationsQuery, travelsForPocessingQuery } from "./helper";
import { BaseRepository } from "common/base";
import { TravelType } from "./enum";

export class TravelRepository extends BaseRepository {

    constructor() { super(); this.collectionName = 'visa_operations_travels'; }

    async getTravelReport(params: { status: any, start: number, end: number, travelType?: any, regionCode: string }) {
        return await this.findAllAggregate(generateConsolidateData(params));
    }

    async getStatusOperationTravelReport(params: { filterStatus: any, start: number, end: number, travelType?: any, agencyCode: string, regionCode: string }) {
        return await this.findAllAggregate(statusOperation(params));
    }

    async getAverageTimeJustifyTravelReport(params: { status: any, start: number, end: number, travelType?: any }) {
        return await this.findAllAggregate(averageTimeJustifyTravelData(params));
    }

    async getChartDataTravel(param: { start: number, end: number, travelType?: any }) {
        return await this.findAllAggregate(chartDataTravel(param));
    }

    async getTravelNotifications() {
        const data = await this.findAllAggregate(getNotficationsQuery);
        return data[0]?.notifications || [];
    }

    async getTravelsForPocessing(filters: { date: number; cli: string; travelType?: TravelType; }): Promise<any> {
        return (await this.findAllAggregate(travelsForPocessingQuery(filters)))[0];
    }

}
