import { VisaOperationsController } from 'modules/visa-operations';
import { BaseCron } from "common/base";

// Détecter les opérations qui ont passées 30 jours sans etre justiées et mettre à jour le statut du délai du dossier à "Hors délai" (EXCEEDED)
class DetectOperationExceededCron extends BaseCron {
    cronExpressionPath = 'crons.unjustifiedOperation';  // At 05:00 every day
    service = VisaOperationsController.visaOperationsService.detectOperationExceededCeiling;
    startOnStagingBci = false;
    startOnDev = true;
}

export default new DetectOperationExceededCron();