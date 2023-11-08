import { VisaOperationsController } from './visa-operations.controller';
import express from 'express';

const router = express.Router();
export const visaOperationsController = new VisaOperationsController();

router.post('/', visaOperationsController.create);

router.get('/', visaOperationsController.findAll);

router.get('/all', visaOperationsController.findAll);

router.get('/:id', visaOperationsController.findOneById);

router.put('/:id', visaOperationsController.updateById);

export const visaOperationsRoute = router;