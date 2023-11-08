
import { DownloadsController } from './downloads.controller';
import express from 'express';

const router = express.Router();
export const downloadsController = new DownloadsController();

router.post('/visa-transactions-file/xlsx/default', downloadsController.downloadFile);

export const downloadsRoute = router;