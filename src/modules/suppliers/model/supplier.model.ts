import { VisaOperationsAttachment } from "modules/visa-operations";
import { SupplierTypes } from "modules/supplier-vouchers/model";
import { User } from "modules/users";

export interface Supplier {
  _id?: string;
  name?: string;
  user?: User;
  supplierType?: SupplierTypes;
  description?: string;
  attachments?: VisaOperationsAttachment[];
  isTheContactBook?: boolean;
  dates?: {
    created?: number,
    updated?: number,
  }
}


