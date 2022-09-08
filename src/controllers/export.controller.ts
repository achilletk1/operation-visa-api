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

    }
};