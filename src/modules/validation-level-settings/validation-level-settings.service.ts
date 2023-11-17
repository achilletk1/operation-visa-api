
import { ValidationLevelSettingsRepository } from "./validation-level-settings.repository";
import { ValidationLevelSettingsController } from './validation-level-settings.controller';
import { CrudService } from "common/base";
import { LevelValidation } from "./model/level-validation.model";

export class ValidationLevelSettingsService extends CrudService<LevelValidation> {

    static levelValidateRepository: ValidationLevelSettingsRepository;

    constructor() {
        ValidationLevelSettingsService.levelValidateRepository = new ValidationLevelSettingsRepository();
        super(ValidationLevelSettingsService.levelValidateRepository);
    }
    async getValidationLevelSettings(filters: any) {
        // this.formatUserFilters(filters)
        try {
            return await ValidationLevelSettingsController.levelValidateService.findAll(filters);
        } catch (error) { throw error; }
    }

    async insertValidationLevelSettings(level: LevelValidation): Promise<any> {
        try {
            const insertedId = await ValidationLevelSettingsController.levelValidateService.create(level);
            return insertedId;

        } catch (error) { throw error; }
    }

    async updateValidationLevelSettingsById(id: string, level: any) {
        try {
            // const authUser = httpContext.get('user');
            // const adminAuth = authUser?.category >= 600 && authUser?.category < 700;
            return await ValidationLevelSettingsController.levelValidateService.update({ _id: id }, level);
        } catch (error) { throw error; }
    }

    // private formatUserFilters(fields: any) {
    //     let { offset, limit } = fields;
    //     if (![typeof offset, typeof limit].includes('number')) { offset = undefined, limit = undefined; }
    
    //     delete fields.offset;
    //     delete fields.limit;
    // };

}

