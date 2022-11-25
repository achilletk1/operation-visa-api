import { filesService } from './files.service';
import { commonService } from './common.service';
import moment = require("moment");
import { config } from "../config";
import { decode, encode } from "./helpers/url-crypt/url-crypt.service.helper";
import  * as helper from "./helpers/exports.helper";
import * as visaHelper from "./helpers/visa-operations.service.helper";
import { logger } from '../winston';

export const exportService = {


    generateExportVisaTransactionLinks: async (fields: any) => {

        const { end, start, clientCode } = fields;
        commonService.timeout(5000);
        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { end, start, ttl, clientCode };

        const code = encode(options);

        const basePath = `${config.get('basePath')}/export/visa-transactions`

        return {
            link: `${config.get('baseUrl')}${basePath}/${code}`
        }
    },

    generateExportVisaTransactionData: async (code: string) => {
        let options: any;

        try {
            options = decode(code);
        } catch (error) {
            return new Error('BadExportCode');
        }

        const { end, start, ttl, clientCode } = options;

        if ((new Date()).getTime() >= ttl) {
            return new Error('ExportLinkExpired');
        }
        const transaction = helper.visaTransaction;
        const data = helper.generateVisaTransactionExportXlsx(transaction);
        const buffer = Buffer.from(data, 'base64');

        const fileName = `export_${new Date().getTime()}-transaction_visa`

        return { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer, fileName };

    },

    generateExportAttachmentLinks: async (fields: any) => {

        const { path, contentType } = fields;
        commonService.timeout(5000);
        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { ttl, path, contentType };

        const code = encode(options);

        const basePath = `${config.get('basePath')}/export/attachement`

        return {
            link: `${config.get('baseUrl')}${basePath}/${code}`
        }
    },


    generateExportVisaAttachmentData: async (code: string) => {
        let options: any;

        try {
            options = decode(code);
        } catch (error) {
            return new Error('BadExportCode');
        }

        const { ttl, path, contentType, fileName } = options;

        if ((new Date()).getTime() >= ttl) {
            return new Error('ExportLinkExpired');
        }
        const data = filesService.readFile(path);
        const buffer = Buffer.from(data, 'base64');
        const extension = visaHelper.getExtensionByContentType(contentType)
        const name = `export_${new Date().getTime()}-${fileName}.${extension}`;

        return { contentType, fileContent: buffer, fileName: name };

    },


    generateExportVisaAttachmentView: async (query: any) => {
        try {
            const { path } = query;
            const data = filesService.readFile(path);
            return data;

        } catch (error) {
            logger.error(`\nError getting attachment data \n${error.message}\n${error.stack}\n`);
            return error;
        }

    },
}
