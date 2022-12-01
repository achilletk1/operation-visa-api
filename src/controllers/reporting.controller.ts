
import { Request, Response } from 'express';
import { commonService } from '../services/common.service';
import { reportingService } from '../services/reporting.service';

export const reportingController = {
    init: (app: any): void => {

        app.get('/reporting/consolidate', async (req: Request, res: Response) => {
            const code = req.params.code;

            const data: any = await reportingService.getConsolidateData(req.query);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        app.get('/reporting/statusOperations', async (req: Request, res: Response) => {

            const data: any = await reportingService.getStatusOperation(req.query);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        app.get('/reporting/getAverageTimeJustify', async (req: Request, res: Response) => {

            const data: any = await reportingService.getAverageTimeJustify(req.query);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });
 
        app.get('/reporting/chart', async (req: Request, res: Response) => {

            const data = await reportingService.getChartData(req.query);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

    }
};