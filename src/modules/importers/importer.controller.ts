// import { ImporterService } from "./importer.service";
import { NextFunction, Request, Response } from 'express';
import { ImporterService } from './importer.service';

export class ImporterController {

    static importerService: ImporterService;

    constructor() { ImporterController.importerService = new ImporterService(); }

    async insertImporter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ImporterController.importerService.insertImporter(req.body)); }
        catch (error) { next(error); }
    }

    async getImporters(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ImporterController.importerService.getImporters({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async updateImporterById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ImporterController.importerService.updateImporterById(req.params.id, req.body)); }
        catch (error) { next(error); }
    }
    
    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ImporterController.importerService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async deleteImporterById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ImporterController.importerService.deleteOne({ _id: req.params.id })); }
        catch (error) { next(error); }
    }

}