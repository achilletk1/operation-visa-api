import { SettingsRepository } from "./settings.repository";
import { SettingsController } from './settings.controller';
import { Setting, settingsKeys } from "./model";
import httpContext from 'express-http-context';
import { CrudService } from "common/base";
import { cache } from "common/services";
import { User } from "modules/users";
import { isEmpty } from "lodash";

export class SettingsService extends CrudService<Setting> {

    static settingsRepository: SettingsRepository;

    constructor() {
        SettingsService.settingsRepository = new SettingsRepository();
        super(SettingsService.settingsRepository);
        this.setAuthTTL();
    }

    async updateSettingByIdOrKey(_id: string, setting: Partial<Setting>, byKey: boolean = false) {
        try {
            const opts = byKey ? { key: _id } : { _id };
            const currSetting = await SettingsController.settingsService.findOne({ filter: opts });

            const authUser = httpContext.get('user') as User;

            currSetting.updated_at = isEmpty(currSetting?.updated_at) ? [] : currSetting?.updated_at;
            currSetting.updated_at.unshift({ user: { _id: authUser?._id, fullName: authUser.fullName }, date: new Date().valueOf() });

            if (currSetting.updated_at.length >= 10) { currSetting.updated_at.pop(); }
            byKey && (_id === settingsKeys.TTL_VALUE) && (httpContext.set(settingsKeys.TTL_VALUE, currSetting));

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

    private async setAuthTTL() {
        const settingTTL = (await this.baseRepository.findOne({ filter: { key: settingsKeys.TTL_VALUE } })) as unknown as Setting;
        cache.set(settingsKeys.TTL_VALUE, settingTTL?.data);
    }

}