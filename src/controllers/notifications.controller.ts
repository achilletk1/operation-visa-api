import { commonService } from '../services/common.service';
import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';


export const notificationsController = {
    init: (app: any): void => {
        app.get('/notifications', async (req: Request, res: Response) => {
            const data = await notificationService.getNotifications(req.query);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'Forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'Unable to get transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/notification-generate/:id/export/:code', async (req, res) => {
            const id = req.params.id;
            const code = req.params.code;
            const data = await notificationService.generateNotificationExportData(id, code);

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

            const data = await notificationService.generateNotificationExportLinks(req.params.id, req.query);

            if (data instanceof Error) {
                const message = 'internal server error.';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            return res.status(200).json(data);
        });

        app.get('/visa-operations/not-customer/notifications', async (req: Request, res: Response) => {
            const data = await notificationService.getNotifications(req.query);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'U++nable to get transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/visa-operations/not-customer/notifications', async (req: Request, res: Response) => {
            const data = await notificationService.getNotifications(req.query);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'Unable to get transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/visa-operations/not-customer/notifications', async (req: Request, res: Response) => {
            const data = await notificationService.getNotifications(req.query);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'U++nable to get transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });

        app.get('/visa-operations/not-customer/notifications', async (req: Request, res: Response) => {
            const data = await notificationService.getNotifications(req.query);

            if (data instanceof Error && data.message === 'Forbbiden') {
                const message = 'forbbiden to get data';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(403).json(errResp);
            }

            if (data instanceof Error) {
                const message = 'U++nable to get transaction file';
                const errResp = commonService.generateErrResponse(message, data);
                return res.status(500).json(errResp);
            }

            res.status(200).json(data);
        });
    }
};