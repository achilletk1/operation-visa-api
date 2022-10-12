import { logger } from '../winston';
import { commonService } from './common.service';
import moment = require('moment');
import { propertyAndServicesTypesCollection } from '../collections/property-and-services-types.collection';
import { PropertyAndServicesType } from '../models/settings';


export const propertyAndServicesTypesService = {

    getPropertyAndServicesTypes: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;
            const { data, total } = await propertyAndServicesTypesCollection.getPropertyAndServicesTypes(filters || {}, offset || 1, limit || 40);
            return { data, total }
        } catch (error) {
            logger.error(`\nError getting PropertyAndServicesTypes \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getPropertyAndServicesTypesById: async (id: string) => {
        try {
            const result = await propertyAndServicesTypesCollection.getPropertyAndServicesTypesById(id);
            return result
        } catch (error) {
            logger.error(`\nError getting PropertyAndServicesType \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    insertPropertyAndServicesTypes: async (data: PropertyAndServicesType) => {
        try {
            const subTypes = await propertyAndServicesTypesCollection.getPropertyAndServicesTypesBy({});
            const foundIndex = subTypes.findIndex((e) => e.label === data.label);
            if (foundIndex > -1) { return new Error('DataAlreadyExist') }
            data.dates = {created : moment().valueOf()};
            return await propertyAndServicesTypesCollection.insertPropertyAndServicesTypes(data);
        } catch (error) {
            logger.error(`\nError getting PropertyAndServicesType \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getPropertyAndServicesTypesBy: async (data: any) => {
        try {
            return await propertyAndServicesTypesCollection.getPropertyAndServicesTypesBy(data);
        } catch (error) {
            logger.error(`\nError getting PropertyAndServicesType by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updatePropertyAndServicesTypesById: async (id: string, data: any) => {
        try {
            const subTypes = await propertyAndServicesTypesCollection.getPropertyAndServicesTypesBy({});
            const foundIndex = subTypes.findIndex((e) => e.label === data.label && e._id.toString() !== id);
            if (foundIndex > -1) { return new Error('DataAlreadyExist') }
            data.dates.updated = moment().valueOf();
            return await propertyAndServicesTypesCollection.updatePropertyAndServicesTypesById(id, data);
        } catch (error) {
            logger.error(`\nError updating PropertyAndServicesType  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    deletePropertyAndServicesType: async (id: string) => {
        try {
            return await propertyAndServicesTypesCollection.deletePropertyAndServicesType(id);
        } catch (error) {
            logger.error(`\nError updating PropertyAndServicesType  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

};
