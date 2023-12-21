import 'module-alias/register';
import { ExpressLoader } from 'loaders/express';
import { startDatabase } from 'database/mongodb';
import { logger } from 'winston-config';
import { startCrons } from './crons';


startDatabase().then(async () => {
    // await commonService.initCache();

    logger.info("Database connection successful");

    // Create express instance to setup API
    new ExpressLoader();

    startCrons();
}).catch((err: Error) => {
    console.error(err.stack);
    logger.error("Database connection failed \n", err.stack || '');
});

// cronService.instantiate();
// // cronService.startRemoveOnpWithoutExceeding();
// cronService.startTransactionsProcessing();
// // cronService.detectListOfUsersToBlocked();
// // cronService.startRemoveTemporaryFiles();
// // cronService.startRevivalMail();
