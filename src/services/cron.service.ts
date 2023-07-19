import { visaTransactonsProcessingService } from "./visa-transaction-processing.service";
import { temporaryFilesService } from "./temporary-files.service";
import { logger } from "../winston";
import { config } from "../config";
import cron from 'node-cron';

export const cronService = {
    // exceding verifications, travel detections and online payment detection process
    startTransactionsProcessing: async (): Promise<void> => {
        const cronExpression = `${config.get('cronTransactionProcessing')}`;

        cron.schedule(cronExpression, async () => {
            try {
                await visaTransactonsProcessingService.startTransactionsProcessing();
            } catch (error) {
                logger.error(`start transactions processing failed \n${error.stack}\n`);
                process.exit(1);
            }
        });

    },

    // formal notice letter sending and justifications revival process
    startRevivalMail: async (): Promise<void> => {
        const cronExpression = `${config.get('cronRevivalMail')}`;
        cron.schedule(cronExpression, async () => {
            try {
                await visaTransactonsProcessingService.startRevivalMail();
            } catch (error) {
                logger.error(`start revival mail failed \n${error.stack}\n`);
                process.exit(1);
            }
        });

    },

    // remove temporaries files which exeeded the expire time
    startRemoveTemporaryFiles: async (): Promise<void> => {
        const cronExpression = `${config.get('cronDeleteTemporaryFile')}`;
        cron.schedule(cronExpression, async () => {
            try {
                await temporaryFilesService.removeTemporaryFiles();
            } catch (error) {
                logger.error(`start revival mail failed \n${error.stack}\n`);
                process.exit(1);
            }
        });

    },

};
