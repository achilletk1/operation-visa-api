import { VisaTransactionsCeilingsController } from './visa-transactions-ceilings.controller';
import express from 'express';

const router = express.Router();
export const visaTransactionsCeilingsController = new VisaTransactionsCeilingsController();

router.get('/', visaTransactionsCeilingsController.findAll);

router.get('/operation', visaTransactionsCeilingsController.findAll);

router.get('/:id', visaTransactionsCeilingsController.findOneById);

router.put('/:id', visaTransactionsCeilingsController.updateById);

export const visaTransactionsCeilingsRoute = router;