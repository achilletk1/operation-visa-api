import {
    FrontUsersAuthorizationsRead, FrontUsersAuthorizationsWrite, BackUsersAuthorizationsRead, BackUsersAuthorizationsWrite, TravelsAuthorizationsRead,
    TravelsAuthorizationsWrite, ShortTravelAuthorizationsRead, ShortTravelAuthorizationsWrite, LongTravelAuthorizationsRead, LongTravelAuthorizationsWrite,
    OnlinePaymentsAuthorizationsRead, OnlinePaymentsAuthorizationsWrite, CeilingIncreaseAuthorizationsRead, CeilingIncreaseAuthorizationsWrite, ImportationsAuthorizationsRead,
    GeneralsSettingAuthorizationsWrite, VouchersSettingAuthorizationsRead, VouchersSettingAuthorizationsWrite, TemplateSettingAuthorizationsRead, TemplateSettingAuthorizationsWrite,
    InstantNotificationAuthorizationsRead, InstantNotificationAuthorizationsWrite, NotificationListAuthorizationsRead, NotificationListAuthorizationsWrite, GeneralsSettingAuthorizationsRead,
    ImportationsAuthorizationsWrite, ReportingAuthorizationsRead, FileImportAuthorizationsRead, FileImportAuthorizationsWrite, FormalNoticeAuthorizationsRead, FormalNoticeAuthorizationsWrite,
    FormalNoticeSettingAuthorizationsRead, FormalNoticeSettingAuthorizationsWrite, CartTypeSettingAuthorizationsRead, CartTypeSettingAuthorizationsWrite, LongTravelTypeSettingAuthorizationsRead,
    ValidationLevelSettingAuthorizationsRead, ValidationLevelSettingAuthorizationsWrite, TransactionTypeSettingAuthorizationsRead, TransactionTypeSettingAuthorizationsWrite, ShareAuthorizationsRead,
    LongTravelTypeSettingAuthorizationsWrite, OnlinePaymentTypeSettingAuthorizationsRead, OnlinePaymentTypeSettingAuthorizationsWrite, CeilingSettingAuthorizationsRead, CeilingSettingAuthorizationsWrite,
} from "../enum";

let _scrcDepartmentHead = {
    ...FrontUsersAuthorizationsRead,
    ...FrontUsersAuthorizationsWrite,
    ...BackUsersAuthorizationsRead,
    ...BackUsersAuthorizationsWrite,
    ...TravelsAuthorizationsRead,
    ...TravelsAuthorizationsWrite,
    ...ShortTravelAuthorizationsRead,
    ...ShortTravelAuthorizationsWrite,
    ...LongTravelAuthorizationsRead,
    ...LongTravelAuthorizationsWrite,
    ...OnlinePaymentsAuthorizationsRead,
    ...OnlinePaymentsAuthorizationsWrite,
    ...CeilingIncreaseAuthorizationsRead,
    ...CeilingIncreaseAuthorizationsWrite,
    ...ImportationsAuthorizationsRead,
    ...ImportationsAuthorizationsWrite,
    ...ReportingAuthorizationsRead,
    ...InstantNotificationAuthorizationsRead,
    ...InstantNotificationAuthorizationsWrite,
    ...NotificationListAuthorizationsRead,
    ...NotificationListAuthorizationsWrite,
    ...FormalNoticeAuthorizationsRead,
    ...FormalNoticeAuthorizationsWrite,
    ...GeneralsSettingAuthorizationsRead,
    ...GeneralsSettingAuthorizationsWrite,
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
    ...ValidationLevelSettingAuthorizationsWrite,
    ...TransactionTypeSettingAuthorizationsRead,
    ...TransactionTypeSettingAuthorizationsWrite,
    ...ShareAuthorizationsRead,
};

Object.entries(_scrcDepartmentHead).forEach(([k, v]: any) => {
    (/^[A-Z_-]+$/.test(k)) && (_scrcDepartmentHead[k] = k);
    (/^[A-Z_-]+$/.test(`${v}`)) && (delete _scrcDepartmentHead[k]);
});

export const scrcDepartmentHead = _scrcDepartmentHead;

export type ScrcDepartmentHeadAuth = keyof typeof _scrcDepartmentHead;
