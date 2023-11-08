import { VisaTransactionsCeilingsService } from "./visa-transactions-ceilings.service";
import { NextFunction, Request, Response } from 'express';

export class VisaTransactionsCeilingsController {

    static visaTransactionsCeilingsService: VisaTransactionsCeilingsService;

    constructor() { VisaTransactionsCeilingsController.visaTransactionsCeilingsService = new VisaTransactionsCeilingsService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.update({ _id: req.params.id }, req.body)); }
        catch (error) { next(error); }
    }

}