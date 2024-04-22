import { CbsBankAccountManager } from "modules/cbs";

export interface BankAccountManager extends CbsBankAccountManager {
    _id?: string;
    manualMode: boolean;
}
