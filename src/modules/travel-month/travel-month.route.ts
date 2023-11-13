import { TravelMonthController } from './travel-month.controller';
import express from 'express';

const router = express.Router();
export const travelMonthController = new TravelMonthController();

router.post('/', travelMonthController.create);

router.get('/', travelMonthController.getTravelMonths);

router.get('/all', travelMonthController.getTravelMonths);

router.put('/', travelMonthController.updateManyTravelMonths);

router.put('/expense-details/status/:id', travelMonthController.updateTravelMonthExpendeDetailsStatusById);

router.get('/:id', travelMonthController.findOneById);

router.put('/:id', travelMonthController.updateTravelMonthsById);

export const travelMonthRoute = router;