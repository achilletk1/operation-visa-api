import { TemplateForm } from './../models/templates';
import { templatesCollection } from '../collections/templates.collection';
import { logger } from '../winston';
import { commonService } from './common.service';
import { VariableCollection } from '../collections/variables';


export const templatesService = {

    getTemplates: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;
            return await templatesCollection.getAllTemplates(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting visa operations \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    getVariables: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;
            return await VariableCollection.getVariables(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`\nError getting visa operations \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getTemplateById: async (id: string) => {
        try {
            return await templatesCollection.getTemplateById(id);
        } catch (error) {
            logger.error(`\nError getting vis transactions \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getTemplatesBy: async (data: any) => {
        try {
            return await templatesCollection.getTemplatesBy(data);
        } catch (error) {
            logger.error(`\nError getting visa trnsactions by queries \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    updateTemplateById: async (id: string, data: any) => {
        try {
            const vourchers = await templatesCollection.getTemplatesBy({});
            const foundIndex = vourchers.findIndex((e) => e.label === data.label && e._id.toString() !== id);
            if (foundIndex > -1) { return new Error('VourcherAlreadyExist') }
            return await templatesCollection.updateTemplateById(id, data);
        } catch (error) {
            logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    deleteTemplate: async (id: string) => {
        try {
            return await templatesCollection.deleteTemplate(id);
        } catch (error) {
            logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    insertTemplate: async (data: TemplateForm) => {
        try {
            return await templatesCollection.insertTemplate(data);
        } catch (error) {
            logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    
    insertVariable: async (data: TemplateForm) => {
        try {
            return await VariableCollection.insertVariable(data);
        } catch (error) {
            logger.error(`\nError updating visa transactions  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    

};
