import { visaTransactionsCeilingsService } from '../services/visa-transactions-ceilings.service';
import { commonService } from '../services/common.service';
import { Request, Response } from 'express';

export const visaTransactionsCeilingsController = {

    init: (app: any): void => {

        app.get('/visa-transactions-cellings/', async (req: Request, res: Response) => {
            const data = await visaTransactionsCeilingsService.getVisaTransactionsCeillings(req.query);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/visa-transactions-cellings/operation', async (req: Request, res: Response) => {
            const data = await visaTransactionsCeilingsService.getVisaTransactionsCeillingsBy(req.params.id);


            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });
        app.get('/visa-transactions-cellings/:id', async (req: Request, res: Response) => {
            const data = await visaTransactionsCeilingsService.getVisaTransactionsCeillingsById(req.params.id);


            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });
    }
};
