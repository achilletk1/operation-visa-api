import { TransactionTypesController } from './transaction-types.controller';
import express from 'express';

const router = express.Router();
export const transactionTypesController = new TransactionTypesController();

router.post('/', transactionTypesController.insertVoucher);

router.get('/', transactionTypesController.findAll);

router.get('/:id', transactionTypesController.findOneById);

router.put('/:id', transactionTypesController.updateVoucherById);

router.delete('/:id', transactionTypesController.deleteById);

export const transactionTypesRoute = router;