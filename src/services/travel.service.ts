import { isEmpty } from 'lodash';
import { encode, decode } from './helpers/url-crypt/url-crypt.service.helper';
import * as helper from './helpers/visa-operations.service.helper';
import { commonService } from './common.service';
import { logger } from '../winston';
import { config } from '../config';
import * as generateId from 'generate-unique-id';
import moment = require('moment');
import { travelsCollection } from '../collections/travel.collection';
import { filesService } from './files.service';
import { Travel, TravelAttachement } from '../models/travel';
import { OpeVisaStatus } from '../models/visa-operations';


export const travelService = {


    insertTravel: async (travel: Travel): Promise<any> => {
        try {

            // Set request status to created
            travel.status = OpeVisaStatus.WAITING;

            // Set travel creation date
            travel.dates = { ...travel.dates, created: moment().valueOf() };

            // insert permanent transfers
            travel.travelRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`;

            if (!isEmpty(travel.proofTravel.proofTravelAttachs)) {
                travel.proofTravel.proofTravelAttachs = await Promise.all(travel.proofTravel.proofTravelAttachs.map(async (e) => {
                    return await saveAttachement(travel.travelRef.toString(), e, travel.dates.created);
                }));
            }

            const result = await travelsCollection.insertTravel(travel);

            //TODO send notification

            const data = { _id: result };

            return data;

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
            return await travelsCollection.getTravelsBy(data);
        } catch (error) {
            logger.error(`\nError getting travel data by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateTravelById: async (id: string, travel: Travel) => {
        try {
            // delete proof step's status and attachment
            delete travel.proofTravel.status;
            delete travel.proofTravel.proofTravelAttachs;

            // delete expense step's status and attachment
            delete travel.expenseAttachements.status;
            delete travel.expenseAttachements.attachments;

            // delete others step's status and attachment
            delete travel.othersAttachements.status;
            delete travel.othersAttachements.attachments;
            return await travelsCollection.updateTravelsById(id, travel);
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
            const { status, step, rejectReason, validator, expenseDetailRef } = data;

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


            if (step === 'expenseAttachements') {
                let { expenseAttachements } = travel;
                expenseAttachements.validators.push(validator);
                expenseAttachements = { ...expenseAttachements, ...updateData }
                tobeUpdated = { expenseAttachements };
            }

            if (step === 'expenseDetails') {
                if (!expenseDetailRef) { return new Error('ReferenceNotProvided'); }

                const { expenseDetails } = travel;

                const expenseDetailIndex = expenseDetails.findIndex((elt) => elt.ref === expenseDetailRef);

                if (expenseDetailIndex < 0) { return new Error('BadReference') }

                expenseDetails[expenseDetailIndex].validators.push(validator);

                expenseDetails[expenseDetailIndex] = { ...expenseDetails[expenseDetailIndex], ...updateData }

                tobeUpdated = { expenseDetails };
            }

            if (step === 'othersAttachements') {
                let { othersAttachements } = travel;
                othersAttachements.validators.push(validator);
                othersAttachements = { ...othersAttachements, ...updateData }
                tobeUpdated = othersAttachements;
            }

            //TODO send notifications for status update
            return await travelsCollection.updateTravelsById(id, tobeUpdated);
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    postAttachment: async (id: string, data: any, attachement: TravelAttachement) => {

        const { step } = data;

        if (!step || !['proofTravel', 'expenseAttachements', 'othersAttachements'].includes(step)) { return new Error('StepNotProvided') };

        const travel = await travelsCollection.getTravelById(id);

        if (!travel) { return new Error('TravelNotFound') }

        const { travelRef } = travel;

        const updatedAttachment = await saveAttachement(travelRef, attachement, travel.dates.created);

        if (!updatedAttachment || updatedAttachment instanceof Error) { return new Error('ErrorSavingAttachment'); }

        let tobeUpdated: any;

        if (step === 'proofTravel') {
            let { proofTravel } = travel;
            proofTravel.proofTravelAttachs.push(updatedAttachment);
            tobeUpdated = { proofTravel };
        }


        if (step === 'expenseAttachements') {
            const { expenseAttachements } = travel;
            expenseAttachements.attachments.push(updatedAttachment);
            tobeUpdated = { expenseAttachements };
        }


        if (step === 'othersAttachements') {
            const { othersAttachements } = travel;
            othersAttachements.attachments.push(updatedAttachment);
            tobeUpdated = { othersAttachements };
        }

        return await travelsCollection.updateTravelsById(id, tobeUpdated);


    },

    updateAttachment: async (id: string, data: any, attachement: TravelAttachement) => {

        const { step, path } = data;

        if (!step || !['proofTravel', 'expenseAttachements', 'othersAttachements'].includes(step)) { return new Error('StepNotProvided') };

        const travel = await travelsCollection.getTravelById(id);

        if (!travel) { return new Error('TravelNotFound') }

        const { travelRef } = travel;

        filesService.deleteFile(path);

        const updatedAttachment = await saveAttachement(travelRef, attachement, travel.dates.created);

        if (!updatedAttachment || updatedAttachment instanceof Error) { return new Error('ErrorSavingAttachment'); }

        let tobeUpdated: any;

        if (step === 'proofTravel') {
            let { proofTravel } = travel;

            const index = proofTravel.proofTravelAttachs.findIndex((elt) => elt.path === path);

            if (index < 0) { return new Error('BadPath') }

            proofTravel.proofTravelAttachs[index] = updatedAttachment;
            tobeUpdated = { proofTravel };
        }


        if (step === 'expenseAttachements') {
            const { expenseAttachements } = travel;

            const index = expenseAttachements.attachments.findIndex((elt) => elt.path === path);

            if (index < 0) { return new Error('BadPath') }

            expenseAttachements.attachments[index] = updatedAttachment;
            tobeUpdated = { expenseAttachements };
        }


        if (step === 'othersAttachements') {
            const { othersAttachements } = travel;

            const index = othersAttachements.attachments.findIndex((elt) => elt.path === path);

            if (index < 0) { return new Error('BadPath') }

            othersAttachements.attachments[index] = updatedAttachment;
            tobeUpdated = { othersAttachements };
        }

        return await travelsCollection.updateTravelsById(id, tobeUpdated);


    },

    generateExportLinks: async (id: string, data: any) => {

        const { path, name, contentType } = data;

        const travel = await travelsCollection.getTravelById(id);

        if (!travel) { return new Error('TravelDataNotFound') }


        const file = filesService.readFile(path);

        if (!file) { return new Error('Forbbiden'); }

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { path, ttl, id, name, contentType };

        const code = encode(options);

        const basePath = `${config.get('basePath')}/travels/${id}/attachements/export`

        return {
            link: `${config.get('baseUrl')}${basePath}/${code}`
        }
    },

    generateExportData: async (id: string, code: string) => {
        let options: any;

        try {
            options = decode(code);
        } catch (error) {
            return new Error('BadExportCode');
        }

        const { ttl, path, name, contentType } = options;

        if ((new Date()).getTime() >= ttl) {
            return new Error('ExportLinkExpired');
        }
        const data = filesService.readFile(path);
        const buffer = Buffer.from(data, 'base64');

        const fileName = `export_${new Date().getTime()}-${name}`

        return { contentType, fileContent: buffer, fileName };

    },
    generateExportView: async (id: string, path: any) => {
        try {

            const request = await travelsCollection.getTravelById(id);
            if (!request) { return new Error('OperatonNotFound') }
            const fileContent = filesService.readFile(path);
            const contentType = helper.getContentTypeByExtension(path.split('.')[1]);
            const fileName = `export_${new Date().getTime()}-${path}`
            return { contentType, fileContent, fileName };
        } catch (error) {
            logger.error(`\nError generateExportView \n${error.message}\n${error.stack}\n`);
            return error;
        }

    },

};

const saveAttachement = async (ref: string, attachement: TravelAttachement, created: number) => {
    try {
        const { content, label, contentType } = attachement;
        delete attachement.content
        const date = moment(created).format('MM-YY');
        const path = `${date}/${ref}`;
        const extension = helper.getExtensionByContentType(contentType);
        const filename = `${date}_${ref}_${label}${extension}`;
        filesService.writeFile(content, path, filename);
        attachement.path = `${path}/${filename}`;
        attachement.name = filename;
        return attachement;
    } catch (error) {
        logger.error(`\nError saving attachement \n${error.message}\n${error.stack}\n`);
        return error;
    }
}
