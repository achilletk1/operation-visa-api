import { visaTransactionsFilesCollection } from '../collections/visa-transactions-files.collections';
import { encode, decode } from './helpers/url-crypt/url-crypt.service.helper';
import  helper from './helpers/visa-operations.service.helper';
import { filesCollection } from '../collections/files.collection';
import { commonService } from './common.service';
import { logger } from '../winston';
import { config } from '../config';
import moment = require('moment');


export const visaTransactionsFilesService = {

    getVisaTransactionsFiles: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;
            return await visaTransactionsFilesCollection.getVisaTransactionsFiles(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting visa operations \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getVisaTransactionsFilesById: async (id: string) => {
        try {
            return await visaTransactionsFilesCollection.getVisaTransactionsFilesById(id);
        } catch (error) {
            logger.error(`\nError getting vis transactions \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getVisaTransactionsFilesBy: async (data: any) => {
        try {
            return await visaTransactionsFilesCollection.getVisaTransactionsFilesBy(data);
        } catch (error) {
            logger.error(`\nError getting visa trnsactions by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateVisaTransactionsFilesById: async (id: string, data: any) => {
        try {
            return await visaTransactionsFilesCollection.updateVisaTransactionsFilesById(id, data);
        } catch (error) {
            logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    generateExportLinks: async (id: any, data: any) => {

        const { key, label } = data

        const file: any = await filesCollection.getFile({ key });
        if (!file) {return new Error('Forbbiden');}

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { key, ttl, label };

        const code = encode({ ...options });

        const basePath = `${config.get('basePath')}/visa-transactions-files/${id}/export`

        return {
            link: `${config.get('baseUrl')}${basePath}/${code}`
        }
    },
    generateExportData: async (id: string, code: string) => {
        let options;

        try {
            options = decode(code);
        } catch (error) {
            return new Error('BadExportCode');
        }

        const { key, ttl, label } = options;

        if ((new Date()).getTime() >= ttl) {
            return new Error('ExportLinkExpired');
        }
        const datas: any = await filesCollection.getFile({ key });
        const buffer = Buffer.from(datas?.value, 'base64');
        const extension = label.split('.')[1];
        const format = helper.getContentTypeByExtension(extension)
        const fileName = `${label}`;

        return { contentType: `${format}`, fileContent: buffer, fileName };

    }


};
