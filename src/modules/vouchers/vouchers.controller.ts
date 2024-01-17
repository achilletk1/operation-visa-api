import { VouchersService } from "./vouchers.service";
import { NextFunction, Request, Response } from 'express';

export class VouchersController {

    static vouchersService: VouchersService;

    constructor() { VouchersController.vouchersService = new VouchersService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VouchersController.vouchersService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VouchersController.vouchersService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async insertVoucher(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VouchersController.vouchersService.insertVoucher(req.body)); }
        catch (error) { next(error); }
    }

    async updateVoucherById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VouchersController.vouchersService.updateVoucherById(req.params.id, req.body)); }
        catch (error) { next(error); }
    }

    async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await VouchersController.vouchersService.deleteOne({ _id: req.params.id })); }
        catch (error) { next(error); }
    }

}