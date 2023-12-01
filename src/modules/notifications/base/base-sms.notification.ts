import { NotificationFormat, NotificationsType } from "../enum";
import { isDevOrStag } from 'common/helpers';
import { QueueService } from './base-queue';
import { config } from "convict-config";

export class BaseSmsNotification<T> extends QueueService {

    protected appName = config.get('appName') || config.get('template.app');
    protected company = config.get('clientName') || config.get('template.company');

    constructor(
        public phone: string,
        public body: string,
        public keyNotification: string,
        public id?: string,
        public key?: string,
    ) {
        super();
        this.logger.info(`insert SMS ${this.keyNotification} to sending in queue to: ${phone}`);
    }

    async sendNotification() {
        if (isDevOrStag || !this.phone || !this.body) { return null; }

        try {
            if (this.keyNotification) return await this.insertNotification('', NotificationFormat.MAIL, this.body, this.phone, this.id, '', this.key);
            return await this.add(NotificationsType.SMS, { receiver: this.phone, date: new Date(), body: this.body });
        } catch (error: any) { this.logger(`Error during insertion SMS notification in queue, to ${this.phone} \n${error.stack}`); }

    }

}