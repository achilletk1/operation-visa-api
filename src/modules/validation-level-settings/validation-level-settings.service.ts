
import { ValidationLevelSettingsRepository } from "./validation-level-settings.repository";
import { ValidationLevelSettingsController } from '../validation-level-settings';
import { LevelValidation } from "./model/level-validation.model";
import httpContext from 'express-http-context';
import { CrudService } from "common/base";

export class ValidationLevelSettingsService extends CrudService<LevelValidation> {

    static levelValidateRepository: ValidationLevelSettingsRepository;

    constructor() {
        ValidationLevelSettingsService.levelValidateRepository = new ValidationLevelSettingsRepository();
        super(ValidationLevelSettingsService.levelValidateRepository);
    }

    async getUserLevelById(id: string) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }

            return await ValidationLevelSettingsController.levelValidateService.findOne({ filter: { usersId: id }, projection: { level: 1, label: 1, description: 1 } });

        } catch (error) { throw error; }
    }

}

