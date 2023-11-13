import { TemplatesController } from './templates.controller';
import express from 'express';

const router = express.Router();
export const templatesController = new TemplatesController();

router.post('/', templatesController.create);

router.get('/', templatesController.findAll);

router.get('/all', templatesController.findAll);

router.get('/variables', templatesController.getVariables);

router.post('/variables', templatesController.insertVariables);

router.put('/:id', templatesController.updateTemplateById);

router.get('/:id', templatesController.findOneById);

export const templatesRoute = router;