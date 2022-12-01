import { visaTransactionsCollection } from '../collections/visa-transactions.collection';
import { commonService } from './common.service';
import { logger } from '../winston';

export const visaTransactionsService = {

    getVisaTransactions: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit} = filters;

            delete filters.offset;
            delete filters.limit;
            return await visaTransactionsCollection.getVisaTransactions(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting visa operations \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },


    getVisaTransactionById: async (id: string) => {
        try {
            return await visaTransactionsCollection.getVisaTransactionsById(id);
        } catch (error) {
            logger.error(`\nError getting visa transaction by id \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    
}