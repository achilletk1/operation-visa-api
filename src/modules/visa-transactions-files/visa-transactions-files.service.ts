import { VisaTransactionsFilesRepository } from "./visa-transactions-files.repository";
import { CrudService } from "common/base";

export class VisaTransactionsFilesService extends CrudService<any> {

    static visaTransactionsFilesRepository: VisaTransactionsFilesRepository;

    constructor() {
        VisaTransactionsFilesService.visaTransactionsFilesRepository = new VisaTransactionsFilesRepository();
        super(VisaTransactionsFilesService.visaTransactionsFilesRepository);
    }

}