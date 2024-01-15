import { NextFunction, Request, Response } from 'express';
import { CbsService } from "./cbs.service";

export class CbsController {

    static cbsService: CbsService;

    constructor() { CbsController.cbsService = new CbsService(); }

    async getUserDataByCode(req: Request, res: Response, next: NextFunction) {
        try { res.send(await CbsController.cbsService.getUserDataByCode(req.params?.cli, req.query?.scope as any)); }
        catch (error) { next(error); }
    }

    async getUserCbsDatasByNcp(req: Request, res: Response, next: NextFunction) {
        try { res.send(await CbsController.cbsService.getUserCbsDatasByNcp(req.params?.ncp, req.query?.age as any, req.query?.clc as any)); }
        catch (error) { next(error); }
    }
    
    async getUserCbsAccountsDatas(req: Request, res: Response, next: NextFunction) {
        // if (!code) { return res.status(403).json({ message: 'no code provided' }); }
        try { res.send(await CbsController.cbsService.getUserCbsAccountsDatas(req.body)); }
        catch (error) { next(error); }
    }

    async getClientCardsByCli(req: Request, res: Response, next: NextFunction) {
        try { res.send(await CbsController.cbsService.getClientCardsByCli(req.params?.cli)); }
        catch (error) { next(error); }
    }

    async getProductData(req: Request, res: Response, next: NextFunction) {
        try { res.send(await CbsController.cbsService.getProductData(req.params?.code)); }
        catch (error) { next(error); }
    }

}