import {
    BackUsersAuthorizationsRead, FileImportAuthorizationsRead, GeneralsSettingAuthorizationsRead, VouchersSettingAuthorizationsRead, TemplateSettingAuthorizationsRead, FormalNoticeSettingAuthorizationsRead,
    CartTypeSettingAuthorizationsRead, LongTravelTypeSettingAuthorizationsRead, OnlinePaymentTypeSettingAuthorizationsRead, CeilingSettingAuthorizationsRead, ValidationLevelSettingAuthorizationsRead, TransactionTypeSettingAuthorizationsRead,
    SettingsMenuAuthorizationsRead, UsersMenuAuthorizationsRead,
    UsersInDemeureAndBlockMenuAuthorizationsRead,
    UsersInDemeureAndToBlockAuthorizationsRead,
    PersonnelManagerPermissionRead,
} from "../../enum";
import { controller } from ".";

const _auditor = {
    ...controller,
    ...UsersMenuAuthorizationsRead,
    ...BackUsersAuthorizationsRead,
    ...PersonnelManagerPermissionRead,
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
    ...UsersInDemeureAndBlockMenuAuthorizationsRead,
    ...UsersInDemeureAndToBlockAuthorizationsRead,
};

export const auditor = _auditor;

export type AuditorAuth = keyof typeof _auditor;
