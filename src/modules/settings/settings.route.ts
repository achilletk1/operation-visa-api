import { SettingsController } from './settings.controller';
import express from 'express';

const router = express.Router();
export const settingsController = new SettingsController();

router.get('/', settingsController.getSettings);

router.get('/:key', settingsController.findOneByKey);

router.put('/:id', settingsController.updateSettingById);

export const settingsRoute = router;