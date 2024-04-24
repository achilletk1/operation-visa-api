import { SupplierVouchersController } from './supplier-vouchers.controller';
import express from 'express';

const router = express.Router();
export const supplierVouchersController = new SupplierVouchersController();

router.post('/', supplierVouchersController.insertSupplierVoucher);

router.get('/', supplierVouchersController.findAll);

router.put('/:id', supplierVouchersController.updateSupplierVoucherById);

export const supplierVouchersRoute = router;