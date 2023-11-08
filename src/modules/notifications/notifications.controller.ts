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

}