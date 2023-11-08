import { isProd, isDev, isStaging, isStagingBci } from '../helpers';
import { CronInterface } from '../interfaces';
import { logger } from "winston-config";
import { config } from 'convict-config';
import cron from 'node-cron'

export class BaseCron implements CronInterface {
  cronExpressionPath!: any;
  service: any;

  startOnStagingBci = true;
  startOnStaging  = true;
  startOnProd  = true;
  startOnDev  = false;

  constructor() { }

  async start(): Promise<void> {
    if (!!this.canIStartCron()) {
      logger.info(`Start ${this.getCronName()} cron`);
      cron.schedule(config.get(this.cronExpressionPath), async () => {
        await this.service();
      });
    }
  }

  private getCronName(): string {
    const name = this.constructor.name.replace('Cron', '').split(/(?=[A-Z])/).join(' ').toLowerCase();

    return name;
  }

  private canIStartCron(): boolean {
    if (isProd && !this.startOnProd) { return false; }
    if (isStagingBci && !this.startOnStagingBci) { return false; }
    if (isStaging && !this.startOnStaging) { return false; }
    if (isDev && !this.startOnDev) { return false; }
    return true;
  }

}
