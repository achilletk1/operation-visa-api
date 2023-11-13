
import { ExportController } from './export.controller';
import express from 'express';

const router = express.Router();
export const exportController = new ExportController();

router.get('/attachment/view', exportController.generateExportVisaAttachmentView);

router.post('/visa-transactions/', exportController.generateExportVisaTransactionLinks);

router.get('/visa-transactions/:code', exportController.generateExportVisaTransactionData);

router.post('/attachment/', exportController.generateExportAttachmentLinks);

router.get('/attachment/:code', exportController.generateExportVisaAttachmentData);

router.get('/online-payment/', exportController.generateOnlinePaymentExportLinks);

router.get('/online-payment/:code', exportController.generateOnlinePaymentExporData);

router.get('/payment-operations/:id', exportController.generateOnlinePaymentOperationsExportLinks);

router.get('/payment-operations-code/:code', exportController.generateOnlinePaymenOperationstExporData);

router.get('/ceilling/:id', exportController.generateTravelsCeillingExportLinks);

router.get('/ceilling-code/:code', exportController.generateTravelsCeillingExporData);

router.get('/notification-generate/:id', exportController.generateNotificationExportLinks);

router.get('/notification-generate/:id/:code', exportController.generateNotificationExportData);

router.get('/travels', exportController.generateTravelsExportLinks);

router.get('/travels/:code', exportController.generateTravelsExporData);

router.post('/visa-transactions-files/:id', exportController.generateVisaTransactionsFilesExportLinks);

router.get('/visa-transactions-files/:id/:code', exportController.generateVisaTransactionsFilesExporData);

router.post('/declaration/:type/:id', exportController.generateDeclarationFolderExportLinks);

router.get('/declaration/:code', exportController.generateDeclarationFolderExporData);

export const exportRoute = router;