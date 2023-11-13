import { getOnpStatementStepStatus, getTotal } from "common/utils";
import { TravelMonthRepository } from "./travel-month.repository";
import { TravelMonthController } from "./travel-month.controller";
import { OpeVisaStatus } from "modules/visa-operations";
import { saveAttachmentTravelMonth } from "./helper";
import { TravelController } from 'modules/travel';
import httpContext from 'express-http-context';
import { CrudService } from "common/base";
import { isEmpty, get } from "lodash";
import { TravelMonth } from "./model";
import moment from 'moment';

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

    async updateTravelMonthsById(_id: string, travelMonth: Partial<TravelMonth>) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            const actualTravelMonth = await TravelMonthController.travelMonthService.findOne({ filter: { _id }});

            if (!actualTravelMonth) { throw Error('TravelMonthNotFound'); }

            if (!isEmpty(travelMonth.expenseDetails)) {
                for (let expenseDetail of (travelMonth?.expenseDetails || [])) {
                    if (expenseDetail.status && !adminAuth) { delete expenseDetail.status }

                    if (expenseDetail.isEdit) {
                        expenseDetail.status = OpeVisaStatus.TO_VALIDATED;
                        delete expenseDetail.isEdit;
                    }

                    if (isEmpty(expenseDetail.attachments)) { continue; }
                    expenseDetail.attachments = saveAttachmentTravelMonth(expenseDetail?.attachments, _id, Number(travelMonth?.dates?.created));
                }
            }
            return await TravelMonthController.travelMonthService.update({ _id }, travelMonth);
        } catch (error) { throw error; }
    }

    async updateManyTravelMonths(travelMonths: TravelMonth[]) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            if (isEmpty(travelMonths)) { throw Error('TravelMonthsNotFound') }

            await Promise.all(travelMonths.map(async (travelMonth) => {
                const _id = get(travelMonth, '_id');
                const actualTravelMonth = await TravelMonthController.travelMonthService.findOne({ filter: { _id }});
                if (!actualTravelMonth) { throw Error('TravelMonthNotFound'); }

                if (!isEmpty(travelMonth.expenseDetails)) {
                    for (let expenseDetail of travelMonth.expenseDetails) {
                        if (expenseDetail.status && !adminAuth) { delete expenseDetail.status }

                        if (expenseDetail.isEdit) {
                            expenseDetail.status = OpeVisaStatus.TO_VALIDATED;
                            delete expenseDetail.isEdit;
                        }

                        if (isEmpty(expenseDetail.attachments)) { continue; }
                        expenseDetail.attachments = saveAttachmentTravelMonth(expenseDetail?.attachments, _id, travelMonth?.dates?.created);
                    }
                }
                return await TravelMonthController.travelMonthService.update({ _id }, travelMonth);

            }));
        } catch (error) { throw error; }
    }

    async updateTravelMonthExpendeDetailsStatusById(_id: string, data: any) {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            if (!adminAuth) { throw Error('Forbidden'); }
            const { status, rejectReason, validator, references } = data;


            let travelMonth = await TravelMonthController.travelMonthService.findOne({ filter: {_id }});

            if (!travelMonth) { throw Error('TravelMonthNotFound'); }

            const travel = await TravelController.travelService.findOne({ filter: { _id: travelMonth?.travelId }});

            if (!travel) { throw Error('TravelNotFound'); }

            if (status === OpeVisaStatus.REJECTED && (!rejectReason || rejectReason === '')) { throw Error('CannotRejectWithoutReason') }

            let updateData: any, tobeUpdated: any;

            updateData = { status };

            if (status === OpeVisaStatus.REJECTED) { updateData = { ...updateData, rejectReason } }

            if (!references) { throw Error('ReferenceNotProvided'); }

            const { expenseDetails } = travelMonth;

            for (const expenseDetailRef of references) {

                const expenseDetailIndex = expenseDetails.findIndex((elt: any) => elt.ref === expenseDetailRef);

                if (expenseDetailIndex < 0) { throw Error('BadReference'); }

                expenseDetails[expenseDetailIndex].validators.push(validator);

                expenseDetails[expenseDetailIndex] = { ...expenseDetails[expenseDetailIndex], ...updateData }

            }

            tobeUpdated = { expenseDetails };

            const editors = !isEmpty(travel.editors) ? travel.editors : [];
            editors?.push({
                fullName: `${authUser.fname} ${authUser.lname}`,
                date: moment().valueOf(),
                steps: 'expenseDetails'
            })

            travelMonth.expenseDetailsStatus = getOnpStatementStepStatus(travelMonth, 'expenseDetail');
            const expenseDetailAmount = getTotal(travelMonth.expenseDetails, 'stepAmount');

            travelMonth = { ...travelMonth, ...tobeUpdated };
            travelMonth.expenseDetailAmount = expenseDetailAmount;

            await TravelController.travelService.updateTravelById(String(travelMonth?.travelId), { editors });
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