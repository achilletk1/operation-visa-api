import { TemporaryFilesController } from './temporary-files.controller';
import express from 'express';

const router = express.Router();
export const temporaryFilesController = new TemporaryFilesController();

router.post('/', temporaryFilesController.insertTemporaryFile);

// router.post('/', temporaryFilesController.create);

// router.get('/', temporaryFilesController.findAll);

// router.get('/all', temporaryFilesController.findAll);

// router.get('/:id', temporaryFilesController.findOneById);

// router.put('/:id', temporaryFilesController.updateById);

router.put('/:id', temporaryFilesController.updateTemporaryFileById);

export const temporaryFilesRoute = router;