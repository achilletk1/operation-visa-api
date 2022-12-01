import { logger } from "../winston";
import cron from 'node-cron';
import { visaTransactonsProcessingService } from "./visa-transaction-processing.service";
import { config } from "../config";

export const cronService = {

    startTransactionsProcessing: async (): Promise<void> => {
        const cronExpression = `${config.get('cronTransactionProcessing')}`; // At every minutes
        console.log(cronExpression);
        
        cron.schedule(cronExpression, async () => {
            try {
                await visaTransactonsProcessingService.startTransactionsProcessing();
            } catch (error) {
                logger.error(`check and send campaign failed \n${error.stack}\n`);
                process.exit(1);
            }
        });

    },

    startRevivalMail: async (): Promise<void> => {
        const cronExpression = `${config.get('cronRevivalMail')}`; // At every 20th minute past every hour from 0 through 5
        cron.schedule(cronExpression, async () => {
            try {
                await visaTransactonsProcessingService.startRevivalMail();
            } catch (error) {
                logger.error(`check and send campaign failed \n${error.stack}\n`);
                process.exit(1);
            }
        });

    },

};
