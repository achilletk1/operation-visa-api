import {
    BackUsersAuthorizationsRead,  VouchersSettingAuthorizationsRead, VouchersSettingAuthorizationsWrite, TemplateSettingAuthorizationsRead, TemplateSettingAuthorizationsWrite,
    ValidationLevelSettingAuthorizationsRead, TransactionTypeSettingAuthorizationsRead, TransactionTypeSettingAuthorizationsWrite, FileImportAuthorizationsRead, FileImportAuthorizationsWrite,
    FormalNoticeSettingAuthorizationsRead, FormalNoticeSettingAuthorizationsWrite, CartTypeSettingAuthorizationsRead, CartTypeSettingAuthorizationsWrite, LongTravelTypeSettingAuthorizationsRead,
    LongTravelTypeSettingAuthorizationsWrite, OnlinePaymentTypeSettingAuthorizationsRead, OnlinePaymentTypeSettingAuthorizationsWrite, CeilingSettingAuthorizationsRead, CeilingSettingAuthorizationsWrite,
    SettingsMenuAuthorizationsRead,
} from "../../enum";
import { accountManager } from ".";

const _scrcStudyManager = {
    ...accountManager,
    ...BackUsersAuthorizationsRead,
    ...SettingsMenuAuthorizationsRead,
    ...FileImportAuthorizationsRead,
    ...FileImportAuthorizationsWrite,
    ...VouchersSettingAuthorizationsRead,
    ...VouchersSettingAuthorizationsWrite,
    ...TemplateSettingAuthorizationsRead,
    ...TemplateSettingAuthorizationsWrite,
    ...FormalNoticeSettingAuthorizationsRead,
    ...FormalNoticeSettingAuthorizationsWrite,
    ...CartTypeSettingAuthorizationsRead,
    ...CartTypeSettingAuthorizationsWrite,
    ...LongTravelTypeSettingAuthorizationsRead,
    ...LongTravelTypeSettingAuthorizationsWrite,
    ...OnlinePaymentTypeSettingAuthorizationsRead,
    ...OnlinePaymentTypeSettingAuthorizationsWrite,
    ...CeilingSettingAuthorizationsRead,
    ...CeilingSettingAuthorizationsWrite,
    ...ValidationLevelSettingAuthorizationsRead,
    ...TransactionTypeSettingAuthorizationsRead,
    ...TransactionTypeSettingAuthorizationsWrite,
};

export const scrcStudyManager = _scrcStudyManager;

export type ScrcStudyManagerAuth = keyof typeof _scrcStudyManager;
