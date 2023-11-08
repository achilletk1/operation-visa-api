import { LettersController } from './letters.controller';
import express from 'express';

const router = express.Router();
export const lettersController = new LettersController();

router.post('/', lettersController.create);

router.get('/', lettersController.findAll);

router.get('/all', lettersController.findAll);

router.get('/:id', lettersController.findOneById);

router.put('/:id', lettersController.updateById);

router.post('/view', lettersController.generateExportView);

router.get('/variables', lettersController.getLettersVariables);

export const lettersRoute = router;