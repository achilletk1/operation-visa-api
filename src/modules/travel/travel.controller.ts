import { NextFunction, Request, Response } from 'express';
import { TravelService } from "./travel.service";
import { get } from "lodash";

export class TravelController {

    static travelService: TravelService;

    constructor() { TravelController.travelService = new TravelService(); }

    async insertTravel(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelController.travelService.insertTravel(req.body)); }
        catch (error) { next(error); }
    }

    async getTravels(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelController.travelService.getTravels({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async getTravelsAgencies(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelController.travelService.getTravelsAgencies({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelController.travelService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async updateTravelById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelController.travelService.updateTravelById(req.params.id, req.body)); }
        catch (error) { next(error); }
    }

    async updateTravelStepStatusById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelController.travelService.updateTravelStepStatusById(req.params.id, req.body)); }
        catch (error) { next(error); }
    }

    async getValidationsTravel(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelController.travelService.getValidationsTravel(req.params.id)); }
        catch (error) { next(error); }
    }

    async getTravelRangesTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelController.travelService.getTravelRangesTransactions(req.query)); }
        catch (error) { next(error); }
    }

    async getTravelsLabels(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelController.travelService.findAllAggregate([{ $match: { travelType: { $in: get(req.query, 'travelType') ? [+get(req.query, 'travelType', '')] : [100, 200] } } }, { $project: { _id: 0, clientCode: "$user.clientCode", fullName: "$user.fullName" } }])); }
        catch (error) { next(error); }
    }

    async generateQueryLink(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelController.travelService.generateQueryLink(req.params.id)); }
        catch (error) { next(error); }
    }


    async sendLinkNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TravelController.travelService.sendLinkNotification(req.body)); }
        catch (error) { next(error); }
    }
}