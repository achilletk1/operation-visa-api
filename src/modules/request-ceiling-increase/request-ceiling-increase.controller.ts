import { RequestCeilingIncreaseService } from "./request-ceiling-increase.service";
import { NextFunction, Request, Response } from 'express';
import { RequestCeilingIncrease } from './model';

export class RequestCeilingIncreaseController {

    static requestCeilingIncreaseService: RequestCeilingIncreaseService;

    constructor() { RequestCeilingIncreaseController.requestCeilingIncreaseService = new RequestCeilingIncreaseService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await RequestCeilingIncreaseController.requestCeilingIncreaseService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await RequestCeilingIncreaseController.requestCeilingIncreaseService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await RequestCeilingIncreaseController.requestCeilingIncreaseService.update({ _id: req.params.id }, req.body)); }
        catch (error) { next(error); }
    }

    async getRequestCeillingIncrease(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await RequestCeilingIncreaseController.requestCeilingIncreaseService.getRequestCeilingIncrease(req.query as any)); }
        catch (error) { next(error); }
    }

    async insertRequestCeilling(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await RequestCeilingIncreaseController.requestCeilingIncreaseService.insertRequestCeiling(req.body as RequestCeilingIncrease)); }
        catch (error) { next(error); }
    }

    async requestIncrease(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await RequestCeilingIncreaseController.requestCeilingIncreaseService.requestIncrease(req.params.id, req.body)); }
        catch (error) { next(error); }
    }

    async assignRequestCeiling(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await RequestCeilingIncreaseController.requestCeilingIncreaseService.assignRequestCeiling(req.params.id, req.body)); }
        catch (error) { next(error); }
    }

}