import { filesService } from './files.service';
import { commonService } from './common.service';
import moment = require("moment");
import { config } from "../config";
import { decode, encode } from "./helpers/url-crypt/url-crypt.service.helper";
import * as helper from "./helpers/exports.helper";
import * as visaHelper from "./helpers/visa-operations.service.helper";
import { logger } from '../winston';
import { isEmpty } from 'lodash';
import { onlinePaymentsCollection } from '../collections/online-payments.collection';
import * as exportHelper from './helpers/exports.helper';
import { travelsCollection } from '../collections/travels.collection';

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
        const transaction = []; // TODO get transactions for reporting
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

    generateOnlinePaymentExportLinks: async (fields: any) => {
        delete fields.action;
        commonService.parseNumberFields(fields);
        delete fields.name;
        delete fields.status;
        delete fields.clientCode;
        delete fields.offset;
        delete fields.limit;
        delete fields.ttl;

        const payments = await onlinePaymentsCollection.getOnlinePaymentsBy({ ...fields });
        if (isEmpty(payments)) { return new Error('OnlinePaymentNotFound'); }

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { ttl, ...fields };

        const code = encode(options);

        const basePath = `${config.get('baseUrl')}${config.get('basePath')}/export/online-payment`

        return {
            link: `${basePath}/${code}`
        }
    },

    generateOnlinePaymentExporData: async (code: any) => {
        let options;
        try {
            options = decode(code);
        } catch (error) { return new Error('BadExportCode'); }

        const { ttl } = options;
        delete options.name;
        delete options.status;
        delete options.clientCode;
        delete options.offset;
        delete options.limit;
        delete options.ttl;

        options = { ...options }
        if ((new Date()).getTime() >= ttl) { return new Error('ExportLinkExpired'); }

        const payments = await onlinePaymentsCollection.getOnlinePaymentsBy(options);

        let data;
        const excelArrayBuffer = await exportHelper.generateOnlinePaymentExportXlsx(payments);
        const buffer = Buffer.from(excelArrayBuffer);

        data = { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer };

        return data;
    },

    generateOnlinePaymentOperationsExportLinks: async (operationId: string) => {

        const payments = await onlinePaymentsCollection.getOnlinePaymentById(operationId);
        if (isEmpty(payments?.transactions)) { return new Error('MonthOnlineOperationsNotFound'); }

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { ttl, operationId };

        const code = encode(options);

        const basePath = `${config.get('baseUrl')}${config.get('basePath')}/export/payment-operationsCode`

        return {
            link: `${basePath}/${code}`
        }
    },

    generateOnlinePaymenOperationstExporData: async (code: string) => {
        let options;
        try {
            options = decode(code);
        } catch (error) { return new Error('BadExportCode'); }

        const { ttl } = options;

        options = { ...options }
        if ((new Date()).getTime() >= ttl) { return new Error('ExportLinkExpired'); }

        const operations: any = await onlinePaymentsCollection.getOnlinePaymentById(options.operationId);

        if (isEmpty(operations)) { return new Error('TransactionNotFound'); }

        let data;
        const excelArrayBuffer = await exportHelper.generateOnlineOperationsExportXlsx(operations);
        const buffer = Buffer.from(excelArrayBuffer);

        data = { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer };

        return data;
    },

    generateTravelsCeillingExportLinks: async (travelId: string) => {

        const ceilling = await travelsCollection.getTravelById(travelId);
        if (isEmpty(ceilling?.transactions)) { return new Error('OnlineCeillingNotFound'); }

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { ttl, travelId };

        const code = encode(options);

        const basePath = `${config.get('baseUrl')}${config.get('basePath')}/export/ceillingCode`

        return {
            link: `${basePath}/${code}`
        }
    },

    generateTravelsCeillingExporData: async (code: string) => {
        let options;
        try {
            options = decode(code);
        } catch (error) { return new Error('BadExportCode'); }

        const { ttl } = options;
        // delete options.travelId
        // delete options.ttl;

        options = { ...options }
        if ((new Date()).getTime() >= ttl) { return new Error('ExportLinkExpired'); }

        const ceilling: any = await travelsCollection.getTravelById(options.travelId);;

        let data;
        const excelArrayBuffer = await exportHelper.generateCeillingExportXlsx(ceilling);
        const buffer = Buffer.from(excelArrayBuffer);

        data = { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer };

        return data;
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
