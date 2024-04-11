import {
    FrontUsersAuthorizationsRead, FrontUsersAuthorizationsWrite, BackUsersAuthorizationsRead, TravelsAuthorizationsRead,
    TravelsAuthorizationsWrite, ShortTravelAuthorizationsRead, ShortTravelAuthorizationsWrite, LongTravelAuthorizationsRead, LongTravelAuthorizationsWrite,
    InstantNotificationAuthorizationsRead, InstantNotificationAuthorizationsWrite, NotificationListAuthorizationsRead, NotificationListAuthorizationsWrite, 
    ImportationsAuthorizationsWrite, ReportingAuthorizationsRead, FormalNoticeAuthorizationsRead, FormalNoticeAuthorizationsWrite, ShareAuthorizationsRead,
    OnlinePaymentsAuthorizationsRead, OnlinePaymentsAuthorizationsWrite, CeilingIncreaseAuthorizationsRead, CeilingIncreaseAuthorizationsWrite, ImportationsAuthorizationsRead, ManagementCommitteeAuthorizationsWrite, ManagementCommitteeAuthorizationsRead,
} from "../enum";

let _managementCommittee = {
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
    ...ManagementCommitteeAuthorizationsRead,
    ...ManagementCommitteeAuthorizationsWrite,
};

Object.entries(_managementCommittee).forEach(([k, v]: any) => {
    (/^[A-Z_-]+$/.test(k)) && (_managementCommittee[k] = k);
    (/^[A-Z_-]+$/.test(`${v}`)) && (delete _managementCommittee[k]);
});

export const managementCommittee = _managementCommittee;

export type ManagementCommitteeAuth = keyof typeof _managementCommittee;
