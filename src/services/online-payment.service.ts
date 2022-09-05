import { onlinePaymentsCollection } from './../collections/online-payment.collection';
import { OperationStatus, OnlinePayment } from '../models/visa-operations';
import { encode, decode } from './helpers/url-crypt/url-crypt.service.helper';
import * as helper from './helpers/visa-operations.service.helper';
import { commonService } from './common.service';
import { logger } from '../winston';
import { config } from '../config';
import * as generateId from 'generate-unique-id';
import moment = require('moment');
import { filesService } from './files.service';


export const onlinePaymentsService = {


    insertOnlinePayment: async (onlinepayment: OnlinePayment): Promise<any> => {
        try {

            // Set request status to created
            onlinepayment.status = OperationStatus.PENDING;
            // Set travel creation date
            onlinepayment.dates = { ...onlinepayment.dates, created: moment().valueOf() };
            // insert permanent transfers
            const result = await onlinePaymentsCollection.insertVisaOnlinePayment(onlinepayment);

            //TODO send notification

            const data = { _id: result };

            return data;

        } catch (error) {
            logger.error(`travel creation failed \n${error?.name} \n${error?.stack}`);
            return error;
        }
    },

    getOnlinePayments: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;
            return await onlinePaymentsCollection.getOnlinePayments(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting travel data \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getOnlinePaymentById: async (id: string) => {
        try {
            return await onlinePaymentsCollection.getOnlinePaymentById(id);
        } catch (error) {
            logger.error(`\nError getting travel data \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getOnlinePaymentsBy: async (data: any) => {
        try {
            return await onlinePaymentsCollection.getOnlinePaymentsBy(data);
        } catch (error) {
            logger.error(`\nError getting travel data by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateOnlinePaymentsById: async (id: string, data: any) => {
        try {
            return await onlinePaymentsCollection.updateOnlinePaymentsById(id, data);
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    /*  generateExportLinks: async (id: string, data: any) => {
 
         const { path, label, contentType } = data;
 
         const travel = await onlinePaymentsCollection.getOnlinePaymentById(id);
 
         if (!travel) { return new Error('OnlinePaymentDataNotFound') }
 
         const attachement = travel.travelAttachments.find((elt) => elt.path === path);
 
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
 
             const request = await onlinePaymentsCollection.getOnlinePaymentById(id);
             if (!request) { return new Error('OperatonNotFound') }
             const fileContent = filesService.readFile(path);
             const contentType = helper.getContentTypeByExtension(path.split('.')[1]);
             const fileName = `export_${new Date().getTime()}-${path}`
             return { contentType, fileContent, fileName };
         } catch (error) {
             logger.error(`\nError generateExportView \n${error.message}\n${error.stack}\n`);
             return error;
         }
 
     }, */
    /*   postAttachement: async (id: string, attachement: Attachement) => {
          try {
              const { content, label, contentType } = attachement;
              delete attachement.content
              const date = moment().format('MM-YY');
              const path = `${date}/${id}`;
              const extension = helper.getExtensionByContentType(contentType);
              const filename = `${date}_${id}_${label}${extension}`;
              filesService.writeFile(content, path, filename);
              attachement.path = `${path}/${filename}`;
              return attachement;
          } catch (error) {
              logger.error(`\nError post attachement \n${error.message}\n${error.stack}\n`);
              return error;
          }
      }, */
};
