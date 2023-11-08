
import { ExportController } from './export.controller';
import express from 'express';

const router = express.Router();
export const exportController = new ExportController();

router.post('/attachment/view', exportController.generateExportVisaAttachmentView);

router.post('/visa-transactions/', exportController.generateExportVisaTransactionLinks);

router.post('/visa-transactions/:code', exportController.generateExportVisaTransactionData);

router.post('/attachment/', exportController.generateExportAttachmentLinks);

router.post('/attachment/:code', exportController.generateExportVisaAttachmentData);

router.post('/online-payment/', exportController.generateOnlinePaymentExportLinks);

router.post('/online-payment/:code', exportController.generateOnlinePaymentExporData);

router.post('/payment-operations/:id', exportController.generateOnlinePaymentOperationsExportLinks);

router.post('/payment-operations/:code', exportController.generateOnlinePaymenOperationstExporData);

router.post('/ceilling/:id', exportController.generateTravelsCeillingExportLinks);

router.post('/ceilling/:code', exportController.generateTravelsCeillingExporData);

router.get('/notifications-generate/:id', exportController.generateNotificationExportLinks);

router.get('/notifications-generate/:id/:code', exportController.generateNotificationExportData);

router.get('/travels', exportController.generateTravelsExportLinks);

router.get('/travels/:code', exportController.generateTravelsExporData);

router.get('/visa-transactions-files/:id', exportController.generateVisaTransactionsFilesExportLinks);

router.get('/visa-transactions-files/:id/:code', exportController.generateVisaTransactionsFilesExporData);

router.get('/declaration/:type/:id', exportController.generateDeclarationFolderExportLinks);

router.get('/declaration/:code', exportController.generateDeclarationFolderExporData);

export const exportRoute = router;