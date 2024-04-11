import {
    ImportationsAuthorizationsRead, ReportingAuthorizationsRead, NotificationListAuthorizationsRead, ShareAuthorizationsRead, FormalNoticeAuthorizationsRead,
    TravelsDeclarationAuthorizationsRead, ShortTravelAuthorizationsRead, LongTravelAuthorizationsRead, OnlinePaymentsAuthorizationsRead, CeilingIncreaseAuthorizationsRead,
    TravelsMenuAuthorizationsRead,
    OnlinePaymentsMenuAuthorizationsRead,
    OnlinePaymentsDeclarationAuthorizationsRead,
} from "../../enum";

const _controller = {
    ...TravelsMenuAuthorizationsRead,
    ...ShortTravelAuthorizationsRead,
    ...LongTravelAuthorizationsRead,
    ...OnlinePaymentsMenuAuthorizationsRead,
    ...OnlinePaymentsAuthorizationsRead,
    ...CeilingIncreaseAuthorizationsRead,
    ...ImportationsAuthorizationsRead,
    ...ReportingAuthorizationsRead,
    ...FormalNoticeAuthorizationsRead,
    ...NotificationListAuthorizationsRead,
    ...ShareAuthorizationsRead,
};

export const controller = _controller;

export type ControllerAuth = keyof typeof _controller;
