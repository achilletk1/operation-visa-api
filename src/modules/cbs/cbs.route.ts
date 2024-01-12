import { CbsController } from './cbs.controller';
import express from 'express';

const router = express.Router();
export const cbsController = new CbsController();

router.get('/clients/:cli', cbsController.getUserDataByCode);

router.post('/clients/accounts/data', cbsController.getUserCbsAccountsDatas);

router.get('/clients/data/:ncp', cbsController.getUserCbsDatasByNcp);

router.get('/clients/cards/:cli', cbsController.getClientCardsByCli);

router.get('/card/type/:code', cbsController.getCardsTypeByCode);

router.get('/products/:code', cbsController.getProductData);

export const cbsRoute = router;