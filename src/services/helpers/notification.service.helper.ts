import * as readFilePromise from 'fs-readfile-promise';
import * as handlebars from 'handlebars';
import { logger } from '../../winston';
import { config } from '../../config';
import { get } from 'lodash';

let templateVisaDepassment: any;
let templateDetectTravel: any;
let templateRejectStep: any;
let templateDeclaration


(async () => {
    templateVisaDepassment = await readFilePromise(__dirname + '/templates/visa-depassment-mail.template.html', 'utf8');
    templateDetectTravel = await readFilePromise(__dirname + '/templates/travel-detect-mail.template.html', 'utf8');
    templateRejectStep = await readFilePromise(__dirname + '/templates/travel-reject-step.template.html', 'utf8');
    templateDeclaration = await readFilePromise(__dirname + '/templates/travel-declaration-mail.template.html', 'utf8');

})();

const actionUrl = `${config.get('baseUrl')}/home`;

export const generateMailVisaDepassment = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            start: `${get(info, `start`)}`,
            total: `${get(info, `total`)}`,
            ceilling: `${get(info, `ceilling`)}`,
            created: `${get(info, 'created')}`,
            link: `${get(info, 'link')}`,
            actionUrl
        }

        const template = handlebars.compile(templateVisaDepassment);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html visa depassement mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};


export const generateMailFormalNotice = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            actionUrl
        }

        const template = handlebars.compile(templateVisaDepassment);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html visa depassement mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};

export const generateMailTravelDetect = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            start: `${get(info, `start`)}`,
            card: `${get(info, `card`)}`,
            created: `${get(info, 'created')}`,
            actionUrl
        }

        const template = handlebars.compile(templateDetectTravel);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html travel detected mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};


export const generateMailTravelDeclaration = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            start: `${get(info, `start`)}`,
            end: `${get(info, `end`)}`,
            created: `${get(info, 'created')}`,
            ceiling: `${get(info, 'ceiling')}`,
            actionUrl
        }

        const template = handlebars.compile(templateDetectTravel);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html travel detected mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};


export const generateMailRejectStep = (info: any) => {

    try {

        const data = {
            civility: `${get(info, 'civility')}`,
            name: `${get(info, 'name')}`,
            start: `${get(info, `start`)}`,
            step: `${get(info, `step`)}`,
            reason: `${get(info, 'reason')}`,
            link: `${get(info, 'link')}`,
            actionUrl
        }

        const template = handlebars.compile(templateRejectStep);

        const html = template(data);

        return html;

    } catch (error) {
        logger.error(`html visa depassement mail generation failed. \n${error.name}\n${error.stack}`);
        return error;
    }

};