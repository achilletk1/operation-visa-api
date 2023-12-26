import { NotificationsRepository } from "./notifications.repository";
import { goToTheLine, replaceVariables } from "common/helpers";
import { generateMailByTemplate } from "./helper";
import { TemplateForm } from "modules/templates";
import { CrudService } from "common/base";
import { NotificationsController } from "./notifications.controller";

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
            if (!data) { return new Error('MailNotFound'); }
            let email = await goToTheLine(data?.content, false);
            const pdfString = generateMailByTemplate({ email, name: data?.name });
            return { data: pdfString };
        } catch (error) { throw error; }
    }

    async saveNotification(data: any): Promise<any> {
        try {
            if (!data) { return new Error('MailNotFound'); }
            let email = await goToTheLine(data?.message, false);
             data.message = (data.format == 200) ? generateMailByTemplate({ email, name: data?.name }) : email;
            return await NotificationsController.notificationsService.create(data as any);
        } catch (error) { throw error; }
    }
}