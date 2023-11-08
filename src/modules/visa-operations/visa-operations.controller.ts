import { VisaOperationsService } from "./visa-operations.service";
import { VisaTransactionsTmpService } from "./visa-transactions-tmp/visa-transactions-tmp.service";
import { NextFunction, Request, Response } from 'express';


export class VisaOperationsController {

    static visaOperationsService: VisaOperationsService;
    static visaTransactionsTmpService: VisaTransactionsTmpService;

    constructor() {
        VisaOperationsController.visaOperationsService = new VisaOperationsService();
        VisaOperationsController.visaTransactionsTmpService = new VisaTransactionsTmpService();
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaOperationsController.visaOperationsService.create(req.body)); }
        catch (error) { next(error); }
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaOperationsController.visaOperationsService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaOperationsController.visaOperationsService.findOne({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaOperationsController.visaOperationsService.findOne({ filter: { _id: req.query.id } })); }
        catch (error) { next(error); }
    }

    async count(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaOperationsController.visaOperationsService.count(req.query)); }
        catch (error) { next(error); }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaOperationsController.visaOperationsService.update(req.query, req.body)); }
        catch (error) { next(error); }
    }

    async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaOperationsController.visaOperationsService.update({ _id: req.query.id }, req.body)); }
        catch (error) { next(error); }
    }

}