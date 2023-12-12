
import { ValidationLevelSettingsRepository } from "./validation-level-settings.repository";
import { LevelValidation } from "./model/level-validation.model";
import { CrudService } from "common/base";

export class ValidationLevelSettingsService extends CrudService<LevelValidation> {

    static levelValidateRepository: ValidationLevelSettingsRepository;

    constructor() {
        ValidationLevelSettingsService.levelValidateRepository = new ValidationLevelSettingsRepository();
        super(ValidationLevelSettingsService.levelValidateRepository);
    }

}

