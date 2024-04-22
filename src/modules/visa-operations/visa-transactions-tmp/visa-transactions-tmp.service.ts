import { VisaTransactionsTmpRepository } from "./visa-transactions-tmp.repository";
import { VisaTransactionsTmp } from "./model";
import { CrudService } from "common/base";

export class VisaTransactionsTmpService extends CrudService<VisaTransactionsTmp> {

    static visaTransactionsTmpRepository: VisaTransactionsTmpRepository;

    constructor() {
        VisaTransactionsTmpService.visaTransactionsTmpRepository = new VisaTransactionsTmpRepository();
        super(VisaTransactionsTmpService.visaTransactionsTmpRepository);
    }

    async getFormattedVisaTransactionsTmp() {
        try { return await VisaTransactionsTmpService.visaTransactionsTmpRepository.getFormattedVisaTransactionsTmp(); } 
        catch (error) { throw error; }
    }

}