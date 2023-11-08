import { logger } from "winston-config";

export class BaseService {

  protected logger: any;

  constructor() { this.logger = logger; }

}
