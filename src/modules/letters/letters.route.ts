import { LettersController } from './letters.controller';
import express from 'express';

const router = express.Router();
export const lettersController = new LettersController();

router.post('/', lettersController.create);

router.get('/', lettersController.findAll);

router.get('/all', lettersController.findAll);

router.post('/view', lettersController.generateExportView);

router.get('/variables', lettersController.getLettersVariables);

router.get('/:id', lettersController.findOneById);

router.put('/:id', lettersController.updateById);

export const lettersRoute = router;