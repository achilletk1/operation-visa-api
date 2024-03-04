import { StatementType } from "../enum/type.enum";

export interface StatementReport {
    type: StatementType;
    send_at?: number| null;
    base64Data: any;
    month: string
}