import { OnlinePaymentController } from 'modules/online-payment';
import { BaseCron } from "common/base";

// Supprimer les mois de paiement en ligne passé n'ayant pas dépassés le plafond sauf le mois courant
class RemoveOnpWithoutExceedingCron extends BaseCron {
    cronExpressionPath = 'crons.removeOnlinePaymentsWithExceedings';  // At 00:00 on day-of-month 2
    service = OnlinePaymentController.onlinePaymentService.removeOnlinePaymentsWithExceedings;
    startOnStagingBci = false;
    startOnDev = false;
}

export default new RemoveOnpWithoutExceedingCron();