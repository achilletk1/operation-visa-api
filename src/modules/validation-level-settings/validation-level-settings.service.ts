
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

            const validationLevel = await ValidationLevelSettingsController.levelValidateService.baseRepository.findOne({ filter: { usersId: id }, projection: { level: 1, label: 1, description: 1 } });
            if (!validationLevel) { throw new Error('UserLevelNotFound'); }
            return validationLevel;
        } catch (error) { throw error; }
    }

    async insertNewUserIdInValidationLevel(data: { _id: string; userId: string; }) {
        try {
            const validationLevel = await ValidationLevelSettingsController.levelValidateService.findOne({ filter: { _id: data?._id }, projection: { usersId: 1 } });
            validationLevel.usersId?.push(data?.userId);
            await ValidationLevelSettingsController.levelValidateService.update({ _id: data?._id }, { usersId: validationLevel.usersId });
        } catch (error) { throw error; }
    }

}

