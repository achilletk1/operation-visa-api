import { SensitivesNotificationsController } from './sensitives-notifications.controller';
import express from 'express';

const router = express.Router();
export const sensitivesNotificationsController = new SensitivesNotificationsController();

router.get('/', sensitivesNotificationsController.findAll);

router.put('/:id', sensitivesNotificationsController.updateById);

export const sensitivesNotificationsRoute = router;