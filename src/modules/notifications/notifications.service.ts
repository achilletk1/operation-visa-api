import { NotificationsRepository } from "./notifications.repository";
import { replaceVariables } from "common/helpers";
import { generateMailByTemplate } from "./helper";
import { TemplateForm } from "modules/templates";
import { CrudService } from "common/base";

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

}