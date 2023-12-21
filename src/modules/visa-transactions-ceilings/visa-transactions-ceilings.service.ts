import { VisaTransactionsCeilingsRepository } from "./visa-transactions-ceilings.repository";
import { VisaTransactionsCeiling } from "./model";
import { CrudService } from "common/base";

export class VisaTransactionsCeilingsService extends CrudService<VisaTransactionsCeiling> {

    static visaTransactionsCeilingsRepository: VisaTransactionsCeilingsRepository;

    constructor() {
        VisaTransactionsCeilingsService.visaTransactionsCeilingsRepository = new VisaTransactionsCeilingsRepository();
        super(VisaTransactionsCeilingsService.visaTransactionsCeilingsRepository);
    }

}