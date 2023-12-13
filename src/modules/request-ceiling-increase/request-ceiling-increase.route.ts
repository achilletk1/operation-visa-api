import { RequestCeilingIncreaseController } from './request-ceiling-increase.controller';
import express from 'express';

const router = express.Router();
export const requestCeilingIncreaseController = new RequestCeilingIncreaseController();

// router.post('/', requestCeilingIncreaseController.create);

router.get('/', requestCeilingIncreaseController.findAll);

router.get('/all', requestCeilingIncreaseController.findAll);

router.put('/', requestCeilingIncreaseController.getRequestCeillingIncrease);

router.post('/', requestCeilingIncreaseController.insertRequestCeilling);

router.put('/validate-request/:id', requestCeilingIncreaseController.requestIncrease);

router.put('/validate-request/:id/assign', requestCeilingIncreaseController.assignRequestCeiling);

router.get('/:id', requestCeilingIncreaseController.findOneById);

router.put('/:id', requestCeilingIncreaseController.updateById);

export const requestCeilingIncreaseRoute = router;