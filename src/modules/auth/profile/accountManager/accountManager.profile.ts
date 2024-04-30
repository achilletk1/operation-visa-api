import {
    FrontUsersAuthorizationsRead, FrontUsersAuthorizationsWrite, OnlinePaymentsAuthorizationsWrite, CeilingIncreaseAuthorizationsWrite,
    ShortTravelAuthorizationsWrite, LongTravelAuthorizationsWrite, InstantNotificationAuthorizationsRead, InstantNotificationAuthorizationsWrite, NotificationListAuthorizationsWrite,
    ImportationsAuthorizationsWrite, FormalNoticeAuthorizationsWrite, UsersMenuAuthorizationsRead, TravelsDeclarationAuthorizationsRead, OnlinePaymentsDeclarationAuthorizationsRead,
    TransferStakeholdersAuthorizationsWrite, OperationsAuthorizationsWrite, TravelsAuthorizationsWrite, SensitiveNotificationListAuthorizationsWrite,
} from "../../enum";
import { controller } from "../viewer";

const _accountManager = {
    ...controller,
    ...UsersMenuAuthorizationsRead,
    ...FrontUsersAuthorizationsRead,
    ...FrontUsersAuthorizationsWrite,
    ...TravelsDeclarationAuthorizationsRead,
    ...TravelsAuthorizationsWrite,
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
    ...TransferStakeholdersAuthorizationsWrite,
    ...OperationsAuthorizationsWrite,
    ...SensitiveNotificationListAuthorizationsWrite,
};

export const accountManager = _accountManager;

export type AccountManagerAuth = keyof typeof _accountManager;
