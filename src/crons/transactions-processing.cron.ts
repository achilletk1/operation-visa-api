import { VisaOperationsController } from "modules/visa-operations";
import { BaseCron } from "common/base";

// Regroupement des voyages et paiements en ligne ayant dépassés.
class TransactionsProcessingCron extends BaseCron {
    cronExpressionPath = 'crons.transactionProcessing';  // At every 3rd minute 
    service = VisaOperationsController.visaOperationsService.startTransactionsProcessing;
    startOnStagingBci = true;
    startOnDev = true;
}

export default new TransactionsProcessingCron();