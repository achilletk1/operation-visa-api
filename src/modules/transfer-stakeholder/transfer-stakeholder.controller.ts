import { TransferStakeholderService } from "./transfer-stakeholder.service";
import { NextFunction, Request, Response } from 'express';

export class TransferStakeholderController {

    static transferStakeholderService: TransferStakeholderService;

    constructor() { TransferStakeholderController.transferStakeholderService = new TransferStakeholderService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransferStakeholderController.transferStakeholderService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransferStakeholderController.transferStakeholderService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async insertTransferStakeholder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransferStakeholderController.transferStakeholderService.insertTransferStakeholder(req.body)); }
        catch (error) { next(error); }
    }

    async updateTransferStakeholderById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransferStakeholderController.transferStakeholderService.updateTransferStakeholderById(req.params.id, req.body)); }
        catch (error) { next(error); }
    }

}