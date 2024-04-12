import { NextFunction, Request, Response } from 'express';
import { get } from "lodash";
import { TransferDocumentaryService } from './transfer-documentary.service';

export class TransferDocumentaryController {

    static transferDocumentaryService: TransferDocumentaryService;

    constructor() { TransferDocumentaryController.transferDocumentaryService = new TransferDocumentaryService(); }

    async insertOperation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransferDocumentaryController.transferDocumentaryService.insertOperation(req.body)); }
        catch (error) { next(error); }
    }

    async getOperationsAgencies(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransferDocumentaryController.transferDocumentaryService.getOperationsAgencies({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async getOperations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransferDocumentaryController.transferDocumentaryService.getOperations({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async getOperationsLabels(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TransferDocumentaryController.transferDocumentaryService.findAllAggregate([{ $match: { operationType: { $in: get(req.query, 'operationType') ? [+get(req.query, 'operationType', '')] : [100, 200] } } }, { $project: { _id: 0, clientCode: "$user.clientCode", fullName: "$user.fullName" } }])); }
        catch (error) { next(error); }
    }

}