import { TravelMonthController } from './travel-month.controller';
import express from 'express';

const router = express.Router();
export const travelMonthController = new TravelMonthController();

router.post('/', travelMonthController.create);

router.get('/', travelMonthController.getTravelMonths);

router.get('/all', travelMonthController.getTravelMonths);

router.get('/:id', travelMonthController.findOneById);

router.put('/:id', travelMonthController.updateTravelMonthsById);

router.put('/', travelMonthController.updateManyTravelMonths);

router.put('/:id/expense-details/status', travelMonthController.updateTravelMonthExpendeDetailsStatusById);

export const travelMonthRoute = router;