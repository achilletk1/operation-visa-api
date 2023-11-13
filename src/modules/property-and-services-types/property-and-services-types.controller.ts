import { PropertyAndServicesTypesService } from './property-and-services-types.service';
import { NextFunction, Request, Response } from 'express';
import { PropertyAndServicesType } from './model';

export class PropertyAndServicesTypesController {

    static propertyAndServicesTypesService: PropertyAndServicesTypesService;

    constructor() { PropertyAndServicesTypesController.propertyAndServicesTypesService = new PropertyAndServicesTypesService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await PropertyAndServicesTypesController.propertyAndServicesTypesService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await PropertyAndServicesTypesController.propertyAndServicesTypesService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await PropertyAndServicesTypesController.propertyAndServicesTypesService.deleteOne({  _id: req.params.id })); }
        catch (error) { next(error); }
    }

    async insertPropertyAndServicesTypes(req: Request, res: Response, next: NextFunction) {
        try { res.send(await PropertyAndServicesTypesController.propertyAndServicesTypesService.insertPropertyAndServicesTypes(req.body as PropertyAndServicesType)); }
        catch (error) { next(error); }
    }

    async updatePropertyAndServicesTypesById(req: Request, res: Response, next: NextFunction) {
        try { res.send(await PropertyAndServicesTypesController.propertyAndServicesTypesService.updatePropertyAndServicesTypesById(req.params.id as string, req.body as PropertyAndServicesType)); }
        catch (error) { next(error); }
    }

}