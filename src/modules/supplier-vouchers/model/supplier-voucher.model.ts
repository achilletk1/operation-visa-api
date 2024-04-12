import { User } from "modules/users";

export interface SupplierVoucher {
    _id?: string;
    label?: string;
    extension?: string;
    supplierType?: SupplierTypes;
    description?: string;
    isRequired?: boolean;
    user?: User;
    dates?:{
      created?:number,
      updated?:number
    }
  }

  
export enum SupplierTypes {
    PHYSICAL_PERSON = 100,
    CORPORATE = 200,
  }
  