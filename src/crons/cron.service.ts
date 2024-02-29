
import RefreshBankAccountManagerDataCron from './refresh-bank-account-manager-data.cron';
import DetectListOfUsersToBlockedCron from './detect-list-of-users-to-blocked.cron';
import RemoveOnpWithoutExceedingCron from './remove-onp-without-Exceeding.cron';
import DetectOperationExceededCron from './detect-operation-exceeded.cron';
import QuaterlyStatementReportCron from './quaterly-statement-report.cron';
import MonthlyStatementReportCron from './monthly-statement-report.cron';
import TransactionsProcessingCron from './transactions-processing.cron';
import DeleteTemporaryFilesCron from './delete-temporary-files.cron';
import RevivalMailCron from './revival-mail.cron';

export const startCrons = () => {
    RevivalMailCron.start();
    TransactionsProcessingCron.start();
    DeleteTemporaryFilesCron.start();
    RemoveOnpWithoutExceedingCron.start();
    DetectListOfUsersToBlockedCron.start();
    MonthlyStatementReportCron.start();
    QuaterlyStatementReportCron.start();
    RefreshBankAccountManagerDataCron.start();
    DetectOperationExceededCron.start()
}