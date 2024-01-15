import { CardTypeController } from './card-type.controller';
import express from 'express';

const router = express.Router();
export const cardTypeController = new CardTypeController();

router.get('/', cardTypeController.findAll);

router.get('/all', cardTypeController.findAll);

router.get('/card', cardTypeController.findCard);

router.get('/:id', cardTypeController.findOneById);

router.post('/', cardTypeController.insertCardType);

router.put('/:id', cardTypeController.updateById);

export const cardTypeRoute = router;