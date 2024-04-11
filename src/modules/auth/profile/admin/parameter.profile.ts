import {
    VouchersSettingAuthorizationsRead, VouchersSettingAuthorizationsWrite, TemplateSettingAuthorizationsRead, TemplateSettingAuthorizationsWrite,
    OnlinePaymentTypeSettingAuthorizationsWrite, CeilingSettingAuthorizationsRead, CeilingSettingAuthorizationsWrite, FileImportAuthorizationsRead, FileImportAuthorizationsWrite,
    FormalNoticeSettingAuthorizationsRead, FormalNoticeSettingAuthorizationsWrite, CartTypeSettingAuthorizationsRead, CartTypeSettingAuthorizationsWrite, LongTravelTypeSettingAuthorizationsRead,
    TransactionTypeSettingAuthorizationsRead, TransactionTypeSettingAuthorizationsWrite, ShareAuthorizationsRead, LongTravelTypeSettingAuthorizationsWrite, OnlinePaymentTypeSettingAuthorizationsRead,
    SettingsMenuAuthorizationsRead,
} from "../../enum";

const _parameter = {
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
    ...TransactionTypeSettingAuthorizationsRead,
    ...TransactionTypeSettingAuthorizationsWrite,
    ...ShareAuthorizationsRead
};

export const parameter = _parameter;

export type ParameterAuth = keyof typeof _parameter;
