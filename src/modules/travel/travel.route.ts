import { TravelController } from './travel.controller';
import express from 'express';

const router = express.Router();
export const travelController = new TravelController();

router.post('/', travelController.insertTravel);

router.get('/', travelController.getTravels);

router.get('/all', travelController.getTravels);

router.get('/:id', travelController.findOneById);

router.put('/:id', travelController.updateTravelById);

router.put('/:id/steps/status', travelController.updateTravelStepStatusById);

router.get('/:id/validators', travelController.updateTravelById);

router.get('/transactions/range', travelController.getTravelRangesTransactions);

export const travelRoute = router;