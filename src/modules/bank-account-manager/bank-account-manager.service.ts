import { BankAccountManagerRepository } from "./bank-account-manager.repository";
import { BankAccountManagerController } from './bank-account-manager.controller';
import { CbsBankAccountManager, CbsController } from "modules/cbs";
import { BankAccountManager } from "./model";
import { CrudService } from "common/base";

export class BankAccountManagerService extends CrudService<BankAccountManager>  {

    static bankAccountManagerRepository: BankAccountManagerRepository;

    constructor() {
        BankAccountManagerService.bankAccountManagerRepository = new BankAccountManagerRepository();
        super(BankAccountManagerService.bankAccountManagerRepository);
    }

    async getAndUpdateBankAccountManager() {
        try {
            const bankAccountManagers: CbsBankAccountManager[] = await CbsController.cbsService.getBankAccountManager();
            await BankAccountManagerController.bankAccountManagerService.deleteMany({});
            await BankAccountManagerController.bankAccountManagerService.createMany(bankAccountManagers);
        } catch (e: any) {
            this.logger.error(`error during getAndUpdateBankAccountManager process \n ${e.stack}`);    
        }
    }

}
