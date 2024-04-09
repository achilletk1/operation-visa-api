import {
    FrontUsersAuthorizationsRead, FrontUsersAuthorizationsWrite, BackUsersAuthorizationsRead, TravelsAuthorizationsRead,
    TravelsAuthorizationsWrite, ShortTravelAuthorizationsRead, ShortTravelAuthorizationsWrite, LongTravelAuthorizationsRead, LongTravelAuthorizationsWrite,
    InstantNotificationAuthorizationsRead, InstantNotificationAuthorizationsWrite, NotificationListAuthorizationsRead, NotificationListAuthorizationsWrite, 
    ImportationsAuthorizationsWrite, ReportingAuthorizationsRead, FormalNoticeAuthorizationsRead, FormalNoticeAuthorizationsWrite, ShareAuthorizationsRead,
    OnlinePaymentsAuthorizationsRead, OnlinePaymentsAuthorizationsWrite, CeilingIncreaseAuthorizationsRead, CeilingIncreaseAuthorizationsWrite, ImportationsAuthorizationsRead, PersonnalManagerRead, PersonnalManagerWrite,
} from "../enum";

let _personnalManager = {
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
    ...PersonnalManagerRead,
    ...PersonnalManagerWrite,
};

Object.entries(_personnalManager).forEach(([k, v]: any) => {
    (/^[A-Z_-]+$/.test(k)) && (_personnalManager[k] = k);
    (/^[A-Z_-]+$/.test(`${v}`)) && (delete _personnalManager[k]);
});

export const personnalManager = _personnalManager;

export type PersonnalManagerAuth = keyof typeof _personnalManager;
