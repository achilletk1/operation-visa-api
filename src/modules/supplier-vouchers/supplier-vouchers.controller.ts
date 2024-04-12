import { SupplierVouchersService } from "./supplier-vouchers.service";
import { NextFunction, Request, Response } from 'express';

export class SupplierVouchersController {

    static suppliervouchersService: SupplierVouchersService;

    constructor() { SupplierVouchersController.suppliervouchersService = new SupplierVouchersService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SupplierVouchersController.suppliervouchersService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SupplierVouchersController.suppliervouchersService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async insertSupplierVoucher(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SupplierVouchersController.suppliervouchersService.insertSupplierVoucher(req.body)); }
        catch (error) { next(error); }
    }

    async updateSupplierVoucherById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SupplierVouchersController.suppliervouchersService.updateSupplierVoucherById(req.params.id, req.body)); }
        catch (error) { next(error); }
    }

}