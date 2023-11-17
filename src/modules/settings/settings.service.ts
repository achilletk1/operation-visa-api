import { SettingsRepository } from "./settings.repository";
import { SettingsController } from './settings.controller';
import httpContext from 'express-http-context';
import { CrudService } from "common/base";
import { Setting } from "./model";
import { isEmpty } from "lodash";
import moment from "moment";

export class SettingsService extends CrudService<Setting> {

    static settingsRepository: SettingsRepository;

    constructor() {
        SettingsService.settingsRepository = new SettingsRepository();
        super(SettingsService.settingsRepository);
    }

    async updateSettingById(_id: string, setting: Setting) {
        try {
            const authUser = httpContext.get('user');
            setting.users = isEmpty(setting?.users) ? [] : setting?.users;
            setting.dateUpdated = isEmpty(setting?.dateUpdated) ? [] : setting?.dateUpdated;

            if (setting.dateUpdated.length >= 10) {
                let index = 0;
                let value = setting.dateUpdated.reduce(function (pre, cur, i) {
                    return cur < pre ? ((index = i) && cur) : pre;
                });
                setting.dateUpdated[index] = moment().valueOf();
                setting.users[index] = authUser;
            }
            setting.users.push(authUser);
            setting.dateUpdated.push(moment().valueOf());
            return await SettingsController.settingsService.update({ _id }, setting);
        } catch (error) { throw error; }
    }


    async getSettings(filters: any) {
        try {
            const authUser = httpContext.get('user');
            if (authUser?.category < 500) { return new Error('Forbidden'); }
            return await SettingsController.settingsService.findAll({ filter: filters });
        } catch (error) { throw error; }
    }

}