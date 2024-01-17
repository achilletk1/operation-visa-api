import { VouchersRepository } from "./vouchers.repository";
import { VouchersController } from "./vouchers.controller";
import { CrudService } from "common/base";
import { Voucher } from "./model";

export class VouchersService extends CrudService<Voucher> {

    static vouchersRepository: VouchersRepository;

    constructor() {
        VouchersService.vouchersRepository = new VouchersRepository();
        super(VouchersService.vouchersRepository);
    }

    async insertVoucher(data: Voucher) {
        try {
            const vouchers = await VouchersController.vouchersService.findAll({});
            const foundIndex = vouchers?.data?.findIndex((e) => e.label === data.label);
            if (foundIndex > -1) { throw new Error('VoucherAlreadyExist'); }
            return await VouchersController.vouchersService.create(data);
        } catch (error) { throw error;}
    }

    async updateVoucherById(_id: string, data: any) {
        try {
            const vouchers = await VouchersController.vouchersService.findAll({});
            const foundIndex = vouchers?.data?.findIndex((e) => e.label === data.label && e?._id?.toString() !== _id);
            if (foundIndex > -1) { throw new Error('VoucherAlreadyExist') }
            return await VouchersController.vouchersService.update({ _id }, data);
        } catch (error) { throw error;}
    }

}