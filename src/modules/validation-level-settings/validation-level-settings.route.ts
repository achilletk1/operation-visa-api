import { ValidationLevelSettingsController } from './validation-level-settings.controller';
import express from 'express';

const router = express.Router();
export const levelValidateService = new ValidationLevelSettingsController();

router.post('/', levelValidateService.insertValidationLevelSettings);

router.post('/id', levelValidateService.insertNewUserIdInValidationLevel);

router.put('/:id', levelValidateService.updateValidationLevelSettingsById);

router.get('/', levelValidateService.getValidationLevelSettings);

router.get('/level', levelValidateService.getOnlyValidationLevelSettings);

router.get('/user-level-by-id/:id', levelValidateService.getUserLevelById);

export const validationLevelSettingsRoute = router;
