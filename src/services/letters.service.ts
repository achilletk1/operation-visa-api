import { cbsService } from './cbs.service';
import { Letter } from '../models/letter';
import { lettersCollection } from '../collections/letters.collection';
import { logger } from '../winston';
import { commonService } from './common.service';
import * as exportsHelper from './helpers/exports.helper'


export const lettersService = {

    getLettersVariables: async () => {
        try {
            const variables = await cbsService.getCbsUserVariables();
            variables.push(...[
                'SYSTEM_TODAY_LONG',
                'SYSTEM_TODAY_SHORT',
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



    generateExportView: async (letter: Letter) => {
        try {

            if (!letter) { return new Error('LetterNotFound') }

            const pdfStringEn = await exportsHelper.generateFormalNoticeLetter(letter.pdf.en, {}, letter.pdf.signature, true);

            if (pdfStringEn instanceof Error) { return pdfStringEn; }

            const pdfStringFr = await exportsHelper.generateFormalNoticeLetter(letter.pdf.fr, {},letter.pdf.signature, true);

            if (pdfStringFr instanceof Error) { return pdfStringFr; }

            return { en: pdfStringEn, fr: pdfStringFr };
        } catch (error) {
            logger.error(`\nError generateExportView \n${error.message}\n${error.stack}\n`);
            return error;
        }

    },

};
