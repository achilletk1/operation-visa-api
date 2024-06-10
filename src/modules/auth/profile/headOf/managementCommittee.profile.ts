import {
    FrontUsersAuthorizationsRead, BackUsersAuthorizationsRead, ManagementCommitteeAuthorizationsWrite, ManagementCommitteeAuthorizationsRead,
    UsersMenuAuthorizationsRead, CartTypeSettingAuthorizationsRead, CeilingSettingAuthorizationsRead, FormalNoticeSettingAuthorizationsRead,
    LongTravelTypeSettingAuthorizationsRead, OnlinePaymentTypeSettingAuthorizationsRead, SettingsMenuAuthorizationsRead, TemplateSettingAuthorizationsRead,
    TransactionTypeSettingAuthorizationsRead, ValidationLevelSettingAuthorizationsRead, VouchersSettingAuthorizationsRead,
    UsersInDemeureAndBlockMenuAuthorizationsRead,
    UsersInDemeureAndToBlockAuthorizationsRead, 
} from "../../enum";
import { controller } from "../viewer";

const _managementCommittee = {
    ...controller,
    ...UsersMenuAuthorizationsRead,
    ...FrontUsersAuthorizationsRead,
    ...BackUsersAuthorizationsRead,
    ...SettingsMenuAuthorizationsRead,
    ...VouchersSettingAuthorizationsRead,
    ...TemplateSettingAuthorizationsRead,
    ...FormalNoticeSettingAuthorizationsRead,
    ...CartTypeSettingAuthorizationsRead,
    ...LongTravelTypeSettingAuthorizationsRead,
    ...OnlinePaymentTypeSettingAuthorizationsRead,
    ...CeilingSettingAuthorizationsRead,
    ...ValidationLevelSettingAuthorizationsRead,
    ...TransactionTypeSettingAuthorizationsRead,
    ...ManagementCommitteeAuthorizationsRead,
    ...ManagementCommitteeAuthorizationsWrite,
    ...UsersInDemeureAndBlockMenuAuthorizationsRead,
    ...UsersInDemeureAndToBlockAuthorizationsRead,
};

export const managementCommittee = _managementCommittee;

export type ManagementCommitteeAuth = keyof typeof _managementCommittee;
