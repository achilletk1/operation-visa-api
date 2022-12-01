import { commonService } from './common.service';
import { logger } from '../winston';
import generateId from 'generate-unique-id';
import { visaTransactionsCeillingsCollection } from '../collections/visa-transactions-ceilings.collection';
import { travelsCollection } from '../collections/travels.collection';
import { Attachment, OpeVisaStatus, VisaCeilingType } from '../models/visa-operations';
import { notificationService } from './notification.service';
import { Travel, TravelType } from '../models/travel';
import httpContext from 'express-http-context';
import { filesService } from './files.service';
import { isEmpty, get } from 'lodash';
import moment = require('moment');
import { usersCollection } from '../collections/users.collection';
import { visaTransactionsCollection } from '../collections/visa-transactions.collection';
import { ObjectId } from 'mongodb';

export const travelService = {


    insertTravel: async (travel: Travel): Promise<any> => {
        try {
            const existingTravels = await travelsCollection.getTravelsBy({ 'user._id': get(travel, 'user._id'), $and: [{ 'proofTravel.dates.start': { $gte: travel.proofTravel.dates.start } }, { 'proofTravel.dates.end': { $lte: travel.proofTravel.dates.end } }] });

            if (!isEmpty(existingTravels)) { return new Error('TravelExistingInThisDateRange') }
            // Set travel status to pending
            travel.status = OpeVisaStatus.PENDING;

            // Set proofTravel status to pending
            travel.proofTravel.status = OpeVisaStatus.PENDING;

            // Set travel creation date
            travel.dates = { ...travel.dates, created: moment().valueOf() };

            // insert ceiling in travel
            const { data } = await visaTransactionsCeillingsCollection.getVisaTransactionsCeillings({ type: { '$in': [100, 400, 300] } }, 1, 40);
            const type = (+travel.travelType === TravelType.LONG_TERM_TRAVEL && +travel.proofTravel?.travelReason?.code === 300) ? 400 : (travel.travelType === TravelType.LONG_TERM_TRAVEL) ? 300 : 100;
            travel.ceiling = data.find(elt => +elt.type === type)?.value;

            // insert travel reference
            travel.travelRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`;

            const insertedId = await travelsCollection.insertTravel(travel);

            travel.proofTravel.proofTravelAttachs = saveAttachment(travel.proofTravel.proofTravelAttachs, insertedId, travel.dates.created);

            await travelsCollection.updateTravelsById(insertedId, { proofTravel: travel.proofTravel });
            const updateTravel = await travelsCollection.getTravelById(insertedId);


            //TODO send notification
            Promise.all([
                await notificationService.sendEmailTravelDeclaration(updateTravel, get(updateTravel, 'user.email')),
                // await notificationService.sendVisaTemplateEmail(travel, get(travel, 'user.email'), 'Déclaration de voyage', 'TravelDeclaration')
            ]);

            return insertedId;

        } catch (error) {
            logger.error(`travel creation failed \n${error?.name} \n${error?.stack}`);
            return error;
        }
    },

    insertTravelFromSystem: async (travel: Travel): Promise<any> => {
        try {
            const existingTravels = await travelsCollection.getTravelsBy({ 'user.clientCode': get(travel, 'user.clientCode'), $and: [{ 'proofTravel.dates.start': { $gte: travel.proofTravel.dates.start } }, { 'proofTravel.dates.end': { $lte: travel.proofTravel.dates.end } }] });


            if (!isEmpty(existingTravels)) { return new Error('TravelExistingInThisDateRange') }

            const user = await usersCollection.getUserBy({ clientCode: get(travel, 'user.clientCode') });

            if (user) {
                travel.user._id = user?._id.toString();
                travel.user.fullName = `${user?.fname} ${user?.lname}`;
                travel.user.email = user?.email;
            }

            // Set request status to created
            travel.status = OpeVisaStatus.PENDING;

            // Set travel creation date
            travel.dates = { ...travel.dates, created: moment().valueOf() };
            const firstDate = Math.min(...travel.transactions.map((elt => elt.date)));
            const lastDate = Math.min(...travel.transactions.map((elt => elt.date)));

            travel.proofTravel.dates = { start: firstDate, end: lastDate }
            travel.proofTravel.status = OpeVisaStatus.PENDING;

            const visaCeilingType = travel.proofTravel?.travelReason?.code === 300 ? VisaCeilingType.STUDYING_TRAVEL : VisaCeilingType.SHORT_TERM_TRAVEL;

            const ceiling = await visaTransactionsCeillingsCollection.getVisaTransactionsCeilingBy({ type: visaCeilingType });

            travel.ceiling = get(ceiling, 'value', 0);

            // insert travel reference
            travel.travelRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`;

            const insertedId = await travelsCollection.insertTravel(travel);


            travel.proofTravel.proofTravelAttachs = saveAttachment(travel.proofTravel.proofTravelAttachs, insertedId, travel.dates.created);

            await travelsCollection.updateTravelsById(insertedId, { proofTravel: travel.proofTravel });


            Promise.all([
                await notificationService.sendEmailDetectTravel(travel, get(travel, 'user.email')),
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

            if (travel.proofTravel.status && !adminAuth && travel.proofTravel.isEdit) { delete travel.proofTravel.status }

            if (travel.proofTravel && travel.proofTravel.isEdit) {
                travel.proofTravel.status = OpeVisaStatus.PENDING;
                delete travel.proofTravel.isEdit;
            }

            if (!isEmpty(travel.proofTravel.proofTravelAttachs)) {
                travel.proofTravel.proofTravelAttachs = saveAttachment(travel.proofTravel.proofTravelAttachs, id, travel.dates.created);
            }

            if (!isEmpty(travel.expenseDetails)) {
                for (let expenseDetail of travel.expenseDetails) {
                    if (expenseDetail.status && !adminAuth && expenseDetail.isEdit) { delete expenseDetail.status }

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
                    if (othersAttachement.status && !adminAuth && othersAttachement.isEdit) { delete othersAttachement.status }

                    if (othersAttachement.isEdit) {
                        othersAttachement.status = OpeVisaStatus.PENDING;
                        delete othersAttachement.isEdit;
                    }

                    if (isEmpty(othersAttachement.attachments)) { continue; }

                    othersAttachement.attachments = saveAttachment(othersAttachement.attachments, id, travel.dates.created);
                }
            }

            if (adminAuth && travel.proofTravel.status === OpeVisaStatus.ACCEPTED) {
                travel = await VerifyTravelTransactions(id, travel);
            }

            const result = await travelsCollection.updateTravelsById(id, travel);

            let updatedTravel = await travelsCollection.getTravelById(id);

            const status = getTravelStatus(updatedTravel);

            if (status !== updatedTravel.status) {
                await travelsCollection.updateTravelsById(id, { status });
                await Promise.all([
                    travelsCollection.updateTravelsById(id, { status }),
                    notificationService.sendEmailTravelStatusChanged(updatedTravel, get(updatedTravel, 'travel.user.email', ''))
                ]);
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

            await notificationService.sendEmailStepStatusChanged(tobeUpdated, step, get(tobeUpdated, 'user.email'));

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
                travel?.proofTravel?.validators.forEach((elt: any) => { elt.status = travel?.proofTravel?.status, elt.step = 'Preuve de voyage' })
                validators.push(...travel?.proofTravel?.validators)
            }

            travel?.expenseDetails?.forEach(expense => {
                if ('validators' in expense) {
                    expense?.validators.forEach((elt: any) => { elt.status = expense?.status, elt.step = 'Etat détaillé des dépenses' });
                    validators.push(...expense.validators)
                }
            })

            travel?.othersAttachements?.forEach(expense => {
                if ('validators' in expense) {
                    expense?.validators.forEach((elt: any) => { elt.status = expense?.status, elt.step = 'Autres justificatifs' });
                    validators.push(...expense.validators)
                }
            })

            return validators;

        } catch (error) {
            logger.error(`\nError getting vis transactions \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getTravelRangesTransactions: async (fields: any): Promise<any> => {

        const { start, end, clientCode } = fields;
        commonService.parseNumberFields(fields);
        let transactionQuery: any;
        let travelQuery: any;

        if (start) {
            transactionQuery = { date: { $gte: +start } };
            travelQuery = { "proofTravel.dates.start": { $gte: +start } };
        }
        if (start) {
            transactionQuery.date['$lte'] = +end;
            travelQuery = { ...travelQuery, "proofTravel.dates.end": { $lte: +end } };
        }
        if (clientCode) {
            transactionQuery.clientCode = clientCode;
            travelQuery['user.clientCode'] = clientCode
        }

        transactionQuery.clientCode = clientCode;
        travelQuery['user.clientCode'] = clientCode


        const transactions = await visaTransactionsCollection.getVisaTransactionsBy(transactionQuery);

        if (transactions instanceof Error) { return transactions; }


        const travels = await travelsCollection.getTravelsBy(travelQuery)

        if (travels instanceof Error) { return travels; }

        return { travels, transactions };


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


const VerifyTravelTransactions = async (id: string, travel: Travel): Promise<any> => {

    const existingTravels = await travelsCollection.getTravelsBy({ _id: { $ne: new ObjectId(id) }, "user.clientCode": travel?.user?.clientCode, "proofTravel.dates.start": { $gte: travel?.proofTravel?.dates?.start }, "proofTravel.dates.end": { $gte: travel?.proofTravel?.dates?.end } });

    if (isEmpty(existingTravels)) { return travel; }

    const ids = [];
    for (const data of existingTravels) {
        travel.proofTravel.continents.push(...data.proofTravel.continents);
        travel.proofTravel.countries.push(...data.proofTravel.countries);
        travel.proofTravel.proofTravelAttachs.push(...data.proofTravel.proofTravelAttachs);
        if (data.proofTravel.isTransportTicket) { travel.proofTravel.isTransportTicket = true; }
        if (data.proofTravel.isVisa) { travel.proofTravel.isVisa = true; }
        if (data.proofTravel.isPassIn) { travel.proofTravel.isPassIn = true; }
        if (data.proofTravel.isPassOut) { travel.proofTravel.isPassOut = true; }
        travel.transactions.push(...data?.transactions);
        ids.push(new ObjectId(data._id.toString()));
    }

    travel.proofTravel.continents = [...new Set(travel.proofTravel.continents)];
    const countries = [];
    travel.proofTravel.countries.forEach((elt) => {
        if (!countries.find((e) => e.name === elt.name)) { countries.push(elt) }
    });

    travel.proofTravel.countries = countries;

    await travelsCollection.deleteTravels({ _id: { $in: ids } });

    return travel;
}