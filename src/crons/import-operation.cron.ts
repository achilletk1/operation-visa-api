import { VisaTransactionsFilesController } from "modules/visa-transactions-files";
import { BaseCron } from "common/base";

// faire chaque 2 minutes l'importation automatique des opérations
class ImportOperationCron extends BaseCron {
    cronExpressionPath = 'crons.importOperation';  // At 05:00 every day
    service = VisaTransactionsFilesController.visaTransactionsFilesService.importOperations;
    startOnStagingBci = true;
    startOnDev = false;
}

export default new ImportOperationCron();