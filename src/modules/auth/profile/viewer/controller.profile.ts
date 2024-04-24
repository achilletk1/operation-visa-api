import {
    ImportationsAuthorizationsRead, ReportingAuthorizationsRead, NotificationListAuthorizationsRead, ShareAuthorizationsRead, FormalNoticeAuthorizationsRead,
    TravelsDeclarationAuthorizationsRead, ShortTravelAuthorizationsRead, LongTravelAuthorizationsRead, OnlinePaymentsAuthorizationsRead, CeilingIncreaseAuthorizationsRead,
    TravelsMenuAuthorizationsRead,
    OnlinePaymentsMenuAuthorizationsRead,
    OnlinePaymentsDeclarationAuthorizationsRead,
    SuppliersAuthorizationsRead,
    SuppliersVoucherSettingMenuAuthorizationsRead,
    SuppliersMenuAuthorizationsRead,
    OperationsMenuAuthorizationsRead,
    OperationsAuthorizationsRead,
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
    ...SuppliersAuthorizationsRead,
    ...OperationsAuthorizationsRead,
    ...SuppliersVoucherSettingMenuAuthorizationsRead,
    ...SuppliersMenuAuthorizationsRead,
    ...OperationsMenuAuthorizationsRead,
    ...SuppliersVoucherSettingMenuAuthorizationsRead,
    ...SuppliersMenuAuthorizationsRead,
    ...OperationsMenuAuthorizationsRead,
    ...OperationsAuthorizationsRead,
    ...SuppliersAuthorizationsRead,
    ...ShareAuthorizationsRead,
};

export const controller = _controller;

export type ControllerAuth = keyof typeof _controller;
