import { TemplatesController } from './templates.controller';
import express from 'express';

const router = express.Router();
export const templatesController = new TemplatesController();

router.post('/', templatesController.create);

router.get('/', templatesController.findAll);

router.get('/all', templatesController.findAll);

router.get('/:id', templatesController.findOneById);

// router.put('/:id', templatesController.updateById);

router.put('/:id', templatesController.updateTemplateById);

export const templatesRoute = router;