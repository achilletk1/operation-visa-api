import {
    BackUsersAuthorizationsRead, CartTypeSettingAuthorizationsRead, CeilingSettingAuthorizationsRead, FormalNoticeSettingAuthorizationsRead,
    LongTravelTypeSettingAuthorizationsRead, OnlinePaymentTypeSettingAuthorizationsRead, PersonnelManagerPermissionRead, SettingsMenuAuthorizationsRead, TemplateSettingAuthorizationsRead,
    TransactionTypeSettingAuthorizationsRead, ValidationLevelSettingAuthorizationsRead, VouchersSettingAuthorizationsRead, 
} from "../../enum";
import { accountManager } from "../accountManager";

const _agencyHead = {
    ...accountManager,
    ...BackUsersAuthorizationsRead,
    ...PersonnelManagerPermissionRead,
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
};

export const agencyHead = _agencyHead;

export type AgencyHeadAuth = keyof typeof _agencyHead;
