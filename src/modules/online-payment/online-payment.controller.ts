import { OnlinePaymentMonth, OnlinePaymentStatement } from './model';
import { OnlinePaymentService } from './online-payment.service';
import { NextFunction, Request, Response } from 'express';

export class OnlinePaymentController {

    static onlinePaymentService: OnlinePaymentService;

    constructor() { OnlinePaymentController.onlinePaymentService = new OnlinePaymentService(); }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await OnlinePaymentController.onlinePaymentService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async getOnlinePaymentsBy(req: Request, res: Response, next: NextFunction) {
        try { res.send(await OnlinePaymentController.onlinePaymentService.getOnlinePaymentsBy(req.query)); }
        catch (error) { next(error); }
    }

    async getValidationsOnlinePayment(req: Request, res: Response, next: NextFunction) {
        try { res.send(await OnlinePaymentController.onlinePaymentService.getValidationsOnlinePayment(req.params.id as string)); }
        catch (error) { next(error); }
    }

    async getOnlinePaymentLabels(req: Request, res: Response, next: NextFunction) {
        try { res.send(await OnlinePaymentController.onlinePaymentService.findAllAggregate([{ $project: { _id: 0, clientCode: "$user.clientCode", fullName: "$user.fullName" } }])); }
        catch (error) { next(error); }
    }

    async insertOnlinePaymentStatement(req: Request, res: Response, next: NextFunction) {
        try { res.send(await OnlinePaymentController.onlinePaymentService.insertOnlinePaymentStatement(req.params.id as string, req.body as OnlinePaymentStatement)); }
        catch (error) { next(error); }
    }

    async insertOnlinePayment(req: Request, res: Response, next: NextFunction) {
        try { res.send(await OnlinePaymentController.onlinePaymentService.insertOnlinePayment(req.body as OnlinePaymentMonth)); }
        catch (error) { next(error); }
    }

    async updateOnlinePaymentsById(req: Request, res: Response, next: NextFunction) {
        try { res.send(await OnlinePaymentController.onlinePaymentService.updateOnlinePaymentsById(req.params.id as string, req.body as OnlinePaymentMonth)); }
        catch (error) { next(error); }
    }

    async updateStatementStatusById(req: Request, res: Response, next: NextFunction) {
        try { res.send(await OnlinePaymentController.onlinePaymentService.updateStatementStatusById(req.params.id as string, req.body as any)); }
        catch (error) { next(error); }
    }

}