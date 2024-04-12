import { SupplierService } from "./supplier.service";
import { NextFunction, Request, Response } from 'express';

export class SupplierController {

    static supplierService: SupplierService;

    constructor() { SupplierController.supplierService = new SupplierService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SupplierController.supplierService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SupplierController.supplierService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async insertSupplier(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SupplierController.supplierService.insertSupplier(req.body)); }
        catch (error) { next(error); }
    }

    async updateSupplierById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SupplierController.supplierService.updateSupplierById(req.params.id, req.body)); }
        catch (error) { next(error); }
    }

}