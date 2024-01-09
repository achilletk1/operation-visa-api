import { OnlinePaymentController } from './online-payment.controller';
import express from 'express';

const router = express.Router();
export const onlinePaymentController = new OnlinePaymentController();

// router.post('/', onlinePaymentController.create);

// router.put('/:id', onlinePaymentController.updateById);

router.get('/', onlinePaymentController.getOnlinePaymentsBy);

router.get('/all', onlinePaymentController.getOnlinePaymentsBy);

router.put('/update/:id', onlinePaymentController.updateOnlinePaymentsById);

router.get('/validators/:id', onlinePaymentController.getValidationsOnlinePayment);

router.get('/labels', onlinePaymentController.getOnlinePaymentLabels);

router.put('/statement/status/:id', onlinePaymentController.updateStatementStatusById);

router.post('/:id', onlinePaymentController.insertOnlinePaymentStatement);

router.get('/:id', onlinePaymentController.findOneById);

export const onlinePaymentRoute = router;