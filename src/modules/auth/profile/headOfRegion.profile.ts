import {
    FrontUsersAuthorizationsRead, FrontUsersAuthorizationsWrite, BackUsersAuthorizationsRead, TravelsAuthorizationsRead,
    TravelsAuthorizationsWrite, ShortTravelAuthorizationsRead, ShortTravelAuthorizationsWrite, LongTravelAuthorizationsRead, LongTravelAuthorizationsWrite,
    InstantNotificationAuthorizationsRead, InstantNotificationAuthorizationsWrite, NotificationListAuthorizationsRead, NotificationListAuthorizationsWrite, 
    ImportationsAuthorizationsWrite, ReportingAuthorizationsRead, FormalNoticeAuthorizationsRead, FormalNoticeAuthorizationsWrite, ShareAuthorizationsRead,
    OnlinePaymentsAuthorizationsRead, OnlinePaymentsAuthorizationsWrite, CeilingIncreaseAuthorizationsRead, CeilingIncreaseAuthorizationsWrite, ImportationsAuthorizationsRead, HeadOfRegionRead, HeadOfRegionWrite,
} from "../enum";

let _headOfRegionRead = {
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
    ...HeadOfRegionRead,
    ...HeadOfRegionWrite,
};

Object.entries(_headOfRegionRead).forEach(([k, v]: any) => {
    (/^[A-Z_-]+$/.test(k)) && (_headOfRegionRead[k] = k);
    (/^[A-Z_-]+$/.test(`${v}`)) && (delete _headOfRegionRead[k]);
});

export const headOfRegion = _headOfRegionRead;

export type HeadOfRegionAuth = keyof typeof _headOfRegionRead;
