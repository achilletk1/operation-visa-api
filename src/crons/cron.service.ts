
import DetectListOfUsersToBlockedCron from './detect-list-of-users-to-blocked.cron';
import RemoveOnpWithoutExceedingCron from './remove-onp-without-Exceeding.cron';
import TransactionsProcessingCron from './transactions-processing.cron';
import DeleteTemporaryFilesCron from './delete-temporary-files.cron';
import RevivalMailCron from './revival-mail.cron';
import { startTransactionsProcessingCron } from "./transaction-processing";

export const startCrons = () => {
    RevivalMailCron.start();
    TransactionsProcessingCron.start();
    DeleteTemporaryFilesCron.start();
    RemoveOnpWithoutExceedingCron.start();
    DetectListOfUsersToBlockedCron.start();
    startTransactionsProcessingCron.start();
}