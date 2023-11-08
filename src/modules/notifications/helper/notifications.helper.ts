import { OpeVisaStatus } from "modules/visa-operations";
import { config } from "convict-config";
import handlebars from "handlebars";
import { readFileSync } from 'fs';

const actionUrl = `${config.get('baseUrl')}/home`;

const templateVisaMail = readFileSync(__dirname + '/templates/visa-mail.template.html', 'utf8');

export const generateMailByTemplate = (content: any) => {
    try {

        const data = {
            ...content,
            actionUrl,
            civility: `Mr/Mme`,
        }

        const template = handlebars.compile(templateVisaMail);

        const html = template(data);

        return html;

    } catch (error) { throw error; }
};

export function getStatusExpression(status: OpeVisaStatus): string {
    const dataLabel: any = { 100: 'NON RENSEGNEE', 200: 'VALIDÉE', 300: 'REJETÉE', 400: 'EN COURS' };
    return dataLabel[status];
}
