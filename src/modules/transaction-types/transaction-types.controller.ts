import { transactionTypeService } from "./transaction-types.service";
import { NextFunction, Request, Response } from 'express';

export class TransactionTypesController {

    static transactiontypesService: transactionTypeService;

    constructor() { TransactionTypesController.transactiontypesService = new transactionTypeService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransactionTypesController.transactiontypesService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransactionTypesController.transactiontypesService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async insertVoucher(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransactionTypesController.transactiontypesService.insertTransaction(req.body)); }
        catch (error) { next(error); }
    }

    async updateVoucherById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransactionTypesController.transactiontypesService.updateTransactionById(req.params.id as string, req.body)); }
        catch (error) { next(error); }
    }

    async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransactionTypesController.transactiontypesService.deleteOne({ _id: req.params.id })); }
        catch (error) { next(error); }
    }

}