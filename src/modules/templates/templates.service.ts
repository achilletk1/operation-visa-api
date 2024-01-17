import { TemplatesRepository } from "./templates.repository";
import { TemplatesController } from './templates.controller';
import { CrudService } from "common/base";
import { TemplateForm } from "./model";

export class TemplatesService extends CrudService<TemplateForm> {

    static templatesRepository: TemplatesRepository;

    constructor() {
        TemplatesService.templatesRepository = new TemplatesRepository();
        super(TemplatesService.templatesRepository);
    }

    async updateTemplateById(_id: string, data: any) {
        try {
            const vouchers = await TemplatesController.templatesService.findAll({});
            const foundIndex = vouchers?.data.findIndex((e) => e.label === data.label && e._id.toString() !== _id);
            if (foundIndex > -1) { throw new Error('VoucherAlreadyExist'); }
            return await TemplatesController.templatesService.update({ _id }, data);
        } catch (error) { throw error; }
    }

}