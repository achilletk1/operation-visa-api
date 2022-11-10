import { commonService } from './common.service';
import { logger } from '../winston';
import * as generateId from 'generate-unique-id';
import moment = require('moment');
import { travelsCollection } from '../collections/travels.collection';
import { filesService } from './files.service';
import { Travel } from '../models/travel';
import { Attachment, OpeVisaStatus } from '../models/visa-operations';
import { notificationService } from './notification.service';
import { isEmpty, get } from 'lodash';
import * as httpContext from 'express-http-context';


export const travelService = {


    insertTravel: async (travel: Travel): Promise<any> => {
        try {
            const existingTravels = await travelsCollection.getTravelsBy({ 'user._id': get(travel, 'user._id'), $and: [{ 'proofTravel.dates.start': { $gte: travel.proofTravel.dates.start } }, { 'proofTravel.dates.end': { $lte: travel.proofTravel.dates.end } }] });

            if (!isEmpty(existingTravels)) { return new Error('TravelExistingInThisDateRange') }
            // Set request status to created
            travel.status = OpeVisaStatus.PENDING;

            // Set travel creation date
            travel.dates = { ...travel.dates, created: moment().valueOf() };

            travel.ceiling = travel.proofTravel?.travelReason?.code === 300 ? 2000000 : 5000000;

            // insert travel reference
            travel.travelRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`;

            const insertedId = await travelsCollection.insertTravel(travel);


            travel.proofTravel.proofTravelAttachs = saveAttachment(travel.proofTravel.proofTravelAttachs, insertedId, travel.dates.created);

            await travelsCollection.updateTravelsById(insertedId, { proofTravel: travel.proofTravel });


            //TODO send notification
            Promise.all([
                //await notificationService.sendEmailTravelDeclaration(travel, get(travel, 'user.email')),
                await notificationService.sendVisaTemplateEmail(travel, get(travel, 'user.email'), 'Déclaration de voyage', 'TravelDeclaration')
            ]);

            return insertedId;

        } catch (error) {
            logger.error(`travel creation failed \n${error?.name} \n${error?.stack}`);
            return error;
        }
    },

    getTravels: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;

            const { userId, name } = filters;

            if (userId) {
                delete filters.userId;
                filters['user._id'] = userId;
            }

            if (name) {
                delete filters.name;
                filters['user.fullName'] = name;
            }

            return await travelsCollection.getTravels(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting travel data \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getTravelById: async (id: string) => {
        try {
            return await travelsCollection.getTravelById(id);
        } catch (error) {
            logger.error(`\nError getting travel data \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getTravelsBy: async (data: any) => {
        try {
            const { userId } = data;

            if (userId) {
                delete data.userId;
                data['user._id'] = userId;
            }
            return await travelsCollection.getTravelsBy(data);
        } catch (error) {
            logger.error(`\nError getting travel data by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    updateTravelById: async (id: string, travel: Travel) => {
        try {
            const authUser = httpContext.get('user');
            const adminAuth = authUser?.category >= 600 && authUser?.category < 700;

            if (travel.proofTravel.status && !adminAuth) { delete travel.proofTravel.status }

            if (travel.proofTravel && travel.proofTravel.isEdit) {
                travel.proofTravel.status = OpeVisaStatus.PENDING;
                delete travel.proofTravel.isEdit;
            }

            if (!isEmpty(travel.proofTravel.proofTravelAttachs)) {
                travel.proofTravel.proofTravelAttachs = saveAttachment(travel.proofTravel.proofTravelAttachs, id, travel.dates.created);
            }

            if (!isEmpty(travel.expenseDetails)) {
                for (let expenseDetail of travel.expenseDetails) {
                    if (expenseDetail.status && !adminAuth) { delete expenseDetail.status }
                    
                    if (expenseDetail.isEdit) {
                        expenseDetail.status = OpeVisaStatus.PENDING;
                        delete expenseDetail.isEdit;
                    }

                    if (isEmpty(expenseDetail.attachments)) { continue; }
                    expenseDetail.attachments = saveAttachment(expenseDetail.attachments, id, travel.dates.created);
                }
            }

            if (!isEmpty(travel.othersAttachements)) {
                for (let othersAttachement of travel.othersAttachements) {
                    if (othersAttachement.status && !adminAuth) { delete othersAttachement.status }

                    if (othersAttachement.isEdit) {
                        othersAttachement.status = OpeVisaStatus.PENDING;
                        delete othersAttachement.isEdit;
                    }

                    if (isEmpty(othersAttachement.attachments)) { continue; }

                    othersAttachement.attachments = saveAttachment(othersAttachement.attachments, id, travel.dates.created);
                }
            }

            const result = await travelsCollection.updateTravelsById(id, travel);

            let upadatedTravel = await travelsCollection.getTravelById(id);

            const status = getTravelStatus(upadatedTravel);

            if (status !== upadatedTravel.status) {
                await travelsCollection.updateTravelsById(id, { status });
                //TODO send notifications for status update
            }
            return result;
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    updateTravelStatusById: async (id: string, data: any) => {
        try {
            const { status } = data;
            const travel = await travelsCollection.getTravelById(id);

            if (!travel) { return new Error('TravelNotFound') }

            //TODO send notifications for status update
            return await travelsCollection.updateTravelsById(id, { status });

        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    updateTravelStepStatusById: async (id: string, data: any) => {
        try {
            const { status, step, rejectReason, validator, expenseDetailRef: expenseDetailRefs } = data;

            if (!step || !['proofTravel', 'expenseDetails', 'expenseAttachements', 'othersAttachements'].includes(step)) { return new Error('StepNotProvided') };

            const travel = await travelsCollection.getTravelById(id);

            if (!travel) { return new Error('TravelNotFound') }

            if (status === OpeVisaStatus.REJECTED && (!rejectReason || rejectReason === '')) { return new Error('CannotRejectWithoutReason') }

            let updateData, tobeUpdated: any;

            updateData = { status };

            if (status === OpeVisaStatus.REJECTED) { updateData = { ...updateData, rejectReason } }

            if (step === 'proofTravel') {
                let { proofTravel } = travel;
                proofTravel.validators.push(validator);
                proofTravel = { ...proofTravel, ...updateData }
                tobeUpdated = { proofTravel };
            }

            if (step === 'expenseDetails') {
                if (!expenseDetailRefs) { return new Error('ReferenceNotProvided'); }

                const { expenseDetails } = travel;

                for (const expenseDetailRef of expenseDetailRefs) {

                    const expenseDetailIndex = expenseDetails.findIndex((elt) => elt.ref === expenseDetailRef);

                    if (expenseDetailIndex < 0) { return new Error('BadReference') }

                    expenseDetails[expenseDetailIndex].validators.push(validator);

                    expenseDetails[expenseDetailIndex] = { ...expenseDetails[expenseDetailIndex], ...updateData }

                }

                tobeUpdated = { expenseDetails };
            }

            //TODO send notifications for status update

            return await travelsCollection.updateTravelsById(id, tobeUpdated);
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getValidationsTravel: async (id: string) => {
        let validators: any[] = [];
        try {
            const travel = await travelsCollection.getTravelById(id);

            if ('validators' in travel?.proofTravel) {
                validators.push(...travel?.proofTravel?.validators)
            }

            travel?.expenseDetails?.forEach(expense => {
                if ('validators' in expense) {
                    validators.push(...expense.validators)
                }
            })

            travel?.othersAttachements?.forEach(expense => {
                if ('validators' in expense) {
                    validators.push(...expense.validators)
                }
            })

            return validators;

        } catch (error) {
            logger.error(`\nError getting vis transactions \n${error.message}\n${error.stack}\n`);
            return error;
        }
    }
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


const getTravelStatus = (travel: Travel): OpeVisaStatus => {

    if (!travel) { throw new Error('TravelNotDefined'); }

    if (
        travel?.proofTravel.status === OpeVisaStatus.ACCEPTED &&
        !isEmpty(travel?.expenseDetails) &&
        travel.expenseDetails?.every((elt) => elt.status === OpeVisaStatus.ACCEPTED) &&
        travel.othersAttachements?.every((elt) => elt.status === OpeVisaStatus.ACCEPTED)
    ) {
        return OpeVisaStatus.ACCEPTED;
    } else {
        return travel.status === OpeVisaStatus.ACCEPTED ? OpeVisaStatus.PENDING : travel.status;
    }
}