import {
    ImportationsAuthorizationsRead, ReportingAuthorizationsRead, NotificationListAuthorizationsRead, ShareAuthorizationsRead, FormalNoticeAuthorizationsRead,
    ShortTravelAuthorizationsRead, LongTravelAuthorizationsRead, OnlinePaymentsAuthorizationsRead, CeilingIncreaseAuthorizationsRead, ReportingBeacAuthorizationsRead,
    TravelsMenuAuthorizationsRead, OnlinePaymentsMenuAuthorizationsRead, TransferStakeholdersMenuAuthorizationsRead, TransferStakeholdersAuthorizationsRead,
    OperationsMenuAuthorizationsRead, OperationsAuthorizationsRead, SensitiveNotificationListAuthorizationsRead, SensitiveNotificationListMenuAuthorizationsRead,
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
    ...ReportingBeacAuthorizationsRead,
    ...FormalNoticeAuthorizationsRead,
    ...NotificationListAuthorizationsRead,
    ...TransferStakeholdersMenuAuthorizationsRead,
    ...TransferStakeholdersAuthorizationsRead,
    ...SensitiveNotificationListMenuAuthorizationsRead,
    ...SensitiveNotificationListAuthorizationsRead,
    ...OperationsMenuAuthorizationsRead,
    ...OperationsAuthorizationsRead,
    ...ShareAuthorizationsRead,
};

export const controller = _controller;

export type ControllerAuth = keyof typeof _controller;
