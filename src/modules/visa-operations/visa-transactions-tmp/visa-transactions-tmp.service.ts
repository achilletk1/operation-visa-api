import { VisaTransactionsTmpRepository } from "./visa-transactions-tmp.repository";
import { VisaTransactionsTmp } from "./model";
import { CrudService } from "common/base";

export class VisaTransactionsTmpService extends CrudService<VisaTransactionsTmp> {

    static visaTransactionsTmpRepository: VisaTransactionsTmpRepository;

    constructor() {
        VisaTransactionsTmpService.visaTransactionsTmpRepository = new VisaTransactionsTmpRepository();
        super(VisaTransactionsTmpService.visaTransactionsTmpRepository);
    }

    async getFormatedVisaTransactionsTmps() {
        try { return await VisaTransactionsTmpService.visaTransactionsTmpRepository.getFormatedVisaTransactionsTmps(); } 
        catch (error) { throw error; }
    }

}