import { NextFunction, Request, Response } from 'express';
import { ImportsService } from './imports.service';

export class ImportsController {

    static importsService: ImportsService;

    constructor() { ImportsController.importsService = new ImportsService(); }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ImportsController.importsService.create(req.body)); }
        catch (error) { next(error); }
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ImportsController.importsService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ImportsController.importsService.update({ _id: req.params.id }, { ...req.body })); }
        catch (error) { next(error); }
    }
    
    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ImportsController.importsService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

}