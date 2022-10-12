import { commonService } from '../services/common.service';
import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';


export const notificationsController = {
    init: (app: any): void => {
        app.get('/notifications', async (req: Request, res: Response) => {
            const data = await notificationService.getNotifications(req.query);

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

        app.get('/visa-operations/not-customer/notifications', async (req: Request, res: Response) => {
            const data = await notificationService.getNotifications(req.query);

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