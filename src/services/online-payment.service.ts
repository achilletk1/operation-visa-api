import { onlinePaymentsCollection } from '../collections/online-payments.collection';
import { OnlinePaymentMonth, OnlinePaymentStatement } from '../models/online-payment';
import { usersCollection } from '../collections/users.collection';
import { notificationService } from './notification.service';
import {  OpeVisaStatus } from '../models/visa-operations';
import  httpContext from 'express-http-context';
import { commonService } from './common.service';
import  generateId from 'generate-unique-id';
import { filesService } from './files.service';
import { logger } from '../winston';
import moment = require('moment');
import { get } from 'lodash';


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
            Promise.all([
                await notificationService.sendEmailOnlinePayementDeclaration(onlinePayment, user.email)
            ]);

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
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            const actualOninePayment = await onlinePaymentsCollection.getOnlinePaymentById(id);

            if (!actualOninePayment) { return new Error('TravelNotFound'); }

            for (let statement of data.statements) {
                if (statement.status && !adminAuth) { delete statement.status }

                if (statement.isEdit) {
                    statement.status = OpeVisaStatus.PENDING;
                    delete statement.isEdit;
                }

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
            const result = await onlinePaymentsCollection.updateOnlinePaymentsById(id, data);

            let upadatedTravel = await onlinePaymentsCollection.getOnlinePaymentById(id);

            const status = getPayementStatus(upadatedTravel);

            if (status !== upadatedTravel.status) {
                await onlinePaymentsCollection.updateOnlinePaymentsById(id, { status });
                //TODO send notifications for status update
            }

            return result;
            return await onlinePaymentsCollection.updateOnlinePaymentsById(id, data);
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    getValidationsOnlinePayment: async (id: string) => {
        let validators: any[] = [];
        try {
            const onlinePayment = await onlinePaymentsCollection.getOnlinePaymentById(id);

            onlinePayment?.statements?.forEach(online => {
                if ('validators' in online) {
                    validators.push(...online.validators)
                }
            })

            return validators;

        } catch (error) {
            logger.error(`\nError getting vis transactions \n${error.message}\n${error.stack}\n`);
            return error;
        }
    }

};
const getPayementStatus = (onlinePayment: OnlinePaymentMonth) => {
    if (!onlinePayment) { throw new Error('OnlinePaymentNotDefined'); }

    if (onlinePayment.statements.every((elt) => elt.status === OpeVisaStatus.ACCEPTED)) {
        return OpeVisaStatus.ACCEPTED;
    } else {
        return onlinePayment.status === OpeVisaStatus.ACCEPTED ? OpeVisaStatus.PENDING : onlinePayment.status
    }
}