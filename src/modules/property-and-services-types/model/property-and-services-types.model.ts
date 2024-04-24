import { Voucher } from "modules/vouchers";

export class PropertyAndServicesType {
    _id?: string;
    label?: string;
    vouchers?: Voucher[];
    dates?: {
        created?: number;
        updated?: number;
    };
    description?: string;
    category?: PropertyAndServicesTypeCategories;
}

export enum PropertyAndServicesTypeCategories {
    TRANSFER = 'transfer',
    DOCUMENTARY = 'documentary',
    CLEARANCE = 'clearance',
    TRAVEL = 'travel',
}
