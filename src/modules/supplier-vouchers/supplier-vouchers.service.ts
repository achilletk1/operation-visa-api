import { SupplierVouchersRepository } from "./supplier-vouchers.repository";
import { SupplierVouchersController } from "./supplier-vouchers.controller";
import { SupplierVoucher } from "./model/supplier-voucher.model";
import { CrudService } from "common/base";

export class SupplierVouchersService extends CrudService<SupplierVoucher> {

    static SuppliervouchersRepository: SupplierVouchersRepository;

    constructor() {
        SupplierVouchersService.SuppliervouchersRepository = new SupplierVouchersRepository();
        super(SupplierVouchersService.SuppliervouchersRepository);
    }

    async insertSupplierVoucher(data: SupplierVoucher) {
        try {
            data.dates = { ...data.dates, created: new Date().valueOf() };
            const vouchers = await SupplierVouchersController.suppliervouchersService.findAll({});
            const foundIndex = vouchers?.data?.findIndex((e) => e.label === data.label);
            if (foundIndex > -1) { throw new Error('VoucherAlreadyExist'); }
            return await SupplierVouchersController.suppliervouchersService.create(data);
        } catch (error) { throw error; }
    }

    async updateSupplierVoucherById(_id: string, data: any) {
        try {
            const vouchers = await SupplierVouchersController.suppliervouchersService.findAll({});
            const foundIndex = vouchers?.data?.findIndex((e) => e.label === data.label && e?._id?.toString() !== _id);
            if (foundIndex > -1) { throw new Error('VoucherAlreadyExist') }
            data.dates = { ...data.dates, updated: new Date().valueOf() }
            return await SupplierVouchersController.suppliervouchersService.update({ _id }, data);
        } catch (error) { throw error; }
    }

}