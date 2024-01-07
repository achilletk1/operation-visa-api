import { NextFunction, Request, Response } from 'express';
import { ValidationLevelSettingsService } from "./validation-level-settings.service";

export class ValidationLevelSettingsController {

    static levelValidateService: ValidationLevelSettingsService;

    constructor() { ValidationLevelSettingsController.levelValidateService = new ValidationLevelSettingsService(); }

    async insertValidationLevelSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationLevelSettingsController.levelValidateService.create(req.body)); }
        catch (error) { next(error); }
    }

    async insertNewUserIdInValidationLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationLevelSettingsController.levelValidateService.insertNewUserIdInValidationLevel(req.body)); }
        catch (error) { next(error); }
    }

    async getValidationLevelSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationLevelSettingsController.levelValidateService.findAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async getOnlyValidationLevelSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationLevelSettingsController.levelValidateService.findAll({ filter: req.query, projection: { usersId: 0, created_at: 0, enabled: 0 } })); }
        catch (error) { next(error); }
    }

    async getUserLevelById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationLevelSettingsController.levelValidateService.getUserLevelById(req.params.id)); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationLevelSettingsController.levelValidateService.findOne({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async updateValidationLevelSettingsById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationLevelSettingsController.levelValidateService.update({ _id: req.params.id }, req.body)); }
        catch (error) { next(error); }
    }

}
