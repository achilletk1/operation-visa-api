import { ImportsController } from './imports.controller';
import express from 'express';

const router = express.Router();
export const importsController = new ImportsController();

router.post('/', importsController.create);

router.get('/', importsController.findAll);

router.get('/all', importsController.findAll);

router.get('/:id', importsController.findOneById);

router.put('/:id', importsController.update);

export const importsRoute = router;