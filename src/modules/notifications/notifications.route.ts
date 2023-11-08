import { NotificationsController } from './notifications.controller';
import express from 'express';

const router = express.Router();
export const notificationsController = new NotificationsController();

router.get('/', notificationsController.findAll);

router.put('/not-customer', notificationsController.findAll);

router.post('/mails/preview', notificationsController.generateExportView);

export const notificationsRoute = router;