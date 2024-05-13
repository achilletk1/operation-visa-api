import { TransferStakeholderController } from './transfer-stakeholder.controller';
import express from 'express';

const router = express.Router();
export const transferStakeholderController = new TransferStakeholderController();

router.post('/', transferStakeholderController.insertTransferStakeholder);

router.get('/', transferStakeholderController.findAll);

router.get('/:id', transferStakeholderController.findOneById);

router.put('/:id', transferStakeholderController.updateTransferStakeholderById);

export const transferStakeholderRoute = router;