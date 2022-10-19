import { travelMonthsCollection } from './../collections/travel-months.collection';
import { commonService } from './common.service';
import { logger } from '../winston';
import { TravelMonth } from '../models/travel';


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
    updateTravelMonthsById: async (id: string, data: TravelMonth) => {
        try {
            return await travelMonthsCollection.updateTravelMonthsById(id, data);
        } catch (error) {
            logger.error(`\nError updating travel data  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },


};
