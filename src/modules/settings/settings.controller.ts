import { NextFunction, Request, Response } from 'express';
import { SettingsService } from "./settings.service";
import { config } from "convict-config";

export class SettingsController {

    static settingsService: SettingsService;

    constructor() { SettingsController.settingsService = new SettingsService(); }

    async findOneByKey(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SettingsController.settingsService.findOne({ filter: { _id: req.params.key } })); }
        catch (error) { next(error); }
    }

    async updateSettingById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await SettingsController.settingsService.updateSettingById(req.params.id as string, req.body)); }
        catch (error) { next(error); }
    }

    async getMaxFileSizeUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.status(200).json(config.get("maxFileSizeUpload")); }
        catch (error) { next(error); }
    }

}