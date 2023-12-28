import { VisaOperationsController } from "modules/visa-operations";
import { BaseCron } from "common/base";

// Envoi des lettres de mise en demeure et des mails de blocage de carte
class RevivalMailCron extends BaseCron {
    cronExpressionPath = 'crons.revivalMail';  // At every 30th minute 
    service = VisaOperationsController.visaOperationsService.startRevivalMail;
    startOnStagingBci = false;
    startOnDev = true;
}

export default new RevivalMailCron();