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
    TRAVEL = 100,
    TRANSFER = 200,
    DOCUMENTARY = 300,
    CLEARANCE = 400,
}