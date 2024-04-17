import { BankAccountManagerRepository } from "./bank-account-manager.repository";
import { BankAccountManagerController } from './bank-account-manager.controller';
import { formatUserFilters } from "modules/users/helper";
import httpContext from 'express-http-context';
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
            const bankAccountManagers: Partial<BankAccountManager>[] = await CbsController.cbsService.getBankAccountManager();
            const onlyAutomaticModeUser = bankAccountManagers.filter(bankManager => bankManager.autoMode);
            const onlyIdOfAutomaticUserMode = onlyAutomaticModeUser.map(data => data._id);

            await BankAccountManagerController.bankAccountManagerService.deleteMany({ _id: { $in: onlyIdOfAutomaticUserMode } });
            await BankAccountManagerController.bankAccountManagerService.create(onlyAutomaticModeUser);
        } catch (e: any) {
            this.logger.error(`error during getAndUpdateBankAccountManager process \n ${e.stack}`);    
        }
    }

    async getManagerAccounts(filters: any, projection?: any) {
        try {
            const authUser = httpContext.get('user');
            if (authUser?.category < 500) { throw new Error('Forbidden'); }

            const filter = formatUserFilters(filters);
            const opts: any = { filter };
            if (projection) { opts.projection = projection; }
            return await BankAccountManagerController.bankAccountManagerService.findAll(opts);
        } catch (error) { throw error; }
    }
    
    async updateManagerAccount(userDatas: BankAccountManager) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { throw new Error('Forbidden'); };
            const result = await BankAccountManagerController.bankAccountManagerService.update({ _id: userDatas?._id }, userDatas);
            return result;
        } catch (error) { throw error; }
    }
}
