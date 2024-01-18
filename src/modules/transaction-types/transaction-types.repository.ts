import { BaseRepository } from "common/base";

export class TransactionTypesRepository extends BaseRepository {

    constructor() { super(); this.collectionName = 'visa_operations_transaction-types'; }

}
