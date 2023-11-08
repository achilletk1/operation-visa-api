import { FilesService } from "./files.service";
import { NextFunction, Request, Response } from 'express';

export class FilesController {

    static filesService: FilesService;

    constructor() { FilesController.filesService = new FilesService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await FilesController.filesService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await FilesController.filesService.findOne({ filter: { _id: req.query.id } })); }
        catch (error) { next(error); }
    }

}
