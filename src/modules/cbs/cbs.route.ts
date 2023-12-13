import { CbsController } from './cbs.controller';
import express from 'express';

const router = express.Router();
export const cbsController = new CbsController();

router.get('/clients/:cli', cbsController.getUserDataByCode);

router.get('/clients/data/:ncp', cbsController.getUserDataByCode);

export const cbsRoute = router;