import { SupplierController } from './supplier.controller';
import express from 'express';

const router = express.Router();
export const supplierController = new SupplierController();

router.post('/', supplierController.insertSupplier);

router.get('/', supplierController.findAll);

router.get('/:id', supplierController.findOneById);

router.put('/:id', supplierController.updateSupplierById);

export const supplierRoute = router;