import { travelMonthsCollection } from './../collections/travel-months.collection';
import { commonService } from './common.service';
import { logger } from '../winston';
import { TravelMonth } from '../models/travel';
import { isEmpty } from 'lodash';
import { Attachment } from '../models/visa-operations';
import { filesService } from './files.service';


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

            const actualTravelMonth = await travelMonthsCollection.getTravelMonthById(id);

            if (!actualTravelMonth) { return new Error('TravelMonthNotFound'); }


            if (!isEmpty(travelMonth.expenseDetails)) {
                for (let expenseDetail of travelMonth.expenseDetails) {
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
