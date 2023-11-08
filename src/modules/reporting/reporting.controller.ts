import { NextFunction, Request, Response } from 'express';
import { ReportingService } from "./reporting.service";

export class ReportingController  {

    static reportingService: ReportingService;

    constructor() { ReportingController.reportingService = new ReportingService(); }

    async getConsolidateData(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ReportingController.reportingService.getConsolidateData(req.query as any)); }
        catch (error) { next(error); }
    }

    async getStatusOperation(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ReportingController.reportingService.getStatusOperation(req.query as any)); }
        catch (error) { next(error); }
    }

    async getAverageTimeJustify(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ReportingController.reportingService.getAverageTimeJustify(req.query as any)); }
        catch (error) { next(error); }
    }

    async getChartData(req: Request, res: Response, next: NextFunction) {
        try { res.send(await ReportingController.reportingService.getChartData(req.query as any)); }
        catch (error) { next(error); }
    }


}