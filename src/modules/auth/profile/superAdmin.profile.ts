import {
    FrontUsersAuthorizationsRead, FrontUsersAuthorizationsWrite, BackUsersAuthorizationsRead, BackUsersAuthorizationsWrite, TravelsAuthorizationsRead,
    TravelsAuthorizationsWrite, ShortTravelAuthorizationsRead, ShortTravelAuthorizationsWrite, LongTravelAuthorizationsRead, LongTravelAuthorizationsWrite,
    OnlinePaymentsAuthorizationsRead, OnlinePaymentsAuthorizationsWrite, CeilingIncreaseAuthorizationsRead, CeilingIncreaseAuthorizationsWrite, ImportationsAuthorizationsRead,
    GeneralsSettingAuthorizationsWrite, VouchersSettingAuthorizationsRead, VouchersSettingAuthorizationsWrite, TemplateSettingAuthorizationsRead, TemplateSettingAuthorizationsWrite,
    InstantNotificationAuthorizationsRead, InstantNotificationAuthorizationsWrite, NotificationListAuthorizationsRead, NotificationListAuthorizationsWrite, GeneralsSettingAuthorizationsRead,
    ImportationsAuthorizationsWrite, ReportingAuthorizationsRead, FileImportAuthorizationsRead, FileImportAuthorizationsWrite, FormalNoticeAuthorizationsRead, FormalNoticeAuthorizationsWrite,
    FormalNoticeSettingAuthorizationsRead, FormalNoticeSettingAuthorizationsWrite, CartTypeSettingAuthorizationsRead, CartTypeSettingAuthorizationsWrite, LongTravelTypeSettingAuthorizationsRead,
    ValidationLevelSettingAuthorizationsRead, ValidationLevelSettingAuthorizationsWrite, TransactionTypeSettingAuthorizationsRead, TransactionTypeSettingAuthorizationsWrite, ShareAuthorizationsRead,
    LongTravelTypeSettingAuthorizationsWrite, OnlinePaymentTypeSettingAuthorizationsRead, OnlinePaymentTypeSettingAuthorizationsWrite, CeilingSettingAuthorizationsRead, CeilingSettingAuthorizationsWrite, DCHAuthorizationsRead, DCHAuthorizationsWrite, HeadOfPersonnalAgencyRead, HeadOfPersonnalAgencyWrite, HeadOfRegionAuthorizationsWrite, HeadOfRegionRead, HeadOfRegionWrite, HeadgionOfRegionAuthorizationsRead, ManagementCommitteeAuthorizationsRead, ManagementCommitteeAuthorizationsWrite, PersonnalManagerRead, PersonnalManagerWrite,
} from "../enum";

const _superAdmin = {
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
    ...DCHAuthorizationsRead,
    ...DCHAuthorizationsWrite,
    ...HeadgionOfRegionAuthorizationsRead,
    ...HeadOfRegionAuthorizationsWrite,
    ...ManagementCommitteeAuthorizationsRead,
    ...ManagementCommitteeAuthorizationsWrite,
    ...HeadOfRegionRead,
    ...HeadOfRegionWrite,
    ...HeadOfPersonnalAgencyRead,
    ...HeadOfPersonnalAgencyWrite,
    ...PersonnalManagerRead,
    ...PersonnalManagerWrite,
};

Object.entries(_superAdmin).forEach(([k, v]: any) => {
    (/^[A-Z_-]+$/.test(k)) && (_superAdmin[k] = k);
    (/^[A-Z_-]+$/.test(`${v}`)) && (delete _superAdmin[k]);
});

export const superAdmin = _superAdmin;

export const authorizations = _superAdmin;
// export const authorizations = Object.entries(superAdmin).map(([key]) => { return key; });

export type Authorizations = keyof typeof _superAdmin;
