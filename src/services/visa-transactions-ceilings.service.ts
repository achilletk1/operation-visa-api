import { visaTransactionsCeillingsCollection } from '../collections/visa-transactions-ceilings.collection';
import { commonService } from './common.service';
import { logger } from '../winston';

export const visaTransactionsCeilingsService = {

    getVisaTransactionsCeillings: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;
            return await visaTransactionsCeillingsCollection.getVisaTransactionsCeillings(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting visa operations \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getVisaTransactionsCeillingsById: async (id: any) => {
        try {
            return await visaTransactionsCeillingsCollection.getVisaTransactionsCeillingsById(id);
        } catch (error) {
            logger.error(`\nError getting vis transactions \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getVisaTransactionsCeillingsBy: async (data: any) => {
        try {
            return await visaTransactionsCeillingsCollection.getVisaTransactionsCeillingsBy(data);
        } catch (error) {
            logger.error(`\nError getting visa trnsactions by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    // updateVisaTransactionsCeillingsById: async (id: any, data: any) => {
    //     try {
    //         return await visaTransactionsCeillingsCollection.updateVisaTransactionsCeillingsById(id, data);
    //     } catch (error) {
    //         logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
    //         return error;
    //     }
    // }
    getVisaTransactionCeillingsBy: async (data: any) => {
        try {
            return await visaTransactionsCeillingsCollection.getVisaTransactionsCeilingBy(data);
        } catch (error) {
            logger.error(`\nError getting visa trnsactions by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
};