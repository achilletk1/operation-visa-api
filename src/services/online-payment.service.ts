import { visaTransactionsCeillingsCollection } from '../collections/visa-transactions-ceilings.collection';
import { visaTransactionsCeilingsService } from './visa-transactions-ceilings.service';
import { OnlinePaymentMonth, OnlinePaymentStatement } from '../models/online-payment';
import { onlinePaymentsCollection } from '../collections/online-payments.collection';
import { decode, encode } from './helpers/url-crypt/url-crypt.service.helper';
import { OpeVisaStatus, VisaCeilingType } from '../models/visa-operations';
import { usersCollection } from '../collections/users.collection';
import { notificationService } from './notification.service';
import * as exportHelper from './helpers/exports.helper';
import { commonService } from './common.service';
import httpContext from 'express-http-context';
import { filesService } from './files.service';
import generateId from 'generate-unique-id';
import { get, isEmpty } from "lodash";
import { logger } from '../winston';
import moment = require('moment');

export const onlinePaymentsService = {


    insertOnlinePaymentStatement: async (userId: string, onlinepaymentStatement: OnlinePaymentStatement): Promise<any> => {
        try {

            const user = await usersCollection.getUserById(userId);

            if (!user) { return new Error('UserNotFound'); }

            const currentMonth = +moment(onlinepaymentStatement.date).format('YYYYMM');

            let onlinePayment: OnlinePaymentMonth;
            let result: any;

            onlinepaymentStatement.statementRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`
            onlinepaymentStatement.status = OpeVisaStatus.TO_VALIDATED;

            onlinePayment = await onlinePaymentsCollection.getOnlinePaymentBy({ currentMonth, 'user._id': userId });

            const ceiling = await visaTransactionsCeilingsService.getVisaTransactionCeillingsBy({ type: 200 });
            if (!ceiling) { return new Error('CeilingNotFound'); }

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
                    ceiling: ceiling?.value,
                    amounts: 0,
                    status: OpeVisaStatus.TO_VALIDATED,
                    currentMonth,
                    statements: [],
                    transactions: [],
                }
                result = await onlinePaymentsCollection.insertVisaOnlinePayment(onlinePayment);
                onlinePayment._id = result;
            }
            const id = get(onlinePayment, '_id');
            for (let attachment of onlinepaymentStatement?.attachments) {
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
            Promise.all([
                await notificationService.sendEmailOnlinePayementDeclaration({ ...onlinePayment, _id: id }, user.email)
            ]);

            const data = { _id: result };

            return data;

        } catch (error) {
            logger.error(`onlinePayment creation failed \n${error?.name} \n${error?.stack}`);
            return error;
        }
    },

    insertOnlinePayment: async (onlinePayment: OnlinePaymentMonth): Promise<any> => {
        try {

            const user = await usersCollection.getUserBy({ clientCode: get(onlinePayment, 'user.clientCode') });

            if (user) {
                onlinePayment.user.fullName = `${get(user, 'fname')} ${get(user, 'lname')}`;
                onlinePayment.user._id = user?._id.toString();
            }

            onlinePayment.status = OpeVisaStatus.TO_COMPLETED;
            const ceiling = await visaTransactionsCeillingsCollection.getVisaTransactionsCeilingBy({ type: VisaCeilingType.ONLINE_PAYMENT })
            onlinePayment.dates.created = moment().valueOf();
            onlinePayment.ceiling = get(ceiling, 'value', 0);

            const insertedId = await onlinePaymentsCollection.insertVisaOnlinePayment(onlinePayment);
            onlinePayment._id = insertedId;

            return onlinePayment;

        } catch (error) {
            logger.error(`onlinePayment creation failed \n${error?.name} \n${error?.stack}`);
            return error;
        }
    },

    getOnlinePayments: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit, clientCode } = filters;
            delete filters.offset;
            delete filters.limit;

            const { userId } = filters;

            if (userId) {
                delete filters.userId;
                filters['user._id'] = userId;
            }
            if (clientCode) {
                delete filters.clientCode;
                filters['user.clientCode'] = clientCode;
            }

            return await onlinePaymentsCollection.getOnlinePayments(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting onlinePayment data \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getOnlinePaymentById: async (id: string) => {
        try {
            return await onlinePaymentsCollection.getOnlinePaymentById(id);
        } catch (error) {
            logger.error(`\nError getting onlinePayment data \n${error.message}\n${error.stack}\n`);
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
            logger.error(`\nError getting onlinePayment data by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateOnlinePaymentsById: async (id: string, data: OnlinePaymentMonth) => {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            const actualOninePayment = await onlinePaymentsCollection.getOnlinePaymentById(id);

            if (!actualOninePayment) { return new Error('OnlinePayment'); }

            for (let statement of data.statements) {
                if (statement?.status && !adminAuth && statement?.isEdit) { delete statement?.status }
                statement.statementRef = statement.statementRef || `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`
                for (let attachment of statement?.attachments) {
                    if (!attachment?.temporaryFile) { continue; }

                    const content = filesService.readFile(attachment?.temporaryFile?.path);

                    if (!content) { continue; }

                    attachment.content = content;

                    attachment = commonService.saveAttachment(id, attachment, actualOninePayment.dates?.created, 'onlinePayment', moment(statement?.date).format('DD-MM-YY'));

                    filesService.deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
                    delete attachment?.temporaryFile;
                }
                if (![OpeVisaStatus.JUSTIFY, OpeVisaStatus.REJECTED].includes(statement?.status)) {
                    if (!statement.transactionRef) {
                        statement.status = OpeVisaStatus.TO_COMPLETED;
                    }

                    if (statement.transactionRef) {
                        statement.status = OpeVisaStatus.TO_VALIDATED;
                    }
                }
            }
            data.statementAmounts = commonService.getTotal(data?.statements, 'stepAmount');

            const result = await onlinePaymentsCollection.updateOnlinePaymentsById(id, data);
            return result;
        } catch (error) {
            logger.error(`\nError updating onlinePayment data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    updateStatementStatusById: async (id: string, data: any) => {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            if (!adminAuth) { return new Error('Forbidden'); }

            const { status, validator, statementRefs } = data;

            if (isEmpty(statementRefs)) return new Error('MissingStatementRefs');

            const onlinePayment = await onlinePaymentsCollection.getOnlinePaymentById(id);

            if (!onlinePayment) { return new Error('OnlinePaymentNotFound'); }

            const { statements } = onlinePayment;
            let updateData: any = {};
            for (let statement of statements) {
                if (!statementRefs.includes(statement.statementRef)) { continue; }
                statement.status = status;
                statement.validators = isEmpty(statement.validators) ? statement.validators : [...statement.validators, validator];
            }
            updateData.statements = statements;

            const globalStatus = commonService.getOnpStatus(statements);
            if (onlinePayment.status !== globalStatus) { updateData.status = globalStatus; }
            updateData.editors.push({
                fullName: `${authUser.fname}${authUser.lname}`,
                date: moment().valueOf(),
                steps: "liste des déclaration d'achat en ligne"
            })
            const result = await onlinePaymentsCollection.updateOnlinePaymentsById(id, updateData);
            return result;
        } catch (error) {
            logger.error(`\nError updating onlinePayment status declaration  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    getValidationsOnlinePayment: async (id: string) => {
        let validators: any[] = [];
        try {
            const onlinePayment = await onlinePaymentsCollection.getOnlinePaymentById(id);

            onlinePayment?.statements?.forEach(online => {
                if ('validators' in online) {
                    online?.validators.forEach((elt: any) => { elt.status = online?.status, elt.step = 'Liste des déclarations' });
                    validators.push(...online.validators)
                }
            })

            return validators;

        } catch (error) {
            logger.error(`\nError getting vis transactions \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    removeOnlinePaymentsWithExceedings: async () => {
        let data = await onlinePaymentsCollection.getOnlinePayments({ currentMonth: { $lt: +moment().subtract(1, 'month').format('YYYYMM') } });

        for (const payment of data) {
            const total = commonService.getTotal(payment?.transactions);
            if (total < payment?.ceiling) {
                await onlinePaymentsCollection.deleteOnlinePayment(payment?._id);
            }
        }

    }

};


