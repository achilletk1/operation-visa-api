import { NextFunction, Request, Response } from 'express';
import { CbsService } from "./cbs.service";

export class CbsController {

    static cbsService: CbsService;

    constructor() { CbsController.cbsService = new CbsService(); }

    async getUserDataByCode(req: Request, res: Response, next: NextFunction) {
        try { res.send(await CbsController.cbsService.getUserDataByCode(req.params?.cli)); }
        catch (error) { next(error); }
    }

    async getUserCbsDatasByNcp(req: Request, res: Response, next: NextFunction) {
        try { res.send(await CbsController.cbsService.getUserCbsDatasByNcp(req.params?.ncp, req.query?.age as any, req.query?.clc as any)); }
        catch (error) { next(error); }
    }

}