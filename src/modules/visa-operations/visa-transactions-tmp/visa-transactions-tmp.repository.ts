import { BaseRepository } from "common/base";
import { formattedVisaTransactionsTmp } from "./helper";
import { VisaTransactionsTmpAggregate } from "./model";

export class VisaTransactionsTmpRepository extends BaseRepository {

    constructor() { super(); this.collectionName = 'visa_transactions_tmp'; }

    async getFormattedVisaTransactionsTmp() {
        return await this.findAllAggregate(formattedVisaTransactionsTmp) as VisaTransactionsTmpAggregate[];
    }
}
