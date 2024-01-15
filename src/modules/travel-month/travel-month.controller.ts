import { TravelMonthService } from "./travel-month.service";
import { NextFunction, Request, Response } from 'express';

export class TravelMonthController {

    static travelMonthService: TravelMonthService;

    constructor() { TravelMonthController.travelMonthService = new TravelMonthService(); }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelMonthController.travelMonthService.create(req.body)); }
        catch (error) { next(error); }
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelMonthController.travelMonthService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelMonthController.travelMonthService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async getTravelMonths(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelMonthController.travelMonthService.getTravelMonths(req.query)); }
        catch (error) { next(error); }
    }

    async getValidationsTravelMonth(req: Request, res: Response, next: NextFunction) {
        try { res.send(await TravelMonthController.travelMonthService.getValidationsTravelMonth(req.params.id as string)); }
        catch (error) { next(error); }
    }

    async updateTravelMonthsById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelMonthController.travelMonthService.updateTravelMonthsById(req.params.id as string, req.body)); }
        catch (error) { next(error); }
    }

    async updateManyTravelMonths(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelMonthController.travelMonthService.updateManyTravelMonths(req.body)); }
        catch (error) { next(error); }
    }

    async updateTravelMonthExpendeDetailsStatusById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelMonthController.travelMonthService.updateTravelMonthExpendeDetailsStatusById(req.params.id as string, req.body)); }
        catch (error) { next(error); }
    }

}