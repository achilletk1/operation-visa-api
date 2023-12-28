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
}
