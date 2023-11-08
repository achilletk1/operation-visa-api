import { VisaTransactionsController } from './visa-transactions.controller';
import express from 'express';

const router = express.Router();
export const visaTransactionsController = new VisaTransactionsController();

router.get('/', visaTransactionsController.findAll);

export const visaTransactionsRoute = router;