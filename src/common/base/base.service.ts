import { RequestCeilingIncrease } from "modules/request-ceiling-increase";
import { OnlinePaymentMonth } from "modules/online-payment";
import { Import } from "modules/imports";
import { Travel } from "modules/travel";
import { logger } from "winston-config";

export class BaseService {

  protected logger;

  constructor() { this.logger = logger; }

}


export class commonField {

  end!: string;
  name!: string;
  date!: string;
  start!: string;
  amount!: number;
  ceiling!: number;
  receiver!: string;
  civility!: string;
  greetings!: string;
  created_at!: string;
  
  constructor(operation: Travel | OnlinePaymentMonth | Import | RequestCeilingIncrease) {
    this.civility = operation?.user?.gender === 'F' ? 'Mme' : ((operation?.user?.gender === 'M') ? 'M.' : 'M./Mme');
    this.name = operation?.user?.fullName || '';
    this.receiver = operation?.user?.email || '';
    this.greetings = `Bonjour ${this.civility} ${this.name},`;
  }

}