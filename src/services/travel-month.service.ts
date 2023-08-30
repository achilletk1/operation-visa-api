import { travelMonthsCollection } from './../collections/travel-months.collection';
import { Attachment, OpeVisaStatus } from '../models/visa-operations';
import httpContext from 'express-http-context';
import { commonService } from './common.service';
import { filesService } from './files.service';
import { TravelMonth } from '../models/travel';
import { logger } from '../winston';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { travelsCollection } from '../collections/travels.collection';


export const travelMonthsService = {


    getTravelMonths: async (filters: any) => {
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


            return await travelMonthsCollection.getTravelMonths(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting travel data \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getTraveMonthById: async (id: string) => {
        try {
            return await travelMonthsCollection.getTravelMonthById(id);
        } catch (error) {
            logger.error(`\nError getting travel data \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getTravelMonthsBy: async (data: any) => {
        try {
            const { userId } = data;

            if (userId) {
                delete data.userId;
                data['user._id'] = userId;
            }

            return await travelMonthsCollection.getTravelMonthsBy(data);
        } catch (error) {
            logger.error(`\nError getting travel data by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateTravelMonthsById: async (id: string, travelMonth: TravelMonth) => {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            const actualTravelMonth = await travelMonthsCollection.getTravelMonthById(id);

            if (!actualTravelMonth) { return new Error('TravelMonthNotFound'); }


            if (!isEmpty(travelMonth.expenseDetails)) {
                for (let expenseDetail of travelMonth.expenseDetails) {
                    if (expenseDetail.status && !adminAuth) { delete expenseDetail.status }

                    if (expenseDetail.isEdit) {
                        expenseDetail.status = OpeVisaStatus.TO_VALIDATED;
                        delete expenseDetail.isEdit;
                    }

                    if (isEmpty(expenseDetail.attachments)) { continue; }
                    expenseDetail.attachments = saveAttachment(expenseDetail.attachments, id, travelMonth.dates.created);
                }
            }
            return await travelMonthsCollection.updateTravelMonthsById(id, travelMonth);
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    updateManyTravelMonths: async (travelMonths: TravelMonth[]) => {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            if (isEmpty(travelMonths)) { return new Error('TravelMonthsNotFound') }

            await Promise.all(travelMonths.map(async (travelMonth) => {
                const id = get(travelMonth, '_id');
                const actualTravelMonth = await travelMonthsCollection.getTravelMonthById(id);
                if (!actualTravelMonth) { return new Error('TravelMonthNotFound'); }

                if (!isEmpty(travelMonth.expenseDetails)) {
                    for (let expenseDetail of travelMonth.expenseDetails) {
                        if (expenseDetail.status && !adminAuth) { delete expenseDetail.status }

                        if (expenseDetail.isEdit) {
                            expenseDetail.status = OpeVisaStatus.TO_VALIDATED;
                            delete expenseDetail.isEdit;
                        }

                        if (isEmpty(expenseDetail.attachments)) { continue; }
                        expenseDetail.attachments = saveAttachment(expenseDetail.attachments, id, travelMonth.dates.created);
                    }
                }
                return await travelMonthsCollection.updateTravelMonthsById(id, travelMonth);

            }));
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    updateTravelMonthExpendeDetailsStatusById: async (id: string, data: any) => {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            if (!adminAuth) { return new Error('Forbidden') }
            const { status, rejectReason, validator, references } = data;


            let travelMonth = await travelMonthsCollection.getTravelMonthById(id);

            if (!travelMonth) { return new Error('TravelMonthNotFound') }

            const travel = await travelsCollection.getTravelById(travelMonth?.travelId);

            if (!travel) { return new Error('TravelNotFound') }

            if (status === OpeVisaStatus.REJECTED && (!rejectReason || rejectReason === '')) { return new Error('CannotRejectWithoutReason') }

            let updateData: any, tobeUpdated: any;

            updateData = { status };

            if (status === OpeVisaStatus.REJECTED) { updateData = { ...updateData, rejectReason } }

            if (!references) { return new Error('ReferenceNotProvided'); }

            const { expenseDetails } = travelMonth;


            for (const expenseDetailRef of references) {

                const expenseDetailIndex = expenseDetails.findIndex((elt) => elt.ref === expenseDetailRef);

                if (expenseDetailIndex < 0) { return new Error('BadReference') }

                expenseDetails[expenseDetailIndex].validators.push(validator);

                expenseDetails[expenseDetailIndex] = { ...expenseDetails[expenseDetailIndex], ...updateData }

            }

            tobeUpdated = { expenseDetails };

            const editors = !isEmpty(travel.editors) ? travel.editors : [];
            editors.push({
                fullName: `${authUser.fname} ${authUser.lname}`,
                date: moment().valueOf(),
                steps: 'expenseDetails'
            })

            travelMonth.expenseDetailsStatus = commonService.getOnpStatementStepStatus(travelMonth, 'expenseDetail');
            const expenseDetailAmount = commonService.getTotal(travelMonth.expenseDetails, 'stepAmount');

            travelMonth = { ...travelMonth, ...tobeUpdated };
            travelMonth.expenseDetailAmount = expenseDetailAmount;



            const result = await travelsCollection.updateTravelsById(travelMonth?.travelId, { editors });
            return await travelMonthsCollection.updateTravelMonthsById(id, travelMonth);

        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },


};

const saveAttachment = (attachements: Attachment[], id: string, date: number) => {
    for (let attachment of attachements) {
        if (!attachment.temporaryFile) { continue; }

        const content = filesService.readFile(attachment.temporaryFile.path);

        if (!content) { continue; }

        attachment.content = content;

        attachment = commonService.saveAttachment(id, attachment, date, 'travel');

        filesService.deleteDirectory(`temporaryFiles/${attachment?.temporaryFile?._id}`);
        delete attachment.temporaryFile;
    }

    return attachements;
}
