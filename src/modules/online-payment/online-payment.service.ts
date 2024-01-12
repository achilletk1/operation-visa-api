import { deleteDirectory, getOnpStatementStepStatus, getOnpStatus, getTotal, readFile, saveAttachment } from "common/utils";
import { VisaCeilingType, VisaTransactionsCeilingsController } from "modules/visa-transactions-ceilings";
import { notificationEmmiter, OnlinePayementDeclarationEvent } from 'modules/notifications';
import { ValidationLevelSettingsController } from "modules/validation-level-settings";
import { OnlinePaymentRepository } from "./online-payment.repository";
import { OnlinePaymentController } from "./online-payment.controller";
import { UserCategory, UsersController } from "modules/users";
import { saveAttachmentTravel } from "modules/travel/helper";
import { OpeVisaStatus } from "modules/visa-operations";
import httpContext from 'express-http-context';
import { OnlinePaymentMonth } from "./model";
import { CrudService } from "common/base";
import { get, isEmpty } from "lodash";
import moment from "moment";

export class OnlinePaymentService extends CrudService<OnlinePaymentMonth> {

    static onlinePaymentRepository: OnlinePaymentRepository;

    constructor() {
        OnlinePaymentService.onlinePaymentRepository = new OnlinePaymentRepository();
        super(OnlinePaymentService.onlinePaymentRepository);
    }

    async getOnlinePaymentsBy(filter: any) {
        try {
            this.formatFilters(filter);
            if (filter?.start && filter?.end) filter['dates.created'] = { $gte: moment(filter?.start, 'YYYY-MM-DD').startOf('day').valueOf(), $lte: moment(filter?.end, 'YYYY-MM-DD').endOf('day').valueOf() };
            delete filter?.start;
            delete filter?.end;
            return await OnlinePaymentController.onlinePaymentService.findAll({ filter });
        } catch (error) { throw error; }
    }

    async getValidationsOnlinePayment(id: string) {
        let validators: any[] = [];
        try {
            const onlinePayment = await OnlinePaymentController.onlinePaymentService.baseRepository.findOne({ filter: { _id: id } }) as OnlinePaymentMonth;

            // onlinePayment?.statements?.forEach((online: any) => {
            //     if ('validators' in online) {
            //         online?.validators.forEach((elt: any) => { elt.status = online?.status, elt.step = 'Liste des déclarations' });
            //         validators.push(...online.validators)
            //     }
            // })

            return validators;

        } catch (error) { throw error; }
    }

    async removeOnlinePaymentsWithExceedings() {
        try {
            const onlinePaymentsMonths = (await OnlinePaymentController.onlinePaymentService.findAll({ filter: { currentMonth: { $lt: +moment().subtract(1, 'month').format('YYYYMM') } } }))?.data;

            for (const onlinePaymentsMonth of onlinePaymentsMonths) {
                const total = getTotal(onlinePaymentsMonth?.transactions || []);
                if (onlinePaymentsMonth?.ceiling && total < onlinePaymentsMonth?.ceiling) {
                    return await OnlinePaymentController.onlinePaymentService.deleteOne({ _id: onlinePaymentsMonth?._id });
                }
                // TODO manage case of onlinePaymentMonth who can have exceed ceiling, and check if it as already justiy or associate on request ceiling, if not it must mark status as EXCEEEDED
                // await OnlinePaymentController.onlinePaymentService.update({ _id: onlinePaymentsMonth?._id }, { status: OpeVisaStatus.EXCEDEED });
            }
        } catch (e: any) {
            this.logger.error(`Error during excution removeOnlinePaymentsWithExceedings cron \n ${e.stack}\n`);
        }
    }

    async insertOnlinePaymentStatement(userId: string, onlinepaymentMonth: OnlinePaymentMonth): Promise<any> {
        try {
            const user = await UsersController.usersService.findOne({ filter: { _id: userId } });
            if (!user) { throw Error('UserNotFound'); }

            if (!('month' in onlinepaymentMonth) || !('year' in onlinepaymentMonth)) { throw Error('OnlinePayementDateNotFound'); }
            const { month, year } = onlinepaymentMonth;
            const currentMonth = +(year + '' + month);

            let onlinePayment = await OnlinePaymentController.onlinePaymentService.baseRepository.findOne({ filter: { currentMonth, 'user._id': userId } }) as OnlinePaymentMonth;
            if (!isEmpty(onlinePayment)) { throw Error('OnlinePayementExist'); }

            const ceiling = await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.findOne({ filter: { type: VisaCeilingType.ONLINE_PAYMENT } });
            if (!ceiling) { throw Error('CeilingNotFound'); }

            let insertion = false;
            // onlinepaymentMonth.statementRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`;
            if (isEmpty(onlinePayment)) {
                onlinePayment = {
                    user: {
                        email: get(user, 'email'),
                        tel: get(user, 'tel'),
                        gender: get(user, 'gender'),
                        _id: get(user, '_id')?.toString(),
                        clientCode: get(user, 'clientCode'),
                        fullName: get(user, 'fullName', '')
                    },
                    dates: {
                        created: moment().valueOf(),
                    },
                    ceiling: ceiling?.value,
                    amounts: 0,
                    status: OpeVisaStatus.TO_VALIDATED,
                    currentMonth,
                    transactions: [],
                    othersAttachements: []
                }
                insertion = true;
                onlinePayment._id = (await OnlinePaymentController.onlinePaymentService.create(onlinePayment))?.data?.toString();
            }

            const id = onlinePayment._id.toString();
            for (let attachment of onlinepaymentMonth?.othersAttachements || []) {
                if (!attachment.temporaryFile) { continue; }
                const content = readFile(String(attachment?.temporaryFile?.path));
                if (!content) { continue; }
                attachment.content = content;
                attachment = saveAttachment(onlinePayment._id, attachment, Number(onlinePayment.dates?.created), 'onlinePayment');
                attachment.dates = { created: moment().valueOf() }
                deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
                delete attachment.temporaryFile;
            }


            onlinePayment.othersAttachements = onlinepaymentMonth.othersAttachements;
            //  const updateData = { 'dates.updated': moment().valueOf(), statements: onlinePayment.statements }
            const result = await OnlinePaymentController.onlinePaymentService.update({ _id: id.toString() }, onlinePayment);
            notificationEmmiter.emit('online-payement-declaration-mail', new OnlinePayementDeclarationEvent({ ...onlinePayment, _id: id }));
            // Promise.all([
            //     await NotificationsController.notificationsService.sendEmailOnlinePayementDeclaration({ ...onlinePayment, _id: id }, user.email)
            // ]);
            const data = { _id: result };
            return data;
        } catch (error) { throw error; }
    }

    async insertOnlinePayment(onlinePayment: OnlinePaymentMonth): Promise<any> {
        try {
            let user;
            try { user = await UsersController.usersService.findOne({ filter: { clientCode: get(onlinePayment, 'user.clientCode'), category: { $in: [UserCategory.DEFAULT, UserCategory.BILLERS] } } }); } catch (e) { }

            if (user) {
                onlinePayment.user = { ...onlinePayment.user, fullName: `${get(user, 'fname')} ${get(user, 'lname')}`, _id: user?._id?.toString() };
            }

            onlinePayment.status = OpeVisaStatus.TO_COMPLETED;
            const ceiling = await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.findOne({ filter: { type: VisaCeilingType.ONLINE_PAYMENT } })
            onlinePayment.dates = { ...onlinePayment.dates, created: moment().valueOf() };
            onlinePayment.ceiling = get(ceiling, 'value', 0);

            const insertedId = (await OnlinePaymentController.onlinePaymentService.create(onlinePayment))?.data;
            onlinePayment._id = insertedId;

            return onlinePayment;
        } catch (error) { throw error; }
    }

    async updateOnlinePaymentsById(_id: string, onlinePaymentMonth: OnlinePaymentMonth) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            const actualOninePayment = await OnlinePaymentController.onlinePaymentService.baseRepository.findOne({ filter: { _id } }) as OnlinePaymentMonth;

            if (isEmpty(actualOninePayment)) { throw new Error('OnlinePayment'); }

            if (!isEmpty(onlinePaymentMonth?.transactions)) {
                for (let transaction of onlinePaymentMonth?.transactions || []) {

                    if (isEmpty(transaction?.attachments)) { continue; }
                    transaction.attachments = saveAttachmentTravel(transaction?.attachments, onlinePaymentMonth?._id, onlinePaymentMonth?.dates?.created);

                    if (transaction?.isExceed && transaction?.nature) {
                        const index = transaction?.attachments?.findIndex(elt => elt?.isRequired === true && !elt?.path);
                        if (index === -1 && [OpeVisaStatus.EMPTY, OpeVisaStatus.TO_COMPLETED, null, undefined].includes(transaction?.status as OpeVisaStatus)) {
                            transaction.status = OpeVisaStatus.TO_VALIDATED;
                        }
                    }
                }
            }

            for (let othersAttachement of onlinePaymentMonth?.othersAttachements || []) {

                if (isEmpty(othersAttachement?.attachments)) { continue; }

                othersAttachement.attachments = saveAttachmentTravel(othersAttachement?.attachments || [], onlinePaymentMonth?._id, onlinePaymentMonth?.dates?.created);
            }

            // for (let statement of data.statements) {
            //     if (statement?.status && !adminAuth && statement?.isEdit) { delete statement.status; }
            //     statement.statementRef = statement.statementRef || `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`
            //     for (let attachment of (statement?.attachments || [])) {
            //         if (!attachment?.temporaryFile) { continue; }

            //         const content = readFile(String(attachment?.temporaryFile?.path));

            //         if (!content) { continue; }

            //         attachment.content = content;

            //         attachment = saveAttachment(id, attachment, Number(actualOninePayment?.dates?.created), 'onlinePayment', moment(statement?.date).format('DD-MM-YY'));

            //         deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
            //         delete attachment?.temporaryFile;
            //     }
            //     if (![OpeVisaStatus.JUSTIFY, OpeVisaStatus.REJECTED].includes(Number(statement.status))) {
            //         if (!statement.transactionRef) {
            //             statement.status = OpeVisaStatus.TO_COMPLETED;
            //         }

            //         if (statement.transactionRef) {
            //             statement.status = OpeVisaStatus.TO_VALIDATED;
            //         }
            //     }
            // }
            // data.statementAmounts = getTotal(data?.statements, 'stepAmount');
            // data.status = globalStatus;

            onlinePaymentMonth.status = getOnpStatus(onlinePaymentMonth?.transactions);
            onlinePaymentMonth.editors = !isEmpty(onlinePaymentMonth.editors) ? onlinePaymentMonth.editors : [];
            onlinePaymentMonth?.editors?.push({
                _id: authUser._id,
                fullName: authUser?.fullName,
                date: moment().valueOf(),
                steps: "État détaillé des dépenses"
            })

            return await OnlinePaymentController.onlinePaymentService.update({ _id }, onlinePaymentMonth);
        } catch (error) { throw error; }
    }

    async updateStatementStatusById(id: string, data: any) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            if (!adminAuth) { throw new Error('Forbidden'); }

            const { status, validator, references, rejectReason } = data;

            if (isEmpty(references)) throw new Error('MissingStatementRefs');

            let onlinePaymentMonth = await OnlinePaymentController.onlinePaymentService.baseRepository.findOne({ filter: { _id: id } }) as OnlinePaymentMonth;

            if (!onlinePaymentMonth) { throw new Error('OnlinePaymentNotFound'); }
            if (status === OpeVisaStatus.REJECTED && (!rejectReason || rejectReason === '')) { throw new Error('CannotRejectWithoutReason') }

            const maxValidationLevelRequired = await ValidationLevelSettingsController.levelValidateService.count({});

            let updateData: any = {}; let tobeUpdated: any = {};

            if (status === OpeVisaStatus.REJECTED) { updateData = { status, rejectReason }; }

            const transactions = onlinePaymentMonth?.transactions || [];

            if (isEmpty(onlinePaymentMonth.validators)) { onlinePaymentMonth.validators = []; }
            onlinePaymentMonth.validators?.push(validator);

            for (const transactionMatch of references) {

                const transactionIndex = transactions?.findIndex(elt => elt.match === transactionMatch) as number;

                if (transactionIndex && transactionIndex < 0) { throw new Error('BadReference'); }

                transactions[transactionIndex] = { ...transactions[transactionIndex], ...updateData }

            }

            if (transactions.findIndex(e => e.isExceed && e.status !== OpeVisaStatus.JUSTIFY) === -1) {
                if (maxValidationLevelRequired !== onlinePaymentMonth.expenseDetailsLevel) {
                    tobeUpdated.expenseDetailsLevel = (onlinePaymentMonth?.expenseDetailsLevel || 1) + 1;
                    transactions.forEach(e => e.status = OpeVisaStatus.VALIDATION_CHAIN);
                }
            }

            if (rejectReason) {
                tobeUpdated.expenseDetailsLevel = 1;
                transactions.forEach(e => e.status === OpeVisaStatus.VALIDATION_CHAIN && (e.status = OpeVisaStatus.TO_VALIDATED));
            }

            tobeUpdated.transactions = transactions;

            // for (let statement of statements) {
            //     if (!statementRefs.includes(statement.statementRef)) { continue; }
            //     statement.status = status;
            //     statement.validators = isEmpty(statement.validators) ? statement.validators : [...statement.validators, validator];
            // }
            // updateData.statements = statements;

            // updateData["rejectReason"] = rejectReason;

            // const globalStatus = getOnpStatus(statements);
            // if (onlinePayment.status !== globalStatus) { updateData.status = globalStatus; }

            onlinePaymentMonth.editors = !isEmpty(onlinePaymentMonth.editors) ? onlinePaymentMonth.editors : [];
            onlinePaymentMonth.editors?.push({
                _id: authUser._id,
                fullName: authUser?.fullName,
                date: new Date().valueOf(),
                steps: "liste des déclaration d'achat en ligne"
            })

            onlinePaymentMonth.expenseDetailsStatus = getOnpStatementStepStatus(onlinePaymentMonth, 'expenseDetail');
            onlinePaymentMonth.expenseDetailAmount = getTotal(onlinePaymentMonth.transactions);
            onlinePaymentMonth = { ...onlinePaymentMonth, ...tobeUpdated };
            onlinePaymentMonth.status = getOnpStatus(onlinePaymentMonth?.transactions);

            return await OnlinePaymentController.onlinePaymentService.update({ _id: id }, onlinePaymentMonth);
        } catch (error) { throw error; }
    }

    async getOnlinePaymentReport(params: { status: any, start: number, end: number }) {
        try { return await OnlinePaymentService.onlinePaymentRepository.getOnlinePaymentReport(params); }
        catch (error) { throw error; }
    }

    async getStatusOperationOnlinePaymentReport(params: { filterStatus: any, start: number, end: number, agencyCode: string, regionCode: string }) {
        try { return await OnlinePaymentService.onlinePaymentRepository.getStatusOperationOnlinePaymentReport(params); }
        catch (error) { throw error; }
    }

    async getAverageTimeJustifyOnlinePaymentReport(params: { status: any, start: number, end: number }) {
        try { return await OnlinePaymentService.onlinePaymentRepository.getAverageTimeJustifyOnlinePaymentReport(params); }
        catch (error) { throw error; }
    }

    async getChartDataOnlinePayment(params: { start: number, end: number }) {
        try { return await OnlinePaymentService.onlinePaymentRepository.getChartDataOnlinePayment(params); }
        catch (error) { throw error; }
    }

    async getOnlinePaymentNotifications() {
        try { return await OnlinePaymentService.onlinePaymentRepository.getOnlinePaymentNotifications(); }
        catch (error) { throw error; }
    }

    private formatFilters(filters: any) {
        const { clientCode, userId, year, month } = filters;

        if (userId) {
            delete filters.userId;
            filters['user._id'] = userId;
        }

        if (year && month) {
            delete filters.year;
            delete filters.month;
            filters['currentMonth'] = +(year + '' + month);
        }

        if (clientCode) {
            delete filters.clientCode;
            filters['user.clientCode'] = clientCode;
        }
    }

}
