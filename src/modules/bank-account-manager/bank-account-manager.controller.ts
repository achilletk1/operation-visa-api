import { BankAccountManagerService } from "./bank-account-manager.service";
import { NextFunction, Request, Response } from 'express';

export class BankAccountManagerController {

    static bankAccountManagerService: BankAccountManagerService;

    constructor() { BankAccountManagerController.bankAccountManagerService = new BankAccountManagerService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await BankAccountManagerController.bankAccountManagerService.findAll({ filter: req.query})); }
        catch (error) { next(error); } 
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await BankAccountManagerController.bankAccountManagerService.findOne({ filter: { _id: req.params.id }, projection: { password: 0, otp: 0 } })); }
        catch (error) { next(error); }
    }

    async getManagerAccountLabels(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await BankAccountManagerController.bankAccountManagerService.getManagerAccounts(req.query, { FULLNAME: 1, CODE_GES: 1, AGE_UTI: 1, EMAIL: 1, TEL: 1 })); }
        catch (error) { next(error); }
    }

    async updateManagerAccoundById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await BankAccountManagerController.bankAccountManagerService.updateManagerAccount(req.body)); }
        catch (error) { next(error); }
    }

}
