import {
    BackUsersAuthorizationsRead, TravelsAuthorizationsRead, ShortTravelAuthorizationsRead, LongTravelAuthorizationsRead, OnlinePaymentsAuthorizationsRead,
    CeilingIncreaseAuthorizationsRead, ImportationsAuthorizationsRead, ReportingAuthorizationsRead, FileImportAuthorizationsRead, FormalNoticeAuthorizationsRead,
    NotificationListAuthorizationsRead, GeneralsSettingAuthorizationsRead, VouchersSettingAuthorizationsRead, TemplateSettingAuthorizationsRead, FormalNoticeSettingAuthorizationsRead, CartTypeSettingAuthorizationsRead,
    LongTravelTypeSettingAuthorizationsRead, OnlinePaymentTypeSettingAuthorizationsRead, CeilingSettingAuthorizationsRead, ValidationLevelSettingAuthorizationsRead, TransactionTypeSettingAuthorizationsRead, ShareAuthorizationsRead,
} from "../enum";

let _auditor: any = {
    ...BackUsersAuthorizationsRead,
    ...TravelsAuthorizationsRead,
    ...ShortTravelAuthorizationsRead,
    ...LongTravelAuthorizationsRead,
    ...OnlinePaymentsAuthorizationsRead,
    ...CeilingIncreaseAuthorizationsRead,
    ...ImportationsAuthorizationsRead,
    ...ReportingAuthorizationsRead,
    ...FileImportAuthorizationsRead,
    ...FormalNoticeAuthorizationsRead,
    ...NotificationListAuthorizationsRead,
    ...GeneralsSettingAuthorizationsRead,
    ...VouchersSettingAuthorizationsRead,
    ...TemplateSettingAuthorizationsRead,
    ...FormalNoticeSettingAuthorizationsRead,
    ...CartTypeSettingAuthorizationsRead,
    ...LongTravelTypeSettingAuthorizationsRead,
    ...OnlinePaymentTypeSettingAuthorizationsRead,
    ...CeilingSettingAuthorizationsRead,
    ...ValidationLevelSettingAuthorizationsRead,
    ...TransactionTypeSettingAuthorizationsRead,
    ...ShareAuthorizationsRead,
};

Object.entries(_auditor).forEach(([k, v]: any) => {
    (/^[A-Z_-]+$/.test(k)) && (_auditor[k] = k);
    (/^[A-Z_-]+$/.test(`${v}`)) && (delete _auditor[k]);
});

export const auditor = _auditor;

export type AuditorAuth = keyof typeof _auditor;
