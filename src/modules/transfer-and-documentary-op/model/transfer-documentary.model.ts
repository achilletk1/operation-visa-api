import { OpeVisaStatus, VisaOperationsAttachment } from "modules/visa-operations";
import { Supplier } from "modules/suppliers";
import { User } from "modules/users";

export enum Operations {
  TRANSFER = 'transfer',
  DOCUMENTARY = 'documentary',
  CLEARANCE = 'clearance',
}

export class Operation {
  _id?: any;
  status?: OpeVisaStatus;
  created_at?: number;
  dates?: {
    created: number;
    updated?: number;
  };
  proofOperationAttachs?: VisaOperationsAttachment[];
  user?: Partial<User>;
  operationType?: Operations;
  object?: string;
  amount?: number;
  Supplier?: Supplier;
  operationReason?: string;
  documentaryType?: string;
  clearanceType?: string;
  clearanceRef?: string
}

