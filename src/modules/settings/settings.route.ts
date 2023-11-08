import { SettingsController } from './settings.controller';
import express from 'express';

const router = express.Router();
export const settingsController = new SettingsController();

// router.post('/', settingsController.create);

// router.get('/', settingsController.findAll);

// router.get('/all', settingsController.findAll);

router.get('/:key', settingsController.findOneByKey);

// router.put('/:key', settingsController.updateByKey);

router.put('/max_size_file_upload', settingsController.getMaxFileSizeUpload);

router.put('/:id', settingsController.updateSettingById);

export const settingsRoute = router;