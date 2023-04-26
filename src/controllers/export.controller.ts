import { exportService } from './../services/export.service';

import { Request, Response } from 'express';
import { commonService } from '../services/common.service';

export const exportController = {
    init: (app: any): void => {

        app.get('/export/visa-transactions/:code', async (req: Request, res: Response) => {
            const code = req.params.code;

            const data = await exportService.generateExportVisaTransactionData(code);

            if (data instanceof Error) {
                const message = 'unable to export file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename= ${data.fileName}`);
            return res.send(data.fileContent);
        });

        app.post('/export/visa-transactions/', async (req: Request, res: Response) => {

            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }

            const data = await exportService.generateExportVisaTransactionLinks(req.body);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        app.get('/export/attachment/view', async (req: Request, res: Response) => {
            const data = await exportService.generateExportVisaAttachmentView(req.query);

            if (data instanceof Error) {
                const message = 'unable to export file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.status(200).json(data);

        });

        app.get('/export/attachment/:code', async (req: Request, res: Response) => {
            const code = req.params.code;

            const data = await exportService.generateExportVisaAttachmentData(code);

            if (data instanceof Error) {
                const message = 'unable to export file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename= ${data.fileName}`);
            return res.send(data.fileContent);
        });

        app.post('/export/attachement/', async (req: Request, res: Response) => {

            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }

            const data = await exportService.generateExportAttachmentLinks(req.body);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        app.get('/export/online-payment', async (req: Request, res: Response) => {

            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }

            const data = await exportService.generateOnlinePaymentExportLinks(req.body);
            
            if (data instanceof Error && data.message === 'OnlinePaymentNotFound') {
                const message = 'Aucune donnée trouvée pour cette transaction';
                const errResp = commonService.generateErrResponse(message, data, 'Aucune donnée');
                return res.status(404).json(errResp);
            }
            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        app.get('/export/online-payment/:code', async (req: Request, res: Response) => {
            const code = req.params.code;

            const data = await exportService.generateOnlinePaymentExporData(code);

            if (data instanceof Error) {
                const message = 'unable to export file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename=online-payment_${new Date().getTime()}.xlsx`);
            return res.send(data.fileContent);
        });

        app.get('/export/payment-operations/:id', async (req: Request, res: Response) => {

            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }

            const data = await exportService.generateOnlinePaymentOperationsExportLinks(req.params.id);

            if (data instanceof Error && data.message === 'MonthOnlineOperationsNotFound') {
                const message = 'Aucune donnée trouvée pour cette transaction';
                const errResp = commonService.generateErrResponse(message, data, 'Aucune donnée');
                return res.status(404).json(errResp);
            }
            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        app.get('/export/payment-operationsCode/:code', async (req: Request, res: Response) => {
            const code = req.params.code;

            const data = await exportService.generateOnlinePaymenOperationstExporData(code);

            if (data instanceof Error) {
                const message = 'unable to export file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename=payment-operations_${new Date().getTime()}.xlsx`);
            return res.send(data.fileContent);
        });

        app.get('/export/ceilling/:id', async (req: Request, res: Response) => {
            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }
            const data = await exportService.generateTravelsCeillingExportLinks(req.params.id);

            if (data instanceof Error && data.message === 'OnlineCeillingNotFound') {
                const message = 'Aucune donnée trouvée pour cette transaction';
                const errResp = commonService.generateErrResponse(message, data, 'Aucune donnée');
                return res.status(404).json(errResp);
            }
            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            return res.status(200).json(data);
        });

        app.get('/export/ceillingCode/:code', async (req: Request, res: Response) => {
            const code = req.params.code;

            const data = await exportService.generateTravelsCeillingExporData(code);

            if (data instanceof Error) {
                const message = 'unable to export file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }
            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename=ceilling_${new Date().getTime()}.xlsx`);
            return res.send(data.fileContent);
        });

    }
};