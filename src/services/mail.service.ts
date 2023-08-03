import { cbsService } from './cbs.service';
import { logger } from '../winston';
import * as formatHelper from './helpers/format.helper';
import { TemplateForm } from '../models/templates';
import * as NotificationHeper from './helpers/notification.service.helper'


export const mailService = {

    getMailVariables: async () => {
        try {
            const variables = await cbsService.getCbsUserVariables();
            variables.push(...[
                'SYSTEM_TODAY_LONG',
                'SYSTEM_TODAY_SHORT',
            ]);

            return variables;
        } catch (error) {
            logger.error(`\nError getting letters variables \n${error.message}\n${error.stack}\n`);

        }
    },

    generateExportView: async (data: TemplateForm) => {
        try {
            if (!data) { return new Error('MailNotFound') }
            let emailDataFr = await formatHelper.replaceVariables(data['fr'], {}, false);
            let emailDataEn = await formatHelper.replaceVariables(data['en'], {}, false);

            const pdfStringEn = await NotificationHeper.generateMailByTemplate({ ...emailDataEn, name: '[UTILISATEUR]' });

            if (pdfStringEn instanceof Error) { return pdfStringEn; }

            const pdfStringFr = await NotificationHeper.generateMailByTemplate({ ...emailDataFr, name: '[UTILISATEUR]' });

            if (pdfStringFr instanceof Error) { return pdfStringFr; }

            return { en: pdfStringEn, fr: pdfStringFr };
        } catch (error) {
            logger.error(`\nError generateExportView \n${error.message}\n${error.stack}\n`);
            return error;
        }

    },

};
