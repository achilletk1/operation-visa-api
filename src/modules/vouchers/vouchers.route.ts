import { VouchersController } from './vouchers.controller';
import express from 'express';

const router = express.Router();
export const vouchersController = new VouchersController();

router.post('/', vouchersController.insertVoucher);

router.get('/', vouchersController.findAll);

router.get('/all', vouchersController.findAll);

router.get('/:id', vouchersController.findOneById);

router.put('/:id', vouchersController.updateVoucherById);

export const vouchersRoute = router;