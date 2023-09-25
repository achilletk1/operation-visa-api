
export interface Voucher {
  _id?: string;
  label?: string;
  extension?: string;
  description?: string;
  isRequired?: boolean;
}
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
export interface PropertyAndServicesType {
  _id?: string;
  label?: string;
  vouchers?: Voucher[];
  dates?: {
    created?: number;
    updated?: number;
  };
  description?: string;
}

export interface TemporaryFile {
  _id?: any;
  dates?: {
    created?: number;
    updated?: number;
  }
  expiresAt?: number;
  path?: string;
  fileName?: string;

}
