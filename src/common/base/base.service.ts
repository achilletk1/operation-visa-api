import { logger } from "winston-config";

export class BaseService {

  protected logger;

  constructor() { this.logger = logger; }

}
