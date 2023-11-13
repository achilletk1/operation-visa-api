import { TemporaryFilesController } from './temporary-files.controller';
import express from 'express';

const router = express.Router();
export const temporaryFilesController = new TemporaryFilesController();

router.post('/', temporaryFilesController.insertTemporaryFile);

router.put('/:id', temporaryFilesController.updateTemporaryFileById);

export const temporaryFilesRoute = router;