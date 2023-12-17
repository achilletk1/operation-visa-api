import { VisaTransactionsFilesController } from './visa-transactions-files.controller';
import express from 'express';

const router = express.Router();
export const visaTransactionsFilesController = new VisaTransactionsFilesController();

router.get('/', visaTransactionsFilesController.findAll);

router.get('/labels', visaTransactionsFilesController.getVisaTransationsFilesLabels);

router.get('/import/array/:id', visaTransactionsFilesController.getTransactionFilesDataArray);

router.get('/:id', visaTransactionsFilesController.findOneById);

router.post('/import/verify', visaTransactionsFilesController.verifyTransactionFiles);

router.put('/import/confirm/:id', visaTransactionsFilesController.confirmTransactionFiles);

router.delete('/import/abort/:id', visaTransactionsFilesController.abortTransactionFiles);

export const visaTransactionsFilesRoute = router;