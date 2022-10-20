import { get } from 'lodash';
import { usersCollection } from '../collections/users.collection';
import { onlinePaymentsCollection } from '../collections/online-payments.collection';
import { Attachment, AttachementStatus, OpeVisaStatus } from '../models/visa-operations';
import { commonService } from './common.service';
import { logger } from '../winston';
import * as generateId from 'generate-unique-id';
import moment = require('moment');
import { filesService } from './files.service';
import { config } from '../config';
import { decode, encode } from './helpers/url-crypt/url-crypt.service.helper';
import * as helper from './helpers/visa-operations.service.helper'
import { OnlinePaymentMonth, OnlinePaymentStatement } from '../models/online-payment';


export const onlinePaymentsService = {


    insertOnlinePaymentStatement: async (userId: string, onlinepaymentStatement: OnlinePaymentStatement): Promise<any> => {
        try {

            const user = await usersCollection.getUserById(userId);

            if (!user) { return new Error('UserNotFound'); }

            const currentMonth = +moment(onlinepaymentStatement.date).format('YYYYMM');

            let onlinePayment: OnlinePaymentMonth;
            let result: any;

            onlinepaymentStatement.statementRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`
            onlinepaymentStatement.status = OpeVisaStatus.PENDING;

            onlinePayment = await onlinePaymentsCollection.getOnlinePaymentBy({ currentMonth, 'user._id': userId });

            if (!onlinePayment) {
                onlinePayment = {
                    user: {
                        _id: get(user, '_id').toString(),
                        clientCode: get(user, 'clientCode'),
                        fullName: `${get(user, 'fname')} ${get(user, 'lname')}`
                    },
                    dates: {
                        created: moment().valueOf(),
                    },
                    ceiling: 200000,
                    amounts: 0,
                    status: OpeVisaStatus.PENDING,
                    currentMonth,
                    statements: [],
                    transactions: [],
                }
                result = await onlinePaymentsCollection.insertVisaOnlinePayment(onlinePayment);
                onlinePayment._id = result;
            }

            for (let attachment of onlinepaymentStatement.attachments) {
                if (!attachment.temporaryFile) { continue; }

                const content = filesService.readFile(attachment.temporaryFile.path);

                if (!content) { continue; }

                attachment.content = content;

                attachment = commonService.saveAttachment(onlinePayment._id, attachment, onlinePayment.dates?.created, 'onlinePayment', moment(onlinepaymentStatement.date).format('DD-MM-YY'));

                filesService.deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
                delete attachment.temporaryFile;
            }


            onlinePayment.dates.updated = moment().valueOf();
            onlinePayment.statements.push(onlinepaymentStatement);

            result = await onlinePaymentsCollection.updateOnlinePaymentsById(get(onlinePayment, '_id').toString(), onlinePayment);
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

            const { userId } = filters;

            if (userId) {
                delete filters.userId;
                filters['user._id'] = userId;
            }


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
            const { userId } = data;

            if (userId) {
                delete data.userId;
                data['user._id'] = userId;
            }

            return await onlinePaymentsCollection.getOnlinePaymentsBy(data);
        } catch (error) {
            logger.error(`\nError getting travel data by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateOnlinePaymentsById: async (id: string, data: OnlinePaymentMonth) => {
        try {
            const actualOninePayment = await onlinePaymentsCollection.getOnlinePaymentById(id);

            if (!actualOninePayment) { return new Error('TravelNotFound'); }

            for (let statement of data.statements) {
                for (let attachment of statement.attachments) {
                    if (!attachment.temporaryFile) { continue; }

                    const content = filesService.readFile(attachment.temporaryFile.path);

                    if (!content) { continue; }

                    attachment.content = content;

                    attachment = commonService.saveAttachment(id, attachment, actualOninePayment.dates?.created, 'onlinePayment', moment(statement.date).format('DD-MM-YY'));

                    filesService.deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
                    delete attachment.temporaryFile;
                }

            }
            return await onlinePaymentsCollection.updateOnlinePaymentsById(id, data);
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },


};
