import { BaseRepository } from "common/base";

export class ValidationsRepository extends BaseRepository {

    constructor() { super(); this.collectionName = 'visa_operations_validators'; }

    async getMaxValidationLevel(): Promise<any> {
        const query = [
            { $match: { enabled: true, } },
            { $group: { _id: null, level: { $max: "$level" } } }
        ];
        return await this.findAllAggregate(query);
    }

}
