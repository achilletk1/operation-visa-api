
import { Request, Response } from 'express';
import { commonService } from '../services/common.service';
import { reportingService } from '../services/reporting.service';

export const reportingController = {
    init: (app: any): void => {

        app.get('/reporting/consolidate', async (req: Request, res: Response) => {
            const code = req.params.code;

            const data = await reportingService.getConsolidateData(code);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        app.get('/reporting/status/', async (req: Request, res: Response) => {

            const data = await reportingService.getChartData(req.body);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });


        app.get('/reporting/chart/', async (req: Request, res: Response) => {

            const data = await reportingService.getChartData(req.body);
            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

    }
};