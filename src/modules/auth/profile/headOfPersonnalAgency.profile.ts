import {
    FrontUsersAuthorizationsRead, FrontUsersAuthorizationsWrite, BackUsersAuthorizationsRead, TravelsAuthorizationsRead,
    TravelsAuthorizationsWrite, ShortTravelAuthorizationsRead, ShortTravelAuthorizationsWrite, LongTravelAuthorizationsRead, LongTravelAuthorizationsWrite,
    InstantNotificationAuthorizationsRead, InstantNotificationAuthorizationsWrite, NotificationListAuthorizationsRead, NotificationListAuthorizationsWrite, 
    ImportationsAuthorizationsWrite, ReportingAuthorizationsRead, FormalNoticeAuthorizationsRead, FormalNoticeAuthorizationsWrite, ShareAuthorizationsRead,
    OnlinePaymentsAuthorizationsRead, OnlinePaymentsAuthorizationsWrite, CeilingIncreaseAuthorizationsRead, CeilingIncreaseAuthorizationsWrite, ImportationsAuthorizationsRead, HeadOfPersonnalAgencyRead, HeadOfPersonnalAgencyWrite,
} from "../enum";

let _headOfPersonnalAgency = {
    ...FrontUsersAuthorizationsRead,
    ...FrontUsersAuthorizationsWrite,
    ...BackUsersAuthorizationsRead,
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
    ...ShareAuthorizationsRead,
    ...HeadOfPersonnalAgencyRead,
    ...HeadOfPersonnalAgencyWrite,
};

Object.entries(_headOfPersonnalAgency).forEach(([k, v]: any) => {
    (/^[A-Z_-]+$/.test(k)) && (_headOfPersonnalAgency[k] = k);
    (/^[A-Z_-]+$/.test(`${v}`)) && (delete _headOfPersonnalAgency[k]);
});

export const hadOfPersonnalAgency = _headOfPersonnalAgency;

export type HeadOfPersonnalAgencyAuth = keyof typeof _headOfPersonnalAgency;
