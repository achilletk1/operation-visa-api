import {
    BackUsersAuthorizationsRead, CartTypeSettingAuthorizationsRead, CeilingSettingAuthorizationsRead, FormalNoticeSettingAuthorizationsRead,
    LongTravelTypeSettingAuthorizationsRead, OnlinePaymentTypeSettingAuthorizationsRead, SettingsMenuAuthorizationsRead, TemplateSettingAuthorizationsRead,
    TransactionTypeSettingAuthorizationsRead, ValidationLevelSettingAuthorizationsRead, VouchersSettingAuthorizationsRead, 
} from "../../enum";
import { accountManager } from "../accountManager";

const _agencyHead = {
    ...accountManager,
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
};

export const agencyHead = _agencyHead;

export type AgencyHeadAuth = keyof typeof _agencyHead;
