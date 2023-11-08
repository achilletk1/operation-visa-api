import { VisaTransactionsCeilingsRepository } from "./visa-transactions-ceilings.repository";
import { CrudService } from "common/base";

export class VisaTransactionsCeilingsService extends CrudService<any> {

    static visaTransactionsCeilingsRepository: VisaTransactionsCeilingsRepository;

    constructor() {
        VisaTransactionsCeilingsService.visaTransactionsCeilingsRepository = new VisaTransactionsCeilingsRepository();
        super(VisaTransactionsCeilingsService.visaTransactionsCeilingsRepository);
    }

}