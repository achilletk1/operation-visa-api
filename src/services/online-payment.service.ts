import { get, isEmpty } from 'lodash';
import { usersCollection } from './../collections/users.collections';
import { onlinePaymentsCollection } from './../collections/online-payment.collection';
import { OperationStatus, OnlinePayment, OnlinePaymentStatement } from '../models/visa-operations';
import { commonService } from './common.service';
import { logger } from '../winston';
import * as generateId from 'generate-unique-id';
import moment = require('moment');


export const onlinePaymentsService = {


    insertOnlinePaymentStatement: async (userId: string, onlinepaymentStatement: OnlinePaymentStatement): Promise<any> => {
        try {

            const user = usersCollection.getUserById(userId);

            if (user) { return new Error('UserNotFound'); }

            const currentMonth = moment(onlinepaymentStatement.date).format('YYYYMM');

            let onlinePayment: OnlinePayment;
            let result: any;

            onlinepaymentStatement.statementRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`

            if (!isEmpty(onlinepaymentStatement.attachments)) {
                onlinepaymentStatement.attachments = onlinepaymentStatement.attachments.map((attachment) => {
                    attachment = commonService.saveAttachement(onlinepaymentStatement.statementRef, attachment, onlinepaymentStatement.date);
                    return attachment;
                });

            }


            onlinePayment = await onlinePaymentsCollection.getOnlinePaymentBy({ currentMonth });

            if (!onlinePayment) {
                onlinePayment = {
                    clientCode: get(user, 'clientCode'),
                    userId,
                    dates: {
                        created: moment().valueOf(),
                    },
                    amounts: 0,
                    status: OperationStatus.PENDING,
                    currentMonth: '',
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


};
