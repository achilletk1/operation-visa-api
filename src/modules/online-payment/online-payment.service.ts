import { notificationEmmiter, OnlinePayementDeclarationEvent } from 'modules/notifications';
import { VisaTransactionsCeilingsController } from "modules/visa-transactions-ceilings";
import { deleteDirectory, readFile, saveAttachment } from "common/utils";
import { OpeVisaStatus, VisaCeilingType } from "modules/visa-operations";
import { OnlinePaymentRepository } from "./online-payment.repository";
import { OnlinePaymentController } from "./online-payment.controller";
import { UsersController } from "modules/users";
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
            const onlinePayment = await OnlinePaymentController.onlinePaymentService.findOne({ filter: { _id: id } });

            // onlinePayment?.statements?.forEach((online: any) => {
            //     if ('validators' in online) {
            //         online?.validators.forEach((elt: any) => { elt.status = online?.status, elt.step = 'Liste des déclarations' });
            //         validators.push(...online.validators)
            //     }
            // })

            return validators;

        } catch (error) { throw error; }
    }

    async insertOnlinePaymentStatement(userId: string, onlinepaymentMonth: OnlinePaymentMonth): Promise<any> {
        try {
            const user = await UsersController.usersService.findOne({ filter: { _id: userId } });
            const { month, year } = onlinepaymentMonth;
            if (!user) { throw Error('UserNotFound'); }
            if (!('month' in onlinepaymentMonth) || !('year' in onlinepaymentMonth)) { throw Error('OnlinePayementDateNotFound'); }
            const currentMonth: number = +(year + '' + month) as number;
            let onlinePayment: OnlinePaymentMonth = {};
            let insertion = false;
            // onlinepaymentMonth.statementRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`;
            onlinepaymentMonth.status = OpeVisaStatus.TO_VALIDATED;
            try { onlinePayment = await OnlinePaymentController.onlinePaymentService.findOne({ filter: { currentMonth, 'user._id': userId } }); } catch (error) { }
            if (!isEmpty(onlinePayment)) { throw Error('OnlinePayementExist'); }
            const ceiling = await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.findOne({ filter: { type: VisaCeilingType.ONLINE_PAYMENT } });
            if (!ceiling) { throw Error('CeilingNotFound'); }
            if (isEmpty(onlinePayment)) {
                onlinePayment = {
                    user: {
                        email: get(user, 'email'),
                        tel: get(user, 'tel'),
                        _id: get(user, '_id')?.toString(),
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
                    transactions: [],
                    othersAttachements: []
                }
                insertion = true;
                onlinePayment._id = (await OnlinePaymentController.onlinePaymentService.create(onlinePayment))?.data?.toString();
            }

            const id = String(get(onlinePayment, '_id'));
            for (let attachment of onlinepaymentMonth?.othersAttachements || []) {
                if (!attachment.temporaryFile) { continue; }
                const content = readFile(String(attachment?.temporaryFile?.path));
                if (!content) { continue; }
                attachment.content = content;
                attachment = saveAttachment(onlinePayment._id, attachment, Number(onlinePayment.dates?.created), 'onlinePayment', moment(onlinepaymentMonth.dates?.created).format('DD-MM-YY'));
                deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
                delete attachment.temporaryFile;
            }


            onlinePayment?.othersAttachements?.push(onlinepaymentMonth.othersAttachements);
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

            const user = await UsersController.usersService.findOne({ filter: { clientCode: get(onlinePayment, 'user.clientCode') } });

            if (user) {
                onlinePayment.user = { ...onlinePayment.user, fullName: `${get(user, 'fname')} ${get(user, 'lname')}`, _id: user?._id?.toString() };
            }

            onlinePayment.status = OpeVisaStatus.TO_COMPLETED;
            const ceiling = await VisaTransactionsCeilingsController.visaTransactionsCeilingsService.findOne({ filter: { type: VisaCeilingType.ONLINE_PAYMENT } })
            onlinePayment.dates = { ...onlinePayment.dates, created: moment().valueOf() };
            onlinePayment.ceiling = get(ceiling, 'value', 0);

            const insertedId = await OnlinePaymentController.onlinePaymentService.create(onlinePayment);
            onlinePayment._id = insertedId;

            return onlinePayment;
        } catch (error) { throw error; }
    }

    async updateOnlinePaymentsById(id: string, data: OnlinePaymentMonth) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            const actualOninePayment = await OnlinePaymentController.onlinePaymentService.findOne({ filter: { _id: id } });

            if (!actualOninePayment) { throw new Error('OnlinePayment'); }

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
            // const globalStatus = getOnpStatus(data?.statements);
            // data.status = globalStatus;

            data.editors = !isEmpty(data.editors) ? data.editors : [];
            data?.editors?.push({
                fullName: `${authUser.fname}${authUser.lname}`,
                date: moment().valueOf(),
                steps: "liste des déclaration d'achat en ligne"
            })

            const result = await OnlinePaymentController.onlinePaymentService.update({ _id: id }, data);
            return result;
        } catch (error) { throw error; }
    }

    async updateStatementStatusById(id: string, data: any) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            if (!adminAuth) { throw new Error('Forbidden'); }

            const { status, validator, statementRefs, rejectReason } = data;

            if (isEmpty(statementRefs)) throw new Error('MissingStatementRefs');

            const onlinePayment = await OnlinePaymentController.onlinePaymentService.findOne({ filter: { _id: id } });

            if (!onlinePayment) { throw new Error('OnlinePaymentNotFound'); }
            if (status === OpeVisaStatus.REJECTED && (!rejectReason || rejectReason === '')) { throw new Error('CannotRejectWithoutReason') }

            //    const { statements } = onlinePayment;
            let updateData: any = {};
            // for (let statement of statements) {
            //     if (!statementRefs.includes(statement.statementRef)) { continue; }
            //     statement.status = status;
            //     statement.validators = isEmpty(statement.validators) ? statement.validators : [...statement.validators, validator];
            // }
            // updateData.statements = statements;

            // updateData["rejectReason"] = rejectReason;

            // const globalStatus = getOnpStatus(statements);
            // if (onlinePayment.status !== globalStatus) { updateData.status = globalStatus; }

            updateData.editors = !isEmpty(updateData.editors) ? updateData.editors : [];
            updateData.editors.push({
                fullName: `${authUser.fname}${authUser.lname}`,
                date: moment().valueOf(),
                steps: "liste des déclaration d'achat en ligne"
            })

            const result = await OnlinePaymentController.onlinePaymentService.update({ _id: id }, updateData);
            return result;
        } catch (error) { throw error; }
    }

    async getOnlinePaymentReport(params: { status: any, start: number, end: number }) {
        try { return await OnlinePaymentService.onlinePaymentRepository.getOnlinePaymentReport(params); }
        catch (error) { throw error; }
    }

    async getStatusOperationOnlinePaymentReport(params: { filterStatus: any, start: number, end: number }) {
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
