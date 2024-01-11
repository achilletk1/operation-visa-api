
import { ReportingController } from './reporting.controller';
import express from 'express';

const router = express.Router();
export const reportingController = new ReportingController();

router.get('/consolidate', reportingController.getConsolidateData);

router.get('/statusOperations', reportingController.getStatusOperation);

router.get('/getAverageTimeJustify', reportingController.getAverageTimeJustify);

router.get('/chart', reportingController.getChartData);

router.get('/get-agencies', reportingController.getAgencies);

export const reportingRoute = router;