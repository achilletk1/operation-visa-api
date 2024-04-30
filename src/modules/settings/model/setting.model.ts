import { User } from "modules/users";

export class Setting {
    _id?: any;
    key?: string;
    label?: string;
    created_at?: number;
    updated_at!: { user: Partial<User>, date: number; }[];
    data?: string | number | any;
}


export enum settingsKeys {
    MAX_UPLOAD_FILE_SIZE = 'max_upload_file_size',
    TTL_VALUE = 'ttl_value',
    OTP_STATUS = 'otp_status',
    MAIL_GATEWAY = 'mail_gateway',
    EMAIL_BANK = 'email_bank',
    SHORT_TRAVEL_DEADLINE_PROOF_TRAVEL = 'short_travel_deadline_proof_travel',
    SHORT_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES = 'short_travel_deadline_detailed_statement_expenses',
    LONG_TRAVEL_DEADLINE_PROOF_TRAVEL = 'long_travel_deadline_proof_travel',
    LONG_TRAVEL_DEADLINE_DETAILED_STATEMENT_EXPENSES_MONTH = 'long_travel_deadline_detailed_statement_expenses_month',
    ONLINE_PAYMENT_DEADLINE_JUSTIFY = 'online_payment_deadline_justifying',
    IMPORT_GOODS_DEADLINE_JUSTIFY = 'import_goods_deadline_justifying',
    IMPORT_SERVICE_DEADLINE_JUSTIFY = 'import_service_deadline_justifying',
    SENSITIVE_CUSTOMER_CODES = 'sensitive_customer_codes',
} 