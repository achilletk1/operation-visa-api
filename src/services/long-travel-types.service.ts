import { logger } from '../winston';
import { commonService } from './common.service';
import moment = require('moment');
import { longTravelTypesCollection } from '../collections/long-travel-types.collection';
import { LongTravelType } from '../models/settings';


export const longTravelTypesService = {

    getLongTravelTypes: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;
            const { data, total } = await longTravelTypesCollection.getLongTravelTypes(filters || {}, offset || 1, limit || 40);
            return { data, total }
        } catch (error) {
            logger.error(`\nError getting LongTravelTypes \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getLongTravelTypesById: async (id: string) => {
        try {
            const result = await longTravelTypesCollection.getLongTravelTypesById(id);
            return result
        } catch (error) {
            logger.error(`\nError getting LongTravelType \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    insertLongTravelTypes: async (data: LongTravelType) => {
        try {
            const subTypes = await longTravelTypesCollection.getLongTravelTypesBy({});
            const foundIndex = subTypes.findIndex((e) => e.label === data.label);
            if (foundIndex > -1) { return new Error('DataAlreadyExist') }
            data.dates = {created : moment().valueOf()};
            return await longTravelTypesCollection.insertLongTravelTypes(data);
        } catch (error) {
            logger.error(`\nError getting LongTravelType \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getLongTravelTypesBy: async (data: any) => {
        try {
            return await longTravelTypesCollection.getLongTravelTypesBy(data);
        } catch (error) {
            logger.error(`\nError getting LongTravelType by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateLongTravelTypesById: async (id: string, data: any) => {
        try {
            const subTypes = await longTravelTypesCollection.getLongTravelTypesBy({});
            const foundIndex = subTypes.findIndex((e) => e.label === data.label && e._id.toString() !== id);
            if (foundIndex > -1) { return new Error('DataAlreadyExist') }
            data.dates.updated = moment().valueOf();
            return await longTravelTypesCollection.updateLongTravelTypesById(id, data);
        } catch (error) {
            logger.error(`\nError updating LongTravelType  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    deleteLongTravelType: async (id: string) => {
        try {
            return await longTravelTypesCollection.deleteLongTravelType(id);
        } catch (error) {
            logger.error(`\nError updating LongTravelType  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

};
