import { TemporaryFilesService } from "./temporary-files.service";
import { NextFunction, Request, Response } from 'express';
import { TemporaryFile } from "./model";

export class TemporaryFilesController {

    static temporaryFilesService: TemporaryFilesService;

    constructor() { TemporaryFilesController.temporaryFilesService = new TemporaryFilesService(); }

    async insertTemporaryFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TemporaryFilesController.temporaryFilesService.insertTemporaryFile(req.body as TemporaryFile)); }
        catch (error) { next(error); }
    }

    async updateTemporaryFileById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TemporaryFilesController.temporaryFilesService.updateTemporaryFileById(req.params.id as string, req.body as Partial<TemporaryFile>)); }
        catch (error) { next(error); }
    }

}