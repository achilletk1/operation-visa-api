import { VisaTransactionsRepository } from "./visa-transactions.repository";
import { CrudService } from "common/base";
import { VisaTransaction } from "./model";

export class VisaTransactionsService extends CrudService<VisaTransaction> {

    static visaTransactionsRepository: VisaTransactionsRepository;

    constructor() {
        VisaTransactionsService.visaTransactionsRepository = new VisaTransactionsRepository();
        super(VisaTransactionsService.visaTransactionsRepository);
    }

}