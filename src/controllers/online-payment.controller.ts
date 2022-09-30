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

            if (data instanceof Error) {
                const message = 'unable to post online payment Statement';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.status(200).json(data);
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

        app.put('/online-payments/update/:id', async (req: Request, res: Response) => {
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


        app.put('/online-payments/:id/status', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await onlinePaymentsService.updateAttachmentStatus(id, req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = 'forbidden operation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'update travel failed';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json({ message: 'travel data updated succesfully.' });
        });

        app.get('/online-payments/:id/attachements/export/:code', async (req: Request, res: Response) => {
            const id = req.params.id;
            const code = req.params.code;

            const data = await onlinePaymentsService.generateExportData(id, code);

            if (data instanceof Error) {
                const message = 'unable to export file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename= ${data.fileName}`);
            return res.send(data.fileContent);
        });

        app.post('/online-payments/:id/attachements/export', async (req: Request, res: Response) => {

            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }

            const data = await onlinePaymentsService.generateExportLinks(req.params.id, req.body);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });


        app.post('/online-payments/:id/attachements/view', async (req: Request, res: Response) => {

            const data = await onlinePaymentsService.generateExportView(req.params.id, req.body);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        app.put('/travels/:id/attachements/insert', async (req: Request, res: Response) => {
            const { id } = req.params;

            const data = await onlinePaymentsService.postAttachment(id, req.query, req.body);

            if (data instanceof Error && data.message === 'Forbidden') {
                const message = 'forbidden operation';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(401).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'update travel failed';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json({ message: 'travel data updated succesfully.' });
        });
    }
};