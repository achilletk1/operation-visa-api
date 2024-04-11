import {
    FrontUsersAuthorizationsRead, FrontUsersAuthorizationsWrite, OnlinePaymentsAuthorizationsWrite, CeilingIncreaseAuthorizationsWrite,
    ShortTravelAuthorizationsWrite, LongTravelAuthorizationsWrite, InstantNotificationAuthorizationsRead, InstantNotificationAuthorizationsWrite, NotificationListAuthorizationsWrite,
    ImportationsAuthorizationsWrite, FormalNoticeAuthorizationsWrite, UsersMenuAuthorizationsRead, TravelsDeclarationAuthorizationsRead, OnlinePaymentsDeclarationAuthorizationsRead,
} from "../../enum";
import { controller } from "../viewer";

const _accountManager = {
    ...controller,
    ...UsersMenuAuthorizationsRead,
    ...FrontUsersAuthorizationsRead,
    ...FrontUsersAuthorizationsWrite,
    ...TravelsDeclarationAuthorizationsRead,
    ...ShortTravelAuthorizationsWrite,
    ...LongTravelAuthorizationsWrite,
    ...OnlinePaymentsDeclarationAuthorizationsRead,
    ...OnlinePaymentsAuthorizationsWrite,
    ...CeilingIncreaseAuthorizationsWrite,
    ...ImportationsAuthorizationsWrite,
    ...InstantNotificationAuthorizationsRead,
    ...InstantNotificationAuthorizationsWrite,
    ...NotificationListAuthorizationsWrite,
    ...FormalNoticeAuthorizationsWrite,
};

export const accountManager = _accountManager;

export type AccountManagerAuth = keyof typeof _accountManager;
