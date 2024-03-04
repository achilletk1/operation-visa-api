import { BankAccountManagerController } from './bank-account-manager.controller';
import express from 'express';

const router = express.Router();
export const bankAccountManagerController = new BankAccountManagerController();

router.get('/', bankAccountManagerController.findAll);

router.get('/:id', bankAccountManagerController.findOneById);

export const bankAccountManagerRoute = router;
