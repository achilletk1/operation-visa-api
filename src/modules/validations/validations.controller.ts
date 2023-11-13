import { ValidationsService } from "./validations.service";
import { NextFunction, Request, Response } from 'express';

export class ValidationsController {

    static validationsService: ValidationsService;

    constructor() { ValidationsController.validationsService = new ValidationsService(); }

    async getUserValidatorById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationsController.validationsService.getUserValidatorById(req.params?.userId as string)); }
        catch (error) { next(error); }
    }

    async getMaxValidationLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationsController.validationsService.getMaxValidationLevel()); }
        catch (error) { next(error); }
    }

    async getValidationOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationsController.validationsService.getValidationOtp(req.params.userId as string)); }
        catch (error) { next(error); }
    }

    async insertUserValidator(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationsController.validationsService.insertUserValidator(req.body)); }
        catch (error) { next(error); }
    }

    async insertValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await ValidationsController.validationsService.insertvalidation(req.params.id as string, req.body)); }
        catch (error) { next(error); }
    }

}