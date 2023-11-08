import { NextFunction, Request, Response } from 'express';
import { LettersService } from "./letters.service";
import { Letter } from './model';

export class LettersController {

    static lettersService: LettersService;

    constructor() { LettersController.lettersService = new LettersService(); }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await LettersController.lettersService.create(req.body)); }
        catch (error) { next(error); }
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await LettersController.lettersService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await LettersController.lettersService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await LettersController.lettersService.update({ _id: req.params.id }, req.body)); }
        catch (error) { next(error); }
    }

    async getLettersVariables(req: Request, res: Response, next: NextFunction) {
        try { res.send(await LettersController.lettersService.getLettersVariables()); }
        catch (error) { next(error); }
    }

    async generateExportView(req: Request, res: Response, next: NextFunction) {
        try { res.send(await LettersController.lettersService.generateExportView(req.body as Letter)); }
        catch (error) { next(error); }
    }

}