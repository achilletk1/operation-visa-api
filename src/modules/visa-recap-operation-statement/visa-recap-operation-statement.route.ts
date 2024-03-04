
import express from 'express';
import { VisaRecapOperationsController } from './visa-recap-operation-statement.controller';

const router = express.Router();
export const visaRecapOperationController = new VisaRecapOperationsController();

router.get('/', visaRecapOperationController.findAll);

router.get('/export-visa-recap-ope/:code', visaRecapOperationController.getExportRecapOperationXls);

router.get('/get-visa-recap-link', visaRecapOperationController.getExportXlsLink);

export const visaRecapOperationRoute = router;