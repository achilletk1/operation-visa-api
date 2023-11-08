import { RequestCeilingIncreaseController } from './request-ceiling-increase.controller';
import express from 'express';

const router = express.Router();
export const requestCeilingIncreaseController = new RequestCeilingIncreaseController();

// router.post('/', requestCeilingIncreaseController.create);

// router.get('/', requestCeilingIncreaseController.findAll);

router.get('/all', requestCeilingIncreaseController.findAll);

router.get('/:id', requestCeilingIncreaseController.findOneById);

router.put('/:id', requestCeilingIncreaseController.updateById);

router.put('/', requestCeilingIncreaseController.getRequestCeillingIncrease);

router.put('/', requestCeilingIncreaseController.insertRequestCeilling);

router.put('/validate-request/:id', requestCeilingIncreaseController.requestIncrease);

router.put('/validate-request/:id/assign', requestCeilingIncreaseController.assignRequestCeiling);

export const requestCeilingIncreaseRoute = router;