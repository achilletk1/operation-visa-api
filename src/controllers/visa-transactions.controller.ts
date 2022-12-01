import { visaTransactionsService } from '../services/visa-transactions.service';
import { commonService } from '../services/common.service';
import { Request, Response } from 'express';


export const visaTransactionsController = {

    init: (app: any): void => {

        app.get('/visa-transactions', async (req: Request, res: Response) => {
            const data = await visaTransactionsService.getVisaTransactions(req.query);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'unable to get visa transactions';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });
    }
};