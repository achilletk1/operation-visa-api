import { OpeVisaStatus } from "modules/visa-operations";
import { NotificationFormat, NotificationStatus } from "../enum";
import { Notification } from '../model';
import { config } from "convict-config";
import handlebars from "handlebars";
import { readFileSync } from 'fs';

const actionUrl = `${config.get('baseUrl')}/home`;

const templateVisaMail = readFileSync(__dirname + '/templates/visa-mail.template.html', 'utf8');

export const generateMailByTemplate = (content: any) => {
    try {

        const data = {
            ...content,
            image: config.get('template.image'),
            color: config.get('template.color'),
            actionUrl,
            civility: `Mr/Mme`,
        }

        const template = handlebars.compile(templateVisaMail);

        const html = template(data);

        return html;

    } catch (error) { throw error; }
};

export function getStatusExpression(status: OpeVisaStatus | undefined): string {
    const dataLabel: any = { 100: 'NON RENSEGNEE', 200: 'VALIDÉE', 300: 'REJETÉE', 400: 'EN COURS', 0: '' };
    return dataLabel[status || 0];
}

export function generateNotification(object: string, format: NotificationFormat, message: string, receiver: string | undefined, id?: string, attachments?: any, key?: any): Notification {
    const email = format === NotificationFormat.MAIL ? receiver : undefined;
    const tel = format === NotificationFormat.SMS ? receiver : undefined;
    const notification: Notification = { object, format, message, email, tel, id, dates: { createdAt: new Date().valueOf(), sentAt: new Date().valueOf(), }, status: NotificationStatus.CREATED, attachments, key };
    return notification;
}
