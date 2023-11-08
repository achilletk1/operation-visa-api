import { VariablesService } from './variables/variables.service';
import { NextFunction, Request, Response } from 'express';
import { TemplatesService } from "./templates.service";

export class TemplatesController {

    static templatesService: TemplatesService;
    static variablesService: VariablesService;

    constructor() {
        TemplatesController.templatesService = new TemplatesService();
        TemplatesController.variablesService = new VariablesService();
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TemplatesController.templatesService.create(req.body)); }
        catch (error) { next(error); }
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TemplatesController.templatesService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TemplatesController.templatesService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async updateTemplateById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await TemplatesController.templatesService.updateTemplateById(req.params.id as string, req.body)); }
        catch (error) { next(error); }
    }

}