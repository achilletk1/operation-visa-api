
import { ReportingController } from './reporting.controller';
import express from 'express';

const router = express.Router();
export const reportingController = new ReportingController();

router.post('/consolidate', reportingController.getConsolidateData);

router.post('/statusOperations', reportingController.getStatusOperation);

router.post('/getAverageTimeJustify', reportingController.getAverageTimeJustify);

router.post('/chart', reportingController.getChartData);

export const reportingRoute = router;