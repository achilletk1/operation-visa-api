
import { DownloadsController } from './downloads.controller';
import express from 'express';

const router = express.Router();
export const downloadsController = new DownloadsController();

router.get('/visa-transactions-file/xlsx/default-terminals', downloadsController.downloadFileTerminals);

router.get('/visa-transactions-file/xlsx/default-internet', downloadsController.downloadFileInternet);

export const downloadsRoute = router;