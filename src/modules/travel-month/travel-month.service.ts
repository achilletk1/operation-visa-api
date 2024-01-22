import { ValidationLevelSettingsController } from "modules/validation-level-settings";
import { getOnpStatementStepStatus, getTotal } from "common/utils";
import { TravelMonthRepository } from "./travel-month.repository";
import { TravelMonthController } from "./travel-month.controller";
import { VisaTransaction } from "modules/visa-transactions";
import { getTravelStatus } from "modules/travel/helper";
import { OpeVisaStatus } from "modules/visa-operations";
import { getValidationsFolder } from "common/helpers";
import { saveAttachmentTravelMonth } from "./helper";
import { TravelController } from 'modules/travel';
import httpContext from 'express-http-context';
import { CrudService } from "common/base";
import { isEmpty, get } from "lodash";
import { TravelMonth } from "./model";
import { notificationEmmiter, UploadedDocumentsOnExceededFolderEvent } from "modules/notifications";
import moment from "moment";

export interface IsEdit {
    isEdit?: boolean;
}

export class TravelMonthService extends CrudService<TravelMonth> {

    static travelMonthRepository: TravelMonthRepository;

    constructor() {
        TravelMonthService.travelMonthRepository = new TravelMonthRepository();
        super(TravelMonthService.travelMonthRepository);
    }

    async getTravelMonths(filters: any) {
        try {
            this.formatFilters(filters);
            return await TravelMonthController.travelMonthService.findAll({ filter: filters });
        } catch (error) { throw error; }
    }

    async getValidationsTravelMonth(_id: string) {
        try {
            const travel = await TravelMonthController.travelMonthService.findOne({ filter: { _id } });
            return getValidationsFolder(travel);
        } catch (error) { throw error; }
    }

    async updateTravelMonthsById(_id: string, travelMonth: Partial<TravelMonth>) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 500 && authUser?.category < 700;

            const actualTravelMonth: TravelMonth = (await TravelMonthController.travelMonthService.baseRepository.findOne({ filter: { _id } })) as unknown as TravelMonth;

            if (!actualTravelMonth) { throw new Error('TravelMonthNotFound'); }

            const travel = await TravelController.travelService.findOne({ filter: { _id: actualTravelMonth.travelId?.toString() } });
            if (!travel) { throw new Error('TravelNotFound'); }

            if (!isEmpty(travelMonth.transactions)) {
                for (let transaction of (travelMonth?.transactions || []) as (VisaTransaction & IsEdit)[]) {
                    if (transaction.status && !adminAuth) { delete transaction.status }

                    if (transaction.isEdit) {
                        transaction.status = OpeVisaStatus.TO_VALIDATED;
                        delete transaction.isEdit;
                    }

                    if (isEmpty(transaction.attachments)) { continue; }
                    transaction.attachments = saveAttachmentTravelMonth(transaction?.attachments, _id, travelMonth?.dates?.created);
                }
            }

            if ((travelMonth?.isUntimely)) {
                let firstIndexToValidateTransaction;
                if (travelMonth.transactions?.length) {
                    firstIndexToValidateTransaction = travelMonth?.transactions?.findIndex((elt, i) => { elt.isExceed && (elt.status != (actualTravelMonth?.transactions || [])[i]?.status && elt.status === OpeVisaStatus.TO_VALIDATED) });
                    if (firstIndexToValidateTransaction > -1) {
                        if (travelMonth && travelMonth?.editors?.length) {
                            const lastEditorDate = travelMonth.editors[travelMonth.editors.length - 1 || 0]?.date || 0;
                            if (Math.abs(moment().diff(lastEditorDate, 'minutes')) >= 30) {
                                notificationEmmiter.emit(
                                    'uploaded-documents-on-exceeded-folder-mail',
                                    new UploadedDocumentsOnExceededFolderEvent(
                                        { ref: travel?.travelRef?.toString() || '', fullName: travel.user?.fullName?.toString() },
                                        'Mois de voyage :' + travelMonth.month, 'TravelMonth', firstIndexToValidateTransaction
                                    )
                                );
                            }
                        }
                    }
                }
            }

            return await TravelMonthController.travelMonthService.update({ _id }, travelMonth);
        } catch (error) { throw error; }
    }

    async updateManyTravelMonths(travelMonths: TravelMonth[]) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 500 && authUser?.category < 700;

            if (isEmpty(travelMonths)) { throw new Error('TravelMonthsNotFound') }

            await Promise.all(travelMonths.map(async (travelMonth) => {
                const _id = get(travelMonth, '_id');
                const actualTravelMonth = (await TravelMonthController.travelMonthService.baseRepository.findOne({ filter: { _id } })) as unknown as TravelMonth;
                if (!actualTravelMonth) { throw new Error('TravelMonthNotFound'); }

                if (!isEmpty(travelMonth.transactions)) {
                    for (let transaction of (travelMonth.transactions || []) as (VisaTransaction & IsEdit)[]) {
                        if (transaction.status && !adminAuth) { delete transaction.status }

                        if (transaction.isEdit) {
                            transaction.status = OpeVisaStatus.TO_VALIDATED;
                            delete transaction.isEdit;
                        }

                        if (isEmpty(transaction.attachments)) { continue; }
                        transaction.attachments = saveAttachmentTravelMonth(transaction?.attachments, _id, travelMonth?.dates?.created);
                    }
                }
                return await TravelMonthController.travelMonthService.update({ _id }, travelMonth);

            }));
        } catch (error) { throw error; }
    }

    async updateTravelMonthExpendeDetailsStatusById(_id: string, data: any) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 500 && authUser?.category < 700;

            if (!adminAuth) { throw new Error('Forbidden'); }
            const { status, rejectReason, validator, references } = data;


            let travelMonth = (await TravelMonthController.travelMonthService.baseRepository.findOne({ filter: { _id } })) as unknown as TravelMonth;

            if (!travelMonth) { throw new Error('TravelMonthNotFound'); }

            const travel = await TravelController.travelService.findOne({ filter: { _id: travelMonth?.travelId } });

            if (!travel) { throw new Error('TravelNotFound'); }

            if (status === OpeVisaStatus.REJECTED && (!rejectReason || rejectReason === '')) { throw new Error('CannotRejectWithoutReason') }

            const maxValidationLevelRequired = await ValidationLevelSettingsController.levelValidateService.count({});

            let updateData: any, tobeUpdated: { transactions?: VisaTransaction[]; expenseDetailsLevel?: number; } = {};

            updateData = { status };

            if (status === OpeVisaStatus.REJECTED) { updateData = { ...updateData, rejectReason } }

            if (!references) { throw new Error('ReferenceNotProvided'); }

            const transactions = travelMonth?.transactions || [];

            if (isEmpty(travelMonth.validators)) { travelMonth.validators = []; }
            travelMonth.validators?.push(validator);

            for (const transactionMatch of references) {

                const transactionIndex = transactions?.findIndex((elt: any) => elt.match === transactionMatch) as number;

                if (transactionIndex < 0) { throw new Error('BadReference'); }

                transactions[transactionIndex] = { ...transactions[transactionIndex], ...updateData }

            }

            if (transactions.findIndex(e => e.isExceed && e.status !== OpeVisaStatus.JUSTIFY) === -1) {
                if (maxValidationLevelRequired !== travelMonth.expenseDetailsLevel) {
                    tobeUpdated.expenseDetailsLevel = (travelMonth?.expenseDetailsLevel || 1) + 1;
                    transactions.forEach(e => e.status = OpeVisaStatus.VALIDATION_CHAIN);
                }
            }

            if (rejectReason) {
                tobeUpdated.expenseDetailsLevel = 1;
                transactions.forEach(e => e.status === OpeVisaStatus.VALIDATION_CHAIN && (e.status = OpeVisaStatus.TO_VALIDATED));
            }

            tobeUpdated.transactions = transactions;

            travelMonth.editors = !isEmpty(travelMonth.editors) ? travelMonth.editors : [];
            travelMonth.editors?.push({
                _id: authUser._id,
                fullName: authUser?.fullName,
                date: new Date().valueOf(),
                steps: 'État détaillé des dépenses'
            })

            travelMonth.expenseDetailsStatus = getOnpStatementStepStatus(travelMonth, 'expenseDetail');

            travelMonth = { ...travelMonth, ...tobeUpdated };
            travelMonth.status = getTravelStatus(travelMonth);
            travelMonth.expenseDetailAmount = getTotal(travelMonth.transactions, 'stepAmount');

            // await TravelController.travelService.updateTravelById(travelMonth?.travelId, { travel: { editors }, steps: ['expenseDetails'] });
            return await TravelMonthController.travelMonthService.update({ _id }, travelMonth);

        } catch (error) { throw error; }
    }

    private formatFilters(filters: any) {
        const { clientCode, userId, name } = filters;

        if (userId) {
            delete filters.userId;
            filters['user._id'] = userId;
        }
        if (clientCode) {
            delete filters.clientCode;
            filters['user.clientCode'] = clientCode;
        }
        if (name) {
            delete filters.name;
            filters['user.fullName'] = name;
        }
    }

    async insertManyVisaTravelMonth(data: TravelMonth[]) {
        try { return await TravelMonthController.travelMonthService.createMany(data); }
        catch (error) { throw error; }
    }

}