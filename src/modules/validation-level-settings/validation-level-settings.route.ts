import { ValidationLevelSettingsController } from './validation-level-settings.controller';
import express from 'express';

const router = express.Router();
export const levelValidateService = new ValidationLevelSettingsController();

router.post('/', levelValidateService.insertValidationLevelSettings);

router.put('/:id', levelValidateService.updateValidationLevelSettingsById);

router.get('/', levelValidateService.getValidationLevelSettings);

export const validationLevelSettingsRoute = router;
