import { SupplierTypes } from "modules/supplier-vouchers/model";
import { User } from "modules/users";
import { Voucher } from "modules/vouchers";

export interface Supplier {
    _id?: string;
    name?: string;
    user?: User;
    supplierType?: SupplierTypes;
    description?:string;
    attachs?: Voucher[];
    isAnnuaryExist?: boolean;
    dates?:{
      created?:number,
      updated?:number
    }
  }

  
