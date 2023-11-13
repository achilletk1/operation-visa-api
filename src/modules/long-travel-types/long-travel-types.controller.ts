import { LongTravelTypesService } from "./long-travel-types.service";
import { NextFunction, Request, Response } from 'express';
import { LongTravelType } from "./model";

export class LongTravelTypesController {

    static longTravelTypesService: LongTravelTypesService;

    constructor() { LongTravelTypesController.longTravelTypesService = new LongTravelTypesService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await LongTravelTypesController.longTravelTypesService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await LongTravelTypesController.longTravelTypesService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await LongTravelTypesController.longTravelTypesService.update({ _id: req.params.id }, req.body)); }
        catch (error) { next(error); }
    }

    async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await LongTravelTypesController.longTravelTypesService.deleteOne({ _id: req.params.id })); }
        catch (error) { next(error); }
    }

    async insertLongTravelTypes(req: Request, res: Response, next: NextFunction) {
        try { res.send(await LongTravelTypesController.longTravelTypesService.insertLongTravelTypes(req.body as LongTravelType)); }
        catch (error) { next(error); }
    }

}