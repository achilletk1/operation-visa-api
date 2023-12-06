import { TmpController } from './tmp.controller';
import express from 'express';

const router = express.Router();
export const tmpController = new TmpController();

router.get('/:id', tmpController.findOneById);

router.put('/:id', tmpController.updateById);

export const lettersRoute = router;