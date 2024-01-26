import { ImportsController } from './imports.controller';
import express from 'express';

const router = express.Router();
export const importsController = new ImportsController();

router.post('/', importsController.create);

router.get('/', importsController.findAll);

router.get('/all', importsController.findAll);

router.get('/projected-for-select', importsController.getImportsProjected);

router.get('/labels', importsController.getImportationsLabels);

router.get('/:id', importsController.findOneById);

router.put('/status/:id', importsController.updateImportationStatusById);

router.put('/:id', importsController.update);

export const importsRoute = router;