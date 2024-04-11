import {
    BackUsersAuthorizationsRead, FileImportAuthorizationsRead, GeneralsSettingAuthorizationsRead, VouchersSettingAuthorizationsRead, TemplateSettingAuthorizationsRead, FormalNoticeSettingAuthorizationsRead,
    CartTypeSettingAuthorizationsRead, LongTravelTypeSettingAuthorizationsRead, OnlinePaymentTypeSettingAuthorizationsRead, CeilingSettingAuthorizationsRead, ValidationLevelSettingAuthorizationsRead, TransactionTypeSettingAuthorizationsRead,
    SettingsMenuAuthorizationsRead, UsersMenuAuthorizationsRead,
} from "../../enum";
import { controller } from ".";

const _auditor = {
    ...controller,
    ...UsersMenuAuthorizationsRead,
    ...BackUsersAuthorizationsRead,
    ...SettingsMenuAuthorizationsRead,
    ...GeneralsSettingAuthorizationsRead,
    ...FileImportAuthorizationsRead,
    ...VouchersSettingAuthorizationsRead,
    ...TemplateSettingAuthorizationsRead,
    ...FormalNoticeSettingAuthorizationsRead,
    ...CartTypeSettingAuthorizationsRead,
    ...LongTravelTypeSettingAuthorizationsRead,
    ...OnlinePaymentTypeSettingAuthorizationsRead,
    ...CeilingSettingAuthorizationsRead,
    ...ValidationLevelSettingAuthorizationsRead,
    ...TransactionTypeSettingAuthorizationsRead,
};

export const auditor = _auditor;

export type AuditorAuth = keyof typeof _auditor;
