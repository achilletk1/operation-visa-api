import { CrudService, QueryFilter, QueryOptions, QueryProjection } from "common/base";
import { BankAccountManagerRepository } from "./bank-account-manager.repository";
import { BankAccountManagerController } from './bank-account-manager.controller';
import httpContext from 'express-http-context';
import { BankAccountManager } from "./model";
import { CbsController } from "modules/cbs";

export class BankAccountManagerService extends CrudService<BankAccountManager>  {

    static bankAccountManagerRepository: BankAccountManagerRepository;

    constructor() {
        BankAccountManagerService.bankAccountManagerRepository = new BankAccountManagerRepository();
        super(BankAccountManagerService.bankAccountManagerRepository);
    }

    async getAndUpdateBankAccountManager() {
        try {
            const cbsBankAccountManagers = await CbsController.cbsService.getBankAccountManager();
            if (!cbsBankAccountManagers?.length) { throw new Error('EmptyDataFoundForUpdate'); }

            const localBankAccountManagers = (await BankAccountManagerController.bankAccountManagerService.findAll({ filter: { manualMode: true }, projection: { CODE_GES: 1 } }))?.data
            const gesCodeArrayOfUserWithManualMode = localBankAccountManagers?.map(accountManager => accountManager?.CODE_GES);

            // filtering of managers to update
            const bankAccountManagersToUpdate = cbsBankAccountManagers.filter(accountManager => !gesCodeArrayOfUserWithManualMode.includes(accountManager.CODE_GES));

            await BankAccountManagerController.bankAccountManagerService.deleteMany({ $or: [{ manualMode: { $exists: false } }, { manualMode: false }] });
            await BankAccountManagerController.bankAccountManagerService.createMany(bankAccountManagersToUpdate);
        } catch (e: any) {
            this.logger.error(`error during getAndUpdateBankAccountManager process \n ${e.stack}`);    
        }
    }

    async getManagerAccounts(filter: QueryFilter, projection?: QueryProjection) {
        try {
            const authUser = httpContext.get('user');
            if (authUser?.category < 500) { throw new Error('Forbidden'); }

            const opts: QueryOptions = { filter };
            (projection) && (opts.projection = projection);
            return await BankAccountManagerController.bankAccountManagerService.findAll(opts);
        } catch (error) { throw error; }
    }
    
    async updateManagerAccount(bankAccountManager: BankAccountManager) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { throw new Error('Forbidden'); };
            return await BankAccountManagerController.bankAccountManagerService.update({ _id: bankAccountManager?._id }, { ...bankAccountManager });
        } catch (error) { throw error; }
    }

}
