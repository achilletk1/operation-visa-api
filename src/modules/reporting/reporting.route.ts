
import { ReportingController } from './reporting.controller';
import express from 'express';

const router = express.Router();
export const reportingController = new ReportingController();

router.get('/consolidate', reportingController.getConsolidateData);

router.get('/statusOperations', reportingController.getStatusOperation);

router.get('/getAverageTimeJustify', reportingController.getAverageTimeJustify);

router.get('/chart', reportingController.getChartData);

export const reportingRoute = router;