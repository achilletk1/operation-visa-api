export interface VisaOperations {
  _id?: string;
  clientCode?: string;
  userId?: string;
  currentMonth?: number;
  ncp?: string;
  nbrTransactions?: {
    tpew?: number; // Retrait et paiement tpe
    onp?: number; // paiement en ligne
  };
  amounts?: {
    tpew?: number; // Retrait et paiement tpe
    onp?: number; // paiement en ligne
  };
  cards?: any[];
  date?: {
    created?: number;
    updated?: number;
  };
  operationTypes?: OperationType[];
  attachements?: Attachement[];
  status?: OperationStatus; // 100: aucun upload, 101: au moins un upload, 200: upload complet, en cours, 201: accepté, 202: refusé
  rejectReason?:string;
}

export interface Attachement {
  code?: string; // files collection Id
  status?: AttachementStatus;
  label?: string;
  type?: number; // 100:retrait GAB, 200: paiement tpe, 300:paiement en ligne
  contentType?: string;
  date?: {
    created?: number;
    updated?: number;
  };
  rejectReason?: string;
  isRequired?: boolean;
  extensions?: string;
}


export enum AttachementStatus {
  UNAVAILABLE = 100, // When attachement is not uploaded
  PENDING = 200, // When attachechement is uploaded but not changed
  ACCEPTED = 300, // When attachement is accepted
  REJECTED = 400, // When attachement is refused

}

export enum OperationType {
  TPE = 100,
  ONP = 200
}
export enum OperationStatus {
  UNAVAILABLE = 100, // aucun upload,
  AVAILABLE = 101, // au moins un upload,
  PENDING = 200, //  upload complet , en cours
  ACCEPTED = 201, // accepté
  REJECTED = 202, //  refusé
}

export interface FileAttachement {
  label?: string;
  extensions?: string;
  isRequired?: boolean;
}

export interface SettingFile {
  _id?: string;
  label?: string; // type d'opération(retrait GAB & paiement ou paiement en ligne)
  type?: number; // 100:retrait GAB & paiement tpe, 200:paiement en ligne
  date?: {
    created?: number;
    updated?: number;
  };
  files?: FileAttachement[];
}

export interface VisaTransaction {
  _id?: string;
  clientCode?: string;
  fullName?: string;
  beneficiary?: string;
  amount?: number;
  date?: number;
  type: string;
  ncp?: string;
  age?: string;
  card?: {
    code: string;
    label: string;
  };
  country?: string;
  category?: string;
  currentMonth?: number;
}
export interface VisaCeiling {
  _id: string;
  type: number;
  value: number;
  description: string;
  date: {
    created?: number;
    updated?: number;
  };
  user?: {
    _id: string;
    fullName: string;
  };
}

