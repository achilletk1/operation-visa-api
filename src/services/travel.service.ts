import { encode, decode } from './helpers/url-crypt/url-crypt.service.helper';
import * as helper from './helpers/visa-operations.service.helper';
import { commonService } from './common.service';
import { logger } from '../winston';
import { config } from '../config';
import * as generateId from 'generate-unique-id';
import moment = require('moment');
import { travelsCollection } from '../collections/travels.collection';
import { filesService } from './files.service';
import { Travel } from '../models/travel';
import { Attachment, OpeVisaStatus } from '../models/visa-operations';
import { notificationService } from './notification.service';
import { isEmpty } from 'lodash';


export const travelService = {


    insertTravel: async (travel: Travel): Promise<any> => {
        try {
            const existingTravels = travelsCollection.getTravelsBy({ $and: [{ 'proofTravel.dates.start': { $gte: travel.proofTravel.dates.start } }, { 'proofTravel.dates.end': { $lte: travel.proofTravel.dates.end } }] });

            if (isEmpty(existingTravels)) { return new Error('TravelExistingInThisDateRange') }
            // Set request status to created
            travel.status = OpeVisaStatus.PENDING;

            // Set travel creation date
            travel.dates = { ...travel.dates, created: moment().valueOf() };

            // insert travel reference
            travel.travelRef = `${moment().valueOf() + generateId({ length: 3, useLetters: false })}`;

            const insertedId = await travelsCollection.insertTravel(travel);


            for (const attachment of travel.proofTravel.proofTravelAttachs) {
                if (!attachment.temporaryFile) { continue; }

                const content = filesService.readFile(attachment.temporaryFile.path);

                if (!content) { continue; }

                attachment.content = content;
                
                attachment.path = commonService.saveAttachment(insertedId, attachment, travel.dates?.created);
                
                filesService.deleteFile(attachment.temporaryFile.path);
                delete attachment.temporaryFile;
            }

            await travelsCollection.updateTravelsById(insertedId, travel);
/* 
        
            //TODO send notification
            Promise.all([
                await notificationService.sendEmailVisaDepassment(data, 'samory.takougne@londo-tech.com')
            ]);

            return data; */

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

            /*    if (step === 'othersAttachements') {
                   let { othersAttachements } = travel;
                   othersAttachements.validators.push(validator);
                   othersAttachements = { ...othersAttachements, ...updateData }
                   tobeUpdated = { othersAttachements };
               } */

            //TODO send notifications for status update

            return await travelsCollection.updateTravelsById(id, tobeUpdated);
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    postAttachment: async (id: string, data: any, attachement: Attachment) => {

        const { step, expenseDetailRef } = data;

        if (!step || !['proofTravel', 'expenseAttachements', 'othersAttachements'].includes(step)) { return new Error('StepNotProvided') };

        const travel = await travelsCollection.getTravelById(id);

        if (!travel) { return new Error('TravelNotFound') }

        const { travelRef } = travel;

        const updatedAttachment = await commonService.saveAttachment(travelRef, attachement, travel.dates.created);

        if (!updatedAttachment || updatedAttachment instanceof Error) { return new Error('ErrorSavingAttachment'); }

        let tobeUpdated: any;

        if (step === 'proofTravel') {
            let { proofTravel } = travel;
            proofTravel.proofTravelAttachs.push(updatedAttachment);
            tobeUpdated = { proofTravel };
        }


        /*  if (step === 'othersAttachements') {
             const { othersAttachements } = travel;
             othersAttachements.attachments.push(updatedAttachment);
             tobeUpdated = { othersAttachements };
         }
  */
        return await travelsCollection.updateTravelsById(id, tobeUpdated);


    },

    updateAttachment: async (id: string, data: any, attachement: Attachment) => {

        const { step, path, expenseDetailRef } = data;

        if (!step || !['proofTravel', 'expenseAttachements', 'othersAttachements'].includes(step)) { return new Error('StepNotProvided') };

        const travel = await travelsCollection.getTravelById(id);

        if (!travel) { return new Error('TravelNotFound') }

        const { travelRef } = travel;

        filesService.deleteFile(path);

        const updatedAttachment = await commonService.saveAttachment(travelRef, attachement, travel.dates.created);

        if (!updatedAttachment || updatedAttachment instanceof Error) { return new Error('ErrorSavingAttachment'); }

        let tobeUpdated: any;

        if (step === 'proofTravel') {
            let { proofTravel } = travel;

            const index = proofTravel.proofTravelAttachs.findIndex((elt) => elt.path === path);

            if (index < 0) { return new Error('BadPath') }

            proofTravel.proofTravelAttachs[index] = updatedAttachment;
            tobeUpdated = { proofTravel };
        }


        /*  if (step === 'othersAttachements') {
             const { othersAttachements } = travel;
 
             const index = othersAttachements.attachments.findIndex((elt) => elt.path === path);
 
             if (index < 0) { return new Error('BadPath') }
 
             othersAttachements.attachments[index] = updatedAttachment;
             tobeUpdated = { othersAttachements };
         } */

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

