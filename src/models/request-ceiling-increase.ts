import { User } from './user';

export enum Status {
  INITIATED = 100,
  VALIDATED = 200,
  REJECTED = 300,
  ASSIGNED = 400
}

export interface RequestCeilingIncrease {
  _id?: string;
  user?: {
    _id?: string;
    clientCode?: string;
    fullName?: string;
    tel?: string;
    email?: string;
  };
  desiredCeiling?: {
    type?: number;
    amount?: number
  };
  currentCeiling?: {
    type?: number;
    amount?: number
  };
  account?: {
    age?: string;
    ncp?: string;
    clc?: string;
  };
  assignment?: {
    assigner?: {
      _id: string;
      fname?: string;
      lname?: string;
    }
    assignered?: {
      _id: string;
      fname?: string;
      lname?: string;
      tel?: string;
      email?: string;
    }
  };
  validator?: Validator;
  status?: Status;
  desc: string;
  signature: any;
  dates?: {
    created?: number;
    assigned?: number;
    accepted?: number;
    rejected?: number;
  };
}

export interface Validator {
  validatorId?: string;
  validatorName?: string;
  // date?: number;
  isValidated?: boolean;
  rejectReason?: string;
}

export enum statusRequestCeiling {
  INPROGRESS = 100, // IN PROGRESS
  ACCEPTED = 200,  // REQUEST ACCEPTED
  REJECTED = 300, // REQUEST REJECTED
}
