import { BankAccountManagerRepository } from "./bank-account-manager.repository";
import { BankAccountManagerController } from './bank-account-manager.controller';
import { BankAccountManager } from "./model";
import { CbsController } from "modules/cbs";
import { CrudService } from "common/base";

export class BankAccountManagerService extends CrudService<BankAccountManager>  {

    static bankAccountManagerRepository: BankAccountManagerRepository;

    constructor() {
        BankAccountManagerService.bankAccountManagerRepository = new BankAccountManagerRepository();
        super(BankAccountManagerService.bankAccountManagerRepository);
    }

    async getAndUpdateBankAccountManager() {
        try {
            const bankAccountManagers: BankAccountManager[] = await CbsController.cbsService.getBankAccountManager();
            await BankAccountManagerController.bankAccountManagerService.deleteMany({});
            await BankAccountManagerController.bankAccountManagerService.createMany(bankAccountManagers);
        } catch (e: any) {
            this.logger.error(`error during getAndUpdateBankAccountManager process \n ${e.stack}`);    
        }
    }

}
