import { TransferDocumentaryController } from './transfer-documentary.controller';
import express from 'express';

const router = express.Router();
export const transferDocumentaryController = new TransferDocumentaryController();

router.post('/', transferDocumentaryController.insertOperation);

router.get('/', transferDocumentaryController.getOperations);

router.get('/agencies', transferDocumentaryController.getOperationsAgencies);

router.get('/labels', transferDocumentaryController.getOperationsLabels);

export const transferDocumentarRoute = router;