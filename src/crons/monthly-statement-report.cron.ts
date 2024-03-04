
import { VisaRecapOperationsController } from "modules";
import { BaseCron } from "common/base";

class MonthlyStatementReportCron extends BaseCron {
  cronExpressionPath = 'crons.monthlyStatementReportMailsScheduler';  // At every month 
  service = VisaRecapOperationsController.visaRecapOperationsService.monthlyReportingOperationsForBEAC;
  startOnStagingBci = true;
  startOnDev = false;
}

export default new MonthlyStatementReportCron();