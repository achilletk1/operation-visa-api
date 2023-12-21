import { BaseRepository } from "common/base";
import { formatedVisaTransactionsTmps } from "./helper";
import { VisaTransactionsTmpAggregate } from "./model";

export class VisaTransactionsTmpRepository extends BaseRepository {

    constructor() { super(); this.collectionName = 'visa_transactions_tmp'; }

    async getFormatedVisaTransactionsTmps() {
        return await this.findAllAggregate(formatedVisaTransactionsTmps) as VisaTransactionsTmpAggregate[];
    }
}
