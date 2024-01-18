import { CrudService } from "common/base";
import { transactionTypes } from "./model/transaction-types.model";
import { TransactionTypesRepository } from "./transaction-types.repository";
import { TransactionTypesController } from "./transaction-types.controller";

export class transactionTypeService extends CrudService<transactionTypes> {

    static transactionTypesRepository: TransactionTypesRepository;

    constructor() {
        transactionTypeService.transactionTypesRepository = new TransactionTypesRepository();
        super(transactionTypeService.transactionTypesRepository);
    }

    async insertTransaction(data: transactionTypes) {
        try {
            const vourchers = await TransactionTypesController.transactiontypesService.findAll({});
            const foundIndex = vourchers?.data?.findIndex((e) => e.label === data.label);
            if (foundIndex > -1) { throw new Error('TransactionTypeAlreadyExist'); }
            return await TransactionTypesController.transactiontypesService.create(data);
        } catch (error) { throw error;}
    }

    async updateTransactionById(_id: string, data: any) {
        try {
            const vourchers = await TransactionTypesController.transactiontypesService.findAll({});
            const foundIndex = vourchers?.data?.findIndex((e) => e.label === data.label && e?._id?.toString() !== _id);
            if (foundIndex > -1) { throw new Error('TransactionTypeAlreadyExist') }
            return await TransactionTypesController.transactiontypesService.update({ _id }, data);
        } catch (error) { throw error;}
    }

}