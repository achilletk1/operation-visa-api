import { get } from 'lodash';
import { usersCollection } from '../collections/users.collection';
import { onlinePaymentsCollection } from '../collections/online-payments.collection';
import { OperationStatus, OnlinePayment, OnlinePaymentStatement, Attachment, AttachementStatus, OpeVisaStatus } from '../models/visa-operations';
import { commonService } from './common.service';
import { logger } from '../winston';
import * as generateId from 'generate-unique-id';
import moment = require('moment');
import { filesService } from './files.service';
import { config } from '../config';
import { decode, encode } from './helpers/url-crypt/url-crypt.service.helper';
import * as helper from './helpers/visa-operations.service.helper'


export const onlinePaymentsService = {


    insertOnlinePaymentStatement: async (userId: string, onlinepaymentStatement: OnlinePaymentStatement): Promise<any> => {
        try {

            const user = await usersCollection.getUserById(userId);

            if (!user) { return new Error('UserNotFound'); }

            const currentMonth = +moment(onlinepaymentStatement.date).format('YYYYMM');

            let onlinePayment: OnlinePayment;
            let result: any;

            onlinepaymentStatement.statementRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`
            onlinepaymentStatement.status = OpeVisaStatus.PENDING;

            onlinePayment = await onlinePaymentsCollection.getOnlinePaymentBy({ currentMonth });

            if (!onlinePayment) {
                onlinePayment = {
                    clientCode: get(user, 'clientCode'),
                    userId,
                    dates: {
                        created: moment().valueOf(),
                    },
                    ceiling:200000,
                    amounts: 0,
                    status: OpeVisaStatus.PENDING,
                    currentMonth,
                    statements: [onlinepaymentStatement],
                    transactions: [],
                }
                result = await onlinePaymentsCollection.insertVisaOnlinePayment(onlinePayment);
            } else {
                onlinePayment.dates.updated = moment().valueOf();
                onlinePayment.statements.push(onlinepaymentStatement);
                result = await onlinePaymentsCollection.updateOnlinePaymentsById(get(onlinePayment, '_id').toString(), onlinePayment);
            }

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
    updateOnlinePaymentsById: async (id: string, data: OnlinePayment) => {
        try {

            data.statements = data.statements.map(element => {
                delete element.attachments;
                return element;
            });
            return await onlinePaymentsCollection.updateOnlinePaymentsById(id, data);
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

        postAttachment: async (id: string, data: any, attachement: Attachment) => {

            const { statementRef } = data;


            const onlinePayment = await onlinePaymentsCollection.getOnlinePaymentById(id);

            if (!onlinePayment) { return new Error('OnlinePaymentNotFound') }

            const { statements } = onlinePayment;

            const statementIndex = statements.findIndex((elt) => elt.statementRef === statementRef);

            if (statementIndex < 0) { return new Error('OnlinePaymentStatementNotFound') }
            
            const { path } = attachement;

            attachement = commonService.saveAttachement(id, attachement, onlinePayment.dates.created);

            if (!attachement || attachement instanceof Error) { return new Error('ErrorSavingAttachment'); }


            const pathIndex = statements[statementIndex].attachments.findIndex((elt) => elt.path === path);


            if (pathIndex < 0) {
                statements[statementIndex].attachments.push(attachement);
            } else {
                statements[statementIndex].attachments[pathIndex] = attachement;
            }

            return await onlinePaymentsCollection.updateOnlinePaymentsById(id, { statements });


        },

    updateAttachmentStatus: async (id: string, data: any) => {

        const { status, statementRef, path, rejectReason } = data;

        if (path) { return new Error('PathNotProvided'); }

        const onlinePayment = await onlinePaymentsCollection.getOnlinePaymentById(id);

        if (!onlinePayment) { return new Error('OnlinePaymentNotFound') }


        const { statements } = onlinePayment;

        const statementIndex = statements.findIndex((elt) => elt.statementRef === statementRef);

        if (statementIndex < 0) { return new Error('OnlinePaymentStatementNotFound') }

        if (status === AttachementStatus.REJECTED && !rejectReason) { return new Error('ReasonNotProvided'); }


        const pathIndex = statements[statementIndex].attachments.findIndex((elt) => elt.path === path);


        if (pathIndex < 0) { return new Error('AttachementNotFound') }

        statements[statementIndex].attachments[pathIndex].status === status;

        if (status === AttachementStatus.REJECTED) { statements[statementIndex].attachments[pathIndex].rejectReason = rejectReason }

        //TODO send notifications

        return await onlinePaymentsCollection.updateOnlinePaymentsById(id, { statements });
    },
    generateExportLinks: async (id: string, data: any) => {

        const { path, name, contentType } = data;

        const onlinePayment = await onlinePaymentsCollection.getOnlinePaymentById(id);

        if (!onlinePayment) { return new Error('TravelDataNotFound') }


        const file = filesService.readFile(path);

        if (!file) { return new Error('Forbbiden'); }

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { path, ttl, id, name, contentType };

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

        const { ttl, path, name, contentType } = options;

        if ((new Date()).getTime() >= ttl) {
            return new Error('ExportLinkExpired');
        }
        const data = filesService.readFile(path);
        const buffer = Buffer.from(data, 'base64');

        const fileName = `export_${new Date().getTime()}-${name}`

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

    },


};
