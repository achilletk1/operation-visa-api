import { SettingsRepository } from "./settings.repository";
import { SettingsController } from './settings.controller';
import httpContext from 'express-http-context';
import { CrudService } from "common/base";
import { User } from "modules/users";
import { Setting } from "./model";
import { isEmpty } from "lodash";

export class SettingsService extends CrudService<Setting> {

    static settingsRepository: SettingsRepository;

    constructor() {
        SettingsService.settingsRepository = new SettingsRepository();
        super(SettingsService.settingsRepository);
    }

    async updateSettingByIdOrKey(_id: string, setting: Partial<Setting>, byKey: boolean = false) {
        try {
            const opts = byKey ? { key: _id } : { _id };
            const currSetting = await SettingsController.settingsService.findOne({ filter: opts });

            const authUser = httpContext.get('user') as User;

            currSetting.updated_at = isEmpty(currSetting?.updated_at) ? [] : currSetting?.updated_at;
            currSetting.updated_at.unshift({ user: { _id: authUser._id, fullName: authUser.fullName }, date: new Date().valueOf() });

            if (currSetting.updated_at.length >= 10) { currSetting.updated_at.pop(); }

            return await SettingsController.settingsService.update(opts, { data: setting.data, updated_at: currSetting.updated_at });
        } catch (error) { throw error; }
    }


    async getSettings(filter: any) {
        try {
            const authUser = httpContext.get('user');
            if (authUser?.category < 500) { return new Error('Forbidden'); }
            filter.created_at = { $exists: true };
            return await SettingsController.settingsService.findAll({ filter });
        } catch (error) { throw error; }
    }

}