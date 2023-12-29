import { replaceSmsVariables } from "modules/notifications/helper";
import { BaseSmsNotification } from "modules/notifications/base";
import { TemplatesController } from "modules/templates";
import { TemplateSmsEvent } from "./template.event";

export class TemplateSmsNotification extends BaseSmsNotification<TemplateSmsEvent> {
    eventData!: any;

    constructor(public notificationData: TemplateSmsEvent) {
        super(notificationData.phone, '', 'template-sms', notificationData.id, notificationData.key);
    }

    private async getNotificationBody(): Promise<string> {
        try {
            let visaTemplate = await TemplatesController.templatesService.findOne({ filter: { key: this.notificationData.key } });
            if (!visaTemplate) { throw new Error(`Template ${this.notificationData.key} Not Found`); }
        
            const templateData = replaceSmsVariables(visaTemplate[this.notificationData.lang], this.notificationData.datas, this.notificationData.lang);
        
            return templateData?.sms;
          } catch (error: any) {
            this.logger.info(`Error during sms template-sms notification generation \n${error.stack}`);
            return '';
          }
    }

    async sendTempalteNotification(): Promise<void> {
        this.body = await this.getNotificationBody();
        await this.sendNotification();
    }
}