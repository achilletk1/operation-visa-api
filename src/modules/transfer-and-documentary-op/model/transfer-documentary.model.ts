import { Supplier } from "modules/suppliers";
import { User } from "modules/users";
import { OpeVisaStatus, Validator, VisaOperationsAttachment } from "modules/visa-operations";

export enum Operations {
  TRANSFER = 100,
  DOCUMENTARY = 200,
  CLEARANCE = 300
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

