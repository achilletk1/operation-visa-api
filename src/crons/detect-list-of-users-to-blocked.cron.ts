import { VisaOperationsController } from 'modules/visa-operations';
import { BaseCron } from "common/base";

// Detecter les utilisateurs en situation de blocage de carte et faire un mail à la BCI avec la liste en copie.
class DetectListOfUsersToBlockedCron extends BaseCron {
    cronExpressionPath = 'crons.clientInDemeure';  // At 00:00 on day-of-month 1 in every 3rd month
    service = VisaOperationsController.visaOperationsService.detectListOfUsersToBlocked;
    startOnStagingBci = false;
    startOnDev = false;
}

export default new DetectListOfUsersToBlockedCron();