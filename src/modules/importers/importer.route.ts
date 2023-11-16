import { ImporterController } from './importer.controller';
import express from 'express';

const router = express.Router();
export const importerController = new ImporterController();

router.post('/', importerController.insertImporter);

router.get('/', importerController.getImporters);

router.get('/all', importerController.getImporters);

router.put('/:id', importerController.updateImporterById);

router.get('/:id', importerController.findOneById);

router.delete('/:id', importerController.deleteImporterById);


export const importersRoute = router;