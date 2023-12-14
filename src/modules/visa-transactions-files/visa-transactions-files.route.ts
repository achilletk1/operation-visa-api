import { VisaTransactionsFilesController } from './visa-transactions-files.controller';
import express from 'express';

const router = express.Router();
export const visaTransactionsFilesController = new VisaTransactionsFilesController();

router.get('/', visaTransactionsFilesController.findAll);

router.get('/labels', visaTransactionsFilesController.getVisaTransationsFilesLabels);

router.get('/:id', visaTransactionsFilesController.findOneById);

export const visaTransactionsFilesRoute = router;