import { VisaTransactionsService } from "./visa-transactions.service";
import { NextFunction, Request, Response } from 'express';

export class VisaTransactionsController {

    static visaTransactionsService: VisaTransactionsService;

    constructor() { VisaTransactionsController.visaTransactionsService = new VisaTransactionsService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VisaTransactionsController.visaTransactionsService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

}