import { NotificationsController } from './notifications.controller';
import express from 'express';

const router = express.Router();
export const notificationsController = new NotificationsController();

router.get('/', notificationsController.findAll);

router.put('/not-customer', notificationsController.findAll);

router.post('/mails/preview', notificationsController.generateExportView);

router.post('/mails/preview-instant-notification', notificationsController.generateInstantNotificationView);

router.post('/', notificationsController.sendAndInsertNotification);

export const notificationsRoute = router;