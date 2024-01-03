import { goToTheLine, isDevOrStag, replaceVariables } from "common/helpers";
import { NotificationsRepository } from "./notifications.repository";
import { NotificationFormat, NotificationsType } from "./enum";
import { generateMailByTemplate } from "./helper";
import { QueueService } from "./base/base-queue";
import { TemplateForm } from "modules/templates";
import { CrudService } from "common/base";
import { QueueData } from "common/types";
import { config } from "convict-config";
import { Notification } from "./model";

export class NotificationsService extends CrudService<TemplateForm> {

    static notificationsRepository: NotificationsRepository;

    constructor() {
        NotificationsService.notificationsRepository = new NotificationsRepository();
        super(NotificationsService.notificationsRepository);
    }

    async generateExportView(data: TemplateForm) {
        try {
            if (!data) { return new Error('MailNotFound') }
            let emailDataFr = await replaceVariables(data['fr'], {}, true, false);
            let emailDataEn = await replaceVariables(data['en'], {}, true, false);

            const pdfStringEn = generateMailByTemplate({ ...emailDataEn, name: '[UTILISATEUR]' });

            const pdfStringFr = generateMailByTemplate({ ...emailDataFr, name: '[UTILISATEUR]' });

            return { en: pdfStringEn, fr: pdfStringFr };
        } catch (error) { throw error; }
    }

    async generateInstantNotificationView(data: any) {
        try {
            if (!data) { throw new Error('MailNotFound'); }
            const email = goToTheLine(data?.content, false);
            const pdfString = generateMailByTemplate({ email, name: data?.name });
            return { data: pdfString };
        } catch (error) { throw error; }
    }

    async sendAndInsertNotification(data: Notification): Promise<any> {
        try {
            if (!data) { throw new Error('MailNotFound'); }

            const { object, format, message, id, email, tel, name } = data;

            if (format === NotificationFormat.MAIL) { data.message = generateMailByTemplate({ email: goToTheLine(message, false), name }); }

            const receiver = !isDevOrStag ? tel || email || '' : (format === NotificationFormat.MAIL ? config.get('emailTest') : config.get('phoneTest'));

            const queueData: QueueData = { subject: object, receiver, body: data.message, cc: '', attachments: [], date: new Date() };

            const type = (format === NotificationFormat.MAIL) ? NotificationsType.MAIL : NotificationsType.SMS;

            const queue = new QueueService();

            await queue.insertNotification(object, format, queueData.body, tel || email, id, [], 'instantNotification');
            return await queue.add(type, queueData);
        } catch (error) { throw error; }
    }

}