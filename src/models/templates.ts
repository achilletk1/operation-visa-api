import { User } from "./user";

export enum TemplateType {
  ONLINEPAYMENT = 100,
  TRAVEL = 200,
}

export interface TemplateForm {
    _id?: string;
    label?: string;
    desc?: string;

    objet?:  {
      english?:string,
      french?:string,
    };

    templateType?: TemplateType;
    sendType?: number; // 100: SMS; 200: Email
    notifyPeriod?: string;

    email?: {
      english?:string,
      french?:string,
    };

    sms?:  {
      english?:string,
      french?:string,
    };
    enabled?: boolean;
    author?: User;
    dates?: {
        created?: number;
        updated?: number;
    };
}