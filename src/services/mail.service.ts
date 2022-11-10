import { cbsService } from './cbs.service';
import { logger } from '../winston';
import * as exportsHelper from './helpers/exports.helper'
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
            const EmailContentObject ={
                Emailfr:{
                    content:data?.email?.french,
                   object:data?.obj?.french
                },
                Emailen:{
                    content:data?.email?.english,
                    object:data?.obj?.english
                }
            }
            
            const pdfStringEn = await NotificationHeper.generateVisaTemplate(EmailContentObject.Emailen,{},  true);

            if (pdfStringEn instanceof Error) { return pdfStringEn; }

            const pdfStringFr = await NotificationHeper.generateVisaTemplate(EmailContentObject.Emailfr,{},true);

            if (pdfStringFr instanceof Error) { return pdfStringFr; }

            return { en: pdfStringEn, fr: pdfStringFr };
        } catch (error) {
            logger.error(`\nError generateExportView \n${error.message}\n${error.stack}\n`);
            return error;
        }

    },

};
