import { getBEACReportZipOnBase64Format, generateRecapOpeXls, txtToArray, insertStatementReport, getBEACReportExcelFormat, base64ToTxtFile } from "./helper";
import { MonthlyRecapStatementEvent } from "modules/notifications/notifications/mail/monthly-recap-statement";
import { VisaRecapOperationsController } from "./visa-recap-operation-statement.controller";
import { VisaRecapOperationRepository } from "./visa-recap-operation-statement.repository";
import { QuarterlyRecapStatementEvent, notificationEmmiter } from "modules/notifications";
import { VisaTransactionsController } from "modules/visa-transactions";
import { OpeVisaStatus } from "modules/visa-operations";
import { TravelController } from "modules/travel";
import { StatementReport } from "./model";
import { CrudService } from "common/base";
import { errorMsg } from "common/utils";
import { config } from "convict-config";
import { StatementType } from "./enum";
import crypt from 'url-crypt';
import moment from "moment";

const { cryptObj, decryptObj } = crypt(config.get('exportSalt'));

export class VisaRecapOperationService extends CrudService<StatementReport> {

    static visaRecapOperationRepository: VisaRecapOperationRepository;

    constructor() {
        VisaRecapOperationService.visaRecapOperationRepository = new VisaRecapOperationRepository();
        super(VisaRecapOperationService.visaRecapOperationRepository);
    }

    async monthlyReportingOperationsForBEAC(): Promise<void> {
        try {
            const exceededTravels = (await VisaTransactionsController.visaTransactionsService.findAll({ filter: { currentMonth: +moment().subtract(1, 'months').format('YYYYMM').valueOf() } }))?.data ?? [];
            const base64Data = await getBEACReportZipOnBase64Format(exceededTravels, 'tmp_transaction');
            const result = await insertStatementReport(StatementType.MONTHLY, base64Data);
            const excelData = getBEACReportExcelFormat(exceededTravels);
            notificationEmmiter.emit('monthly-statement-recap-mail', new MonthlyRecapStatementEvent(excelData));
            await VisaRecapOperationsController.visaRecapOperationsService.update({ _id: result?.data?.toString() }, { send_at: moment().valueOf() });
        } catch (e: any) {
            this.logger.error(`send monthly recap BEAC operations failed \n${e.stack}\n`);
        }
    }

    async quarterlyReportingOperationsForBEAC(): Promise<void> {
        try {
            const data = (await TravelController.travelService.findAll({ filter: { status: OpeVisaStatus.EXCEEDED } }))?.data ?? [];
            const exceededTravels = data.filter((elt) => { return (elt?.transactions.length > 0 && moment().diff(moment(elt?.transactions[0]?.date), 'days') > 38) });
            const base64Data = await getBEACReportZipOnBase64Format(exceededTravels, 'tmp_exceeded');
            const result = await insertStatementReport(StatementType.QUARTERLY, base64Data);
            const excelData = getBEACReportExcelFormat(exceededTravels);
            notificationEmmiter.emit('quarterly-statement-recap-mail', new QuarterlyRecapStatementEvent(excelData));
            await VisaRecapOperationsController.visaRecapOperationsService.update({ _id: result?.data?.toString() }, { send_at: new Date().valueOf() });
        } catch (e: any) {
            this.logger.error(`send quarterly recap BEAC operations failed \n${e.stack}\n`);
        }
    }

    async exportOperationRecap(code: string) {
        let options;
        try {
            options = decryptObj(code);
        } catch (error) { throw new Error('BadExportCode'); }

        try {
            if ((new Date()).getTime() >= options?.ttl) { throw new Error(errorMsg.EXPIRE_LINK); }
            const base64Data = (await VisaRecapOperationsController.visaRecapOperationsService.findOne({ filter: { _id: options?.recapId?.toString() } }))?.base64Data;
            const fileContent = await base64ToTxtFile(base64Data);
            const arrayOfArrayData = txtToArray(fileContent);
            return generateRecapOpeXls(arrayOfArrayData);
        } catch (error) { throw error; }
    }

    async generateXlsLink(recapId: string) {
        try {
            await VisaRecapOperationsController.visaRecapOperationsService.findOne({ filter: { _id: recapId?.toString() } });
            const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();
            const options = { recapId, ttl }
            const xlsxCode = cryptObj({ format: 'xlsx', ...options });
            const basePath = `${config.get('basePath')}/visa-recap-operation/export-visa-recap-ope`;
            return { xlsLink: `${basePath}/${xlsxCode}` }
        } catch (error) { throw error; }
    }

}