import { NextFunction, Request, Response } from 'express';
import { TmpService } from './tmp.service';

export class TmpController {

    static tmpService: TmpService;

    constructor() { TmpController.tmpService = new TmpService(); }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TmpController.tmpService.create(req.body)); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TmpController.tmpService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TmpController.tmpService.update({ _id: req.params.id }, req.body)); }
        catch (error) { next(error); }
    }

}