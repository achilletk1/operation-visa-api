import { NotificationsService } from './notifications.service';
import { NextFunction, Request, Response } from 'express';
import { QueueAfb160Service } from './queue-afb160';
import { TemplateForm } from 'modules/templates';

export class NotificationsController {

    static notificationsService: NotificationsService;
    static queueAfb160Service: QueueAfb160Service;

    constructor() {
        NotificationsController.notificationsService = new NotificationsService();
        NotificationsController.queueAfb160Service = new QueueAfb160Service();
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await NotificationsController.notificationsService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async generateExportView(req: Request, res: Response, next: NextFunction) {
        try { res.send(await NotificationsController.notificationsService.generateExportView(req.body as TemplateForm)); }
        catch (error) { next(error); }
    }

    async generateInstantNotificationView(req: Request, res: Response, next: NextFunction) {
        console.log("req.body " , req.body );
        try { res.send(await NotificationsController.notificationsService.generateInstantNotificationView(req.body as any)); }
        catch (error) { next(error); }
    }

    async saveNotification(req: Request, res: Response, next: NextFunction) {
        try { res.send(await NotificationsController.notificationsService.saveNotification(req.body as any)); }
        catch (error) { next(error); }
    }
}