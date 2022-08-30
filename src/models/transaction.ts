export enum TransactionType {
  BCI_TRANSFER = 101,
  CEMAC_TRANSFER = 102,
  PERMANENT_TRANSFER = 103,
  PERMANENT_TRANSFER_FAILED = 104,
  BANK_TO_WALLET = 201,
  WALLET_TO_BANK = 202,
  BILL_PAYMENT = 203,
  MERCHANT_PURCHASE = 204,
  REMITTANCE = 205,
  CARDLESS_WITHDRAWAL = 206,
  BANK_TO_WALLET_OPERATOR = 301,
  WALLET_TO_BANK_OPERATOR = 302,
  AIRTIME_OPERATOR = 303,
  BANK_MINI_STATEMENT = 304,
  BANK_BALANCE = 305,
  LINKING = 306,
  DELINKING = 307
}
export enum gimacTransactionStatus {
  NOTEXIST = 100,
  CONFORME = 200,
  NOTCONFORME = 300,
  RESOLVED = 400
}

export enum TransactionStatus {
  INITIATED = 100,
  CONFIRMED = 200,
  ERROR = 300,
  PENDING = 400,
  CANCELLED = 500
}

export interface Transaction {
  _id?: string;
  otp?: any;
  sens?: string; // incoming (GIMAC-LONDO), outcoming(LONDO-GIMAC)
  userId?: string;
  dates?: {
    created?: number;
    paid?: number;
    unpaid?: number;
  };
  internalRef?: string;
  type?: TransactionType; // 101: BCI transfer;  102: CEMAC transfer;  201:Bank-to-wallet 202:Wallet-to-bank 203:bill payment 204:merchant purchase 205:remittance 206: cardless withdrawal
  amounts?: {
    amount?: number;
    commission?: number;
    total?: number;
  };
  status?: TransactionStatus;    // 100: Initiated (Created);  200: confirmed (payed) 300: error 400: pending
  label?: string;                // Description de la transaction
  message?: string;
  commission?: {
    gimac?: CommissionValue;
    mtn?: CommissionValue;
    airtel?: CommissionValue;
  };
  originator?: Originator;
  beneficiary?: BeneficiaryItem;
  transactionId?: string;
  isNotSubscriber?: boolean;
  gimacBody?: GimacBody;
  transferDay?: number; // frequence d'execution de la transaction
  signature?: any;
  airtelBody?: AirtelBody;
  mtnBody?: MtnBody;
}

export interface Originator {
  _id?: string;
  fname?: string;
  lname?: string;
  tel?: string;
  ncp?: string;
  email?: string;
  userId?: string;
  clientCode?: any;
  age?: string;
  clc?: string;
  walletRecipient?: {            // Wallet recipient for operator transaction
    walletNcp?: string;
    walletAge?: string;
    walletNumber?: string;
    providerCode?: number;
    providerName?: string;
  };
}

export interface BeneficiaryItem {
  label?: any;          // beneficiary name
  fname?: string;
  lname?: string;
  email?: string;
  clientCode?: string;
  age?: {
    code?: string;
    label?: string;
  };
  ncp?: string;
  bank?: {
    name?: string;
    bankCode?: string;
  };
  contry?: {
    code?: string;
    icon?: string;
    label?: string;
  };
  number?: string;         // Beneficiary identication number, it is optionnal
  enabled?: boolean;
  userId?: string;
  _id?: string;
  walletRecipient?: {            // Wallet recipient for operator transaction
    walletNcp?: string;
    walletAge?: string;
    walletNumber?: string;
    providerCode?: number;
    providerName?: string;
  };
}

export interface CommissionValue {
  BCI?: number;
  MTN?: number;
  AIRTEL?: number;
  GIMAC?: number;
  TTE?: number;
  TVA?: number;
  PARTICIPANT?: number;
}

export interface Bill {
  billRef?: string;
  createTime?: number;
  dueTime?: number;
  description?: number;
  dueAmount?: number;
  currency?: number;
  status?: string;
}

export interface GimacBody {
  intent?: string; // type de transaction
  createtime?: number;
  state?: any;
  walletdestination?: any;
  amount?: number;
  walletsource?: any
  tomember?: any;
  updatetime?: number;
  acquirertrxref?: string;
  frommember?: any;
  expirytime?: number;
  sendermobile?: string;
  receivermobile?: string;
  description?: string;
  vouchercode?: string;
  issuertrxref?: string; // Reference interne de la transaction (id)
  currency?: number; // devise au code ISO
  validityduration?: number; // validité du voucher code en secondes
  billList?: Bill[];
  response?: any;
  sendercustomerdata?: any;
  receivercustomerdata?: any;
  gimacTransactionData?: any;
};

export interface MtnBody {
  amount?: string;
  currency?: string;
  externalId?: string;
  payee?: {
    partyIdType?: string;
    partyId?: string;
  },
  payerMessage?: string;
  payeeNote?: string;
  state?: string;
  response?: any;
  transactionData?: any;
  sens?: 'outcoming' | 'incoming';  // outcoming means: btw or wtb are initiated by BCI    and   incoming means: btw or wtb are initiated by MTN (ECW)
  type?: number;
  bcitrxref?: string;
  creationTime?: any;
  updateTime?: any;
  isNotSubscriber?: boolean;
  isPushToAnyAccount?: boolean;
  sold?: number;
  isUssdRequest?: boolean;
  sendingfri?: string;
  receivingfri?: string;
  providertransactionid?: string;
  referenceid?: string;
  fromfri?: string;
  tofri?: string;
  externaltransactionid?: string;
  walletNumber?: string;
  source?: 'BCINET' | 'BCIONLINE';
  paymentCompleted?: { state?: boolean; response?: string; };
  withdrawCompleted?: { state?: boolean; response?: string; };
};

export interface AirtelBody {
  transactionData?: any;
  sens?: 'incoming' | 'outcoming';
  type?: number;
  account?: any;
  lname?: any;
  fname?: any;
  currency?: any;
  airteltrxref?: any;
  createtime?: any;
  countryCode?: any;
  amount?: any;
  wallet?: any;
  external1?: any;
  external2?: any;
  token?: string;
  ussdCode?: string;
  bcitrxref?: string;
  updatetime?: number;
  state?: 'success' | 'unsuccessfull';
  initResponse?: any;
  response?: any;
  isUssdRequest?: boolean;
}
