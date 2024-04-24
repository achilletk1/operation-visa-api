import { CbsController } from './cbs.controller';
import express from 'express';

const router = express.Router();
export const cbsController = new CbsController();

router.get('/clients/:cli', cbsController.getUserDataByCode);

router.get('/clients/by-name/:name', cbsController.getUsersDataByName);

router.post('/clients/accounts/data', cbsController.getUserCbsAccountsDatas);

router.get('/clients/data/:ncp', cbsController.getUserCbsDatasByNcp);

router.get('/clients/cards/:cli', cbsController.getClientCardsByCli);

router.get('/products/:code', cbsController.getProductData);

export const cbsRoute = router;