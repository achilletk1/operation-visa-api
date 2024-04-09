import {
    BackUsersAuthorizationsRead, BackUsersAuthorizationsWrite, 
    GeneralsSettingAuthorizationsWrite, VouchersSettingAuthorizationsRead, VouchersSettingAuthorizationsWrite, TemplateSettingAuthorizationsRead, TemplateSettingAuthorizationsWrite,
    GeneralsSettingAuthorizationsRead, ReportingAuthorizationsRead, FileImportAuthorizationsRead, FileImportAuthorizationsWrite, FormalNoticeAuthorizationsRead, FormalNoticeAuthorizationsWrite,
    FormalNoticeSettingAuthorizationsRead, FormalNoticeSettingAuthorizationsWrite, CartTypeSettingAuthorizationsRead, CartTypeSettingAuthorizationsWrite, LongTravelTypeSettingAuthorizationsRead,
    ValidationLevelSettingAuthorizationsRead, ValidationLevelSettingAuthorizationsWrite, TransactionTypeSettingAuthorizationsRead, TransactionTypeSettingAuthorizationsWrite, ShareAuthorizationsRead,
    LongTravelTypeSettingAuthorizationsWrite, OnlinePaymentTypeSettingAuthorizationsRead, OnlinePaymentTypeSettingAuthorizationsWrite, CeilingSettingAuthorizationsRead, CeilingSettingAuthorizationsWrite,
} from "../enum";

const _authorizations = {
    ...BackUsersAuthorizationsRead,
    ...BackUsersAuthorizationsWrite,
    ...ReportingAuthorizationsRead,
    ...FileImportAuthorizationsRead,
    ...FileImportAuthorizationsWrite,
    ...FormalNoticeAuthorizationsRead,
    ...FormalNoticeAuthorizationsWrite,
    ...GeneralsSettingAuthorizationsRead,
    ...GeneralsSettingAuthorizationsWrite,
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
    ...ValidationLevelSettingAuthorizationsWrite,
    ...TransactionTypeSettingAuthorizationsRead,
    ...TransactionTypeSettingAuthorizationsWrite,
    ...ShareAuthorizationsRead
};

Object.entries(_authorizations).forEach(([k, v]: any) => {
    (/^[A-Z_-]+$/.test(k)) && (_authorizations[k] = k);
    (/^[A-Z_-]+$/.test(`${v}`)) && (delete _authorizations[k]);
});

export const authorizations = _authorizations;

export type AdminAuth = keyof typeof _authorizations;
