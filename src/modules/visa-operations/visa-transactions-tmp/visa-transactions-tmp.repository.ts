import { BaseRepository } from "common/base";
import { formatedVisaTransactionsTmps } from "./helper";

export class VisaTransactionsTmpRepository extends BaseRepository {

    constructor() { super(); this.collectionName = 'visa_transactions_tmp'; }

    async getFormatedVisaTransactionsTmps() {
        return await this.findAllAggregate(formatedVisaTransactionsTmps);
    }
}
