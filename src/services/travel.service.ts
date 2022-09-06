import { isEmpty } from 'lodash';
import { encode, decode } from './helpers/url-crypt/url-crypt.service.helper';
import * as helper from './helpers/visa-operations.service.helper';
import { commonService } from './common.service';
import { logger } from '../winston';
import { config } from '../config';
import * as generateId from 'generate-unique-id';
import moment = require('moment');
import { travelsCollection } from '../collections/travel.collection';
import { filesService } from './files.service';
import { Travel, TravelAttachement } from '../models/travel';
import { OpeVisaStatus } from '../models/visa-operations';


export const travelService = {


    insertTravel: async (travel: Travel): Promise<any> => {
        try {

            // Set request status to created
            travel.status = OpeVisaStatus.WAITING;

            // Set travel creation date
            travel.dates = { ...travel.dates, created: moment().valueOf() };

            // insert permanent transfers
            travel.travelRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`;

            if (!isEmpty(travel.proofTravel.proofTravelAttachs)) {
                travel.proofTravel.proofTravelAttachs = await Promise.all(travel.proofTravel.proofTravelAttachs.map(async (e) => {
                    return await travelService.postAttachement(travel.travelRef.toString(), e);
                }));
            }

            const result = await travelsCollection.insertTravel(travel);

            //TODO send notification

            const data = { _id: result };

            return data;

        } catch (error) {
            logger.error(`travel creation failed \n${error?.name} \n${error?.stack}`);
            return error;
        }
    },

    getTravels: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;
            return await travelsCollection.getTravels(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting travel data \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getTravelById: async (id: string) => {
        try {
            return await travelsCollection.getTravelById(id);
        } catch (error) {
            logger.error(`\nError getting travel data \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getTravelsBy: async (data: any) => {
        try {
            return await travelsCollection.getTravelsBy(data);
        } catch (error) {
            logger.error(`\nError getting travel data by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateTravelsById: async (id: string, data: any) => {
        try {
            return await travelsCollection.updateTravelsById(id, data);
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    generateExportLinks: async (id: string, data: any) => {

        const { path, label, contentType } = data;

        const travel = await travelsCollection.getTravelById(id);

        if (!travel) { return new Error('TravelDataNotFound') }

        const attachement = travel.proofTravel.proofTravelAttachs.find((elt) => elt.path === path);

        if (!attachement) { return new Error('AttachementNotFound') }

        const file = filesService.readFile(path);

        if (!file) { return new Error('Forbbiden'); }

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { path, ttl, id, label, contentType };

        const code = encode(options);

        const basePath = `${config.get('basePath')}/travels/${id}/attachements/export`

        return {
            link: `${config.get('baseUrl')}${basePath}/${code}`
        }
    },

    generateExportData: async (id: string, code: string) => {
        let options: any;

        try {
            options = decode(code);
        } catch (error) {
            return new Error('BadExportCode');
        }

        const { ttl, path, label, contentType } = options;

        if ((new Date()).getTime() >= ttl) {
            return new Error('ExportLinkExpired');
        }
        const data = filesService.readFile(path);
        const buffer = Buffer.from(data, 'base64');

        const fileName = `export_${new Date().getTime()}-${path}`

        return { contentType, fileContent: buffer, fileName };

    },
    generateExportView: async (id: string, path: any) => {
        try {

            const request = await travelsCollection.getTravelById(id);
            if (!request) { return new Error('OperatonNotFound') }
            const fileContent = filesService.readFile(path);
            const contentType = helper.getContentTypeByExtension(path.split('.')[1]);
            const fileName = `export_${new Date().getTime()}-${path}`
            return { contentType, fileContent, fileName };
        } catch (error) {
            logger.error(`\nError generateExportView \n${error.message}\n${error.stack}\n`);
            return error;
        }

    },
    postAttachement: async (ref: string, attachement: TravelAttachement) => {
        try {
            const { content, label, contentType } = attachement;
            delete attachement.content
            const date = moment().format('MM-YY');
            const path = `${date}/${ref}`;
            const extension = helper.getExtensionByContentType(contentType);
            const filename = `${date}_${ref}_${label}${extension}`;
            filesService.writeFile(content, path, filename);
            attachement.path = `${path}/${filename}`;
            attachement.name = filename;
            return attachement;
        } catch (error) {
            logger.error(`\nError post attachement \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
};
