
import { commonService } from './common.service';
import { logger } from '../winston';
import moment = require('moment');
import { Setting } from '../models/setting';
import  httpContext from 'express-http-context';
import { settingCollection } from '../collections/settings.collection';
import { isEmpty } from 'lodash';


export const settingService = {

    
    getSettingByKey: async (key: string) => {
        try {
            const authUser = httpContext.get('user');
            // if (authUser.category < 500) { return new Error('Forbidden'); }
            return await settingCollection.getSettingsByKey(key);
        } catch (error) {
            logger.error(`Error getting Setting data \n${error.message}\n${error.stack}`);
            return error;
        }
    },

    getSettingsBy: async (data: any) => {
        try {
            return await settingCollection.getSettingsBy(data);
        } catch (error) {
            logger.error(`Error getting Setting data by queries \n${error.message}\n${error.stack}`);
            return error;
        }
    },

    updateSettingById: async (id: string, setting: Setting) => {
        try {
            const authUser = httpContext.get('user');
            if(isEmpty(setting.users)){setting.users = [];}
            if(isEmpty(setting.dateUpdated)){ setting.dateUpdated = [];}
            if(setting.dateUpdated.length >= 10){       
                var index = 0, value = setting.dateUpdated.reduce(function(pre, cur, i) {
                    return cur < pre ? (index = i) && cur : pre;
                });
                setting.dateUpdated[index] = moment().valueOf();
                setting.users[index] = authUser;
           }               
            setting.users.push(authUser);
            setting.dateUpdated.push(moment().valueOf()) ;
            return await settingCollection.updateSettingsById(id, setting);
        } catch (error) {
            logger.error(`Error updating Setting data  \n${error.message}\n${error.stack}`);
            return error;
        }
    },

    /*insertSetting: async (setting: Setting): Promise<any> => {
        try {
            // Set Setting creation date
            setting.dates = { ...setting.dates, created: moment().valueOf() };
            const result = await settingCollection.insertSetting(setting);
            const data = { _id: result };
            return data;
        } catch (error) {
            logger.error(`Setting creation failed \n${error?.name} \n${error?.stack}`);
            return error;
        }
    },
    
    getSettings: async (filters: any) => {
        try {
            commonService.parseNumberFields(filters);
            const { offset, limit } = filters;
            delete filters.offset;
            delete filters.limit;
            
            return await settingCollection.getSettings(filters || {}, offset || 1, limit || 40);
        } catch (error) {
            logger.error(`Error getting Setting data \n${error.message}\n${error.stack}`);
            return error;
        }
    },
  
    */

};

