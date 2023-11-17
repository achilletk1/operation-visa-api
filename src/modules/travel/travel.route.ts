import { TravelController } from './travel.controller';
import express from 'express';

const router = express.Router();
export const travelController = new TravelController();

router.post('/', travelController.insertTravel);

router.get('/', travelController.getTravels);

router.get('/all', travelController.getTravels);

router.get('/validators/:id', travelController.getValidationsTravel);

router.put('/steps/status/:id', travelController.updateTravelStepStatusById);

router.get('/transactions/range', travelController.getTravelRangesTransactions);

router.get('/:id', travelController.findOneById);

router.put('/:id', travelController.updateTravelById);

router.get('/query/generate/:id', travelController.generateQueryLink);

router.post('/notify/link', travelController.sendLinkNotification);


export const travelRoute = router;