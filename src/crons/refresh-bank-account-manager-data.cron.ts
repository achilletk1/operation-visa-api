import { VisaOperationsController } from "modules/visa-operations";
import { BaseCron } from "common/base";

// Mise à jour des informations sur les gestionnaires
class RefreshBankAccountManagerDataCron extends BaseCron {
    cronExpressionPath = 'crons.refreshBankAccountManager';  // At minute 7 past every hour. 
    service = VisaOperationsController.visaOperationsService.startTransactionsProcessing;
    startOnStagingBci = true;
    startOnDev = false;
}

export default new RefreshBankAccountManagerDataCron();