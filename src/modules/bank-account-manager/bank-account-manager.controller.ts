import { NextFunction, Request, Response } from 'express';
import { BankAccountManagerService } from "./bank-account-manager.service";

export class BankAccountManagerController {

    static bankAccountManagerService: BankAccountManagerService;

    constructor() { BankAccountManagerController.bankAccountManagerService = new BankAccountManagerService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await BankAccountManagerController.bankAccountManagerService.findAll({ filter: req.query, projection: { password: 0, otp: 0 } })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await BankAccountManagerController.bankAccountManagerService.findOne({ filter: { _id: req.params.id }, projection: { password: 0, otp: 0 } })); }
        catch (error) { next(error); }
    }

}
