import { PropertyAndServicesTypeCategories } from "modules/property-and-services-types";
import { VisaOperationsAttachment } from "modules/visa-operations";
import { User } from "modules/users";

export interface TransferStakeholder {
  _id?: string;
  name?: string;
  user?: User;
  type?: PropertyAndServicesTypeCategories;
  category?: TransferStakeholderCategories;
  description?: string;
  attachments?: VisaOperationsAttachment[];
  isTheContactBook?: boolean;
  dates?: {
    created?: number,
    updated?: number,
  }
}

export enum TransferStakeholderCategories {
  PHYSICAL_PERSON = 100,
  CORPORATE = 200,
}

