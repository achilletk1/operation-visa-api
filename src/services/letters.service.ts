import { cbsService } from './cbs.service';
import { Letter } from '../models/letter';
import { lettersCollection } from '../collections/letters.collection';
import { logger } from '../winston';
import { commonService } from './common.service';


export const lettersService = {

    getLettersVariables: async () => {
        try {
            const variables = await cbsService.getCbsUserVariables();
            variables.push(...[
                'SYSTEM_LONG_DATE',
                'SYSTEM_SHORT_DATE',
            ]);

            return variables;
        } catch (error) {
            logger.error(`\nError getting letters variables \n${error.message}\n${error.stack}\n`);

        }
    },
    getLetters: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;
            return await lettersCollection.getLetters(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting visa operations \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getLetterById: async (id: string) => {
        try {
            return await lettersCollection.getLetterById(id);
        } catch (error) {
            logger.error(`\nError getting vis transactions \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getLetterBy: async (data: any) => {
        try {
            return await lettersCollection.getLetterBy(data);
        } catch (error) {
            logger.error(`\nError getting visa trnsactions by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateLetterById: async (id: string, data: any) => {
        try {
            const vourchers = await lettersCollection.getLetterBy({});
            const foundIndex = vourchers.findIndex((e) => e.label === data.label && e._id.toString() !== id);
            if (foundIndex > -1) { return new Error('VourcherAlreadyExist') }
            return await lettersCollection.updateLetterById(id, data);
        } catch (error) {
            logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    deleteLetter: async (id: string) => {
        try {
            return await lettersCollection.deleteLetter(id);
        } catch (error) {
            logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    insertLetter: async (data: Letter) => {
        try {
            return await lettersCollection.insertLetter(data);
        } catch (error) {
            logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

};
