import { SupplierRepository } from "./supplier.repository";
import { SupplierController } from "./supplier.controller";
import { CrudService } from "common/base";
import { Supplier } from "./model";

export class SupplierService extends CrudService<Supplier> {

    static SupplierRepository: SupplierRepository;

    constructor() {
        SupplierService.SupplierRepository = new SupplierRepository();
        super(SupplierService.SupplierRepository);
    }

    async insertSupplier(data: Supplier) {
        try {
            data.dates = { ...data.dates, created: new Date().valueOf() };
            const supplier = await SupplierController.supplierService.findAll({});
            const foundIndex = supplier?.data?.findIndex((e) => e.name === data.name);
            if (foundIndex > -1) { throw new Error('SupplierAlreadyExist'); }
            return await SupplierController.supplierService.create(data);
        } catch (error) { throw error; }
    }

    async updateSupplierById(_id: string, data: any) {
        try {
            let supplier!: Supplier;
            try { supplier = await SupplierController.supplierService.findOne({ filter: { _id } }) } catch { }
            if (!supplier) { throw new Error('SupplierNotFound'); }
            data.dates = { ...data.dates, updated: new Date().valueOf() }
            return await SupplierController.supplierService.update({ _id }, data);
        } catch (error) { throw error; }
    }

}