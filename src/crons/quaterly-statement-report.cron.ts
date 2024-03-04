import { BaseCron } from "common/base";
import { VisaRecapOperationsController } from "modules/visa-recap-operation-statement";

class QuaterlyStatementReportCron extends BaseCron {
    cronExpressionPath = 'crons.quaterlyStatementReportMailsScheduler';  // At every three month 
    service = VisaRecapOperationsController.visaRecapOperationsService.quarterlyReportingOperationsForBEAC;
    startOnStagingBci = true;
    startOnDev = false;
}

export default new QuaterlyStatementReportCron();