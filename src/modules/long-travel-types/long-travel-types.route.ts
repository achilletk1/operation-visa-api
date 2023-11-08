import { LongTravelTypesController } from './long-travel-types.controller';
import express from 'express';

const router = express.Router();
export const longTravelTypesController = new LongTravelTypesController();

router.post('/', longTravelTypesController.insertLongTravelTypes);

// router.post('/', longTravelTypesController.create);

router.get('/', longTravelTypesController.findAll);

router.get('/all', longTravelTypesController.findAll);

router.get('/:id', longTravelTypesController.findOneById);

router.put('/:id', longTravelTypesController.updateById);

router.get('/not-customer/all', longTravelTypesController.findAll);

export const longTravelTypesRoute = router;