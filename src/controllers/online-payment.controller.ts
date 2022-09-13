import { commonService } from '../services/common.service';
import { Request, Response } from 'express';
import { onlinePaymentsService } from '../services/online-payment.service';


export const onlinePaymentsController = {

    init: (app: any): void => {
        app.put('/online-payments/:id', async (req: Request, res: Response) => {

            const data = await onlinePaymentsService.insertOnlinePaymentStatement(req.params.id, req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = `Vous n'êtes pas autorisé a effectuer cette opération`;
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }
            res.status(200).json({ message: 'New online payment inserted.' });
        });


        app.get('/online-payments', async (req: Request, res: Response) => {
            const data = await onlinePaymentsService.getOnlinePayments(req.query);

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


        app.get('/online-payments/all', async (req: Request, res: Response) => {
            const data = await onlinePaymentsService.getOnlinePaymentsBy(req.query);

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

        app.get('/online-payments/:id', async (req: Request, res: Response) => {
            const data = await onlinePaymentsService.getOnlinePaymentById(req.params.id);


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

        app.put('/online-payments/:id', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await onlinePaymentsService.updateOnlinePaymentsById(id, req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = 'forbidden operation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'update online payment failed';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json({ message: 'online payment data updated succesfully.' });
        });
    }
};