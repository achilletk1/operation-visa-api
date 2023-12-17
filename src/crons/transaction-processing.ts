import { config } from "convict-config";
import { logger } from "winston-config";
import cron from 'node-cron'
import { VisaOperationsController } from "modules/visa-operations";

export class startTransactionsProcessingCron {
    public static start() {
        const cronExpression = config.get('cronTransactionProcessing');

        cron.schedule(cronExpression, async () => {
            logger.debug('Start transaction processing cron');       
            await VisaOperationsController.visaOperationsService.startTransactionsProcessing();
        });
    }
}