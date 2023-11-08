import { Voucher } from "modules/voucher";

export interface LongTravelType {
    _id?: string;
    label?: string;
    code?: number;
    vouchers?: Voucher[];
    dates?: {
        created?: number;
        updated?: number;
    };
    description?: string;
}