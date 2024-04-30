import { SensitivesNotificationsService } from './sensitives-notifications.service';
import { NextFunction, Request, Response } from 'express';

export class SensitivesNotificationsController {

    static sensitivesNotificationsService: SensitivesNotificationsService;

    constructor() {
        SensitivesNotificationsController.sensitivesNotificationsService = new SensitivesNotificationsService();
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SensitivesNotificationsController.sensitivesNotificationsService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }


    async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SensitivesNotificationsController.sensitivesNotificationsService.update({ _id: req.params.id }, req.body)); }
        catch (error) { next(error); }
    }

}