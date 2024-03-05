import { BankAccountManagerController, } from "modules/bank-account-manager";
import { BaseCron } from "common/base";

// Mise à jour des informations sur les gestionnaires
class RefreshBankAccountManagerDataCron extends BaseCron {
    cronExpressionPath = 'crons.refreshBankAccountManager';  // At minute 7 past every hour. 
    service = BankAccountManagerController.bankAccountManagerService.getAndUpdateBankAccountManager;
    startOnStagingBci = true;
    startOnDev = false;
}

export default new RefreshBankAccountManagerDataCron();