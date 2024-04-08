import {
    TravelsAuthorizationsRead, ShortTravelAuthorizationsRead, LongTravelAuthorizationsRead, OnlinePaymentsAuthorizationsRead, CeilingIncreaseAuthorizationsRead,
    ImportationsAuthorizationsRead, ReportingAuthorizationsRead, InstantNotificationAuthorizationsRead, NotificationListAuthorizationsRead, ShareAuthorizationsRead, FormalNoticeAuthorizationsRead,
} from "../enum";

let _controller: any = {
    ...TravelsAuthorizationsRead,
    ...ShortTravelAuthorizationsRead,
    ...LongTravelAuthorizationsRead,
    ...OnlinePaymentsAuthorizationsRead,
    ...CeilingIncreaseAuthorizationsRead,
    ...ImportationsAuthorizationsRead,
    ...ReportingAuthorizationsRead,
    ...FormalNoticeAuthorizationsRead,
    ...NotificationListAuthorizationsRead,
    ...ShareAuthorizationsRead,
};

Object.entries(_controller).forEach(([k, v]: any) => {
    (/^[A-Z_-]+$/.test(k)) && (_controller[k] = k);
    (/^[A-Z_-]+$/.test(`${v}`)) && (delete _controller[k]);
});

export const controller = _controller;

export type ControllerAuth = keyof typeof _controller;
