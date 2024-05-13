import { TransferStakeholderRepository } from "./transfer-stakeholder.repository";
import { TransferStakeholderController } from "./transfer-stakeholder.controller";
import { TransferStakeholder } from "./model";
import { CrudService } from "common/base";

export class TransferStakeholderService extends CrudService<TransferStakeholder> {

    static transferStakeholderRepository: TransferStakeholderRepository;

    constructor() {
        TransferStakeholderService.transferStakeholderRepository = new TransferStakeholderRepository();
        super(TransferStakeholderService.transferStakeholderRepository);
    }

    async insertTransferStakeholder(data: TransferStakeholder) {
        try {
            data.dates = { ...data.dates, created: new Date().valueOf() };
            const transferStakeholder = await TransferStakeholderController.transferStakeholderService.findAll({});
            const foundIndex = transferStakeholder?.data?.findIndex((e) => e.name === data.name);
            if (foundIndex > -1) { throw new Error('TransferStakeholderAlreadyExist'); }
            return await TransferStakeholderController.transferStakeholderService.create(data);
        } catch (error) { throw error; }
    }

    async updateTransferStakeholderById(_id: string, data: any) {
        try {
            let transferStakeholder!: TransferStakeholder;
            try { transferStakeholder = await TransferStakeholderController.transferStakeholderService.findOne({ filter: { _id } }) } catch { }
            if (!transferStakeholder) { throw new Error('TransferStakeholderNotFound'); }
            data.dates = { ...data.dates, updated: new Date().valueOf() }
            return await TransferStakeholderController.transferStakeholderService.update({ _id }, data);
        } catch (error) { throw error; }
    }

}