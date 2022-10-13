import { Request, Response } from 'express';
import { exportsService } from '../services/exports.service';
import { commonService } from '../services/common.service'

export const NotificationExportsController = {
    init: (app: any): void => {

        app.get('/notification-generate/:id/export/:code', async (req, res) => {
            const id = req.params.id;
            const code = req.params.code;
            const data = await exportsService.generateNotificationExportData(id, code);

            if (data instanceof Error) {
                const message = 'unable to get notifications';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            const fileExtension = data.contentType === 'application/pdf' ? 'pdf' : 'xlsx';

            res.setHeader('Content-Type', data.contentType);
            res.setHeader('Content-Disposition', `attachment; filename= export_${new Date().getTime()}.${fileExtension}`);
            return res.send(data.fileContent);
        });
        
        app.get('/notification-generate/:id/export', async (req: Request, res: Response) => {
            if (req.query.action !== 'generate_link') {
                const message = 'no action provided.';
                const errResp = commonService.generateErrResponse(message, new Error('NoActionProvided'));
                return res.status(400).json(errResp);
            }

            const data = await exportsService.generateNotificationExportLinks(req.params.id,  req.query);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

    }
};