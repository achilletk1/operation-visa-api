import {
    ValidationLevelSettingAuthorizationsRead, ValidationLevelSettingAuthorizationsWrite, ShareAuthorizationsRead,
    BackUsersAuthorizationsRead, BackUsersAuthorizationsWrite, GeneralsSettingAuthorizationsWrite, GeneralsSettingAuthorizationsRead,
    SettingsMenuAuthorizationsRead, UsersMenuAuthorizationsRead, PersonnelManagerPermissionRead,
} from "../../enum";

const _support = {
    ...UsersMenuAuthorizationsRead,
    ...BackUsersAuthorizationsRead,
    ...PersonnelManagerPermissionRead,
    ...BackUsersAuthorizationsWrite,
    ...SettingsMenuAuthorizationsRead,
    ...GeneralsSettingAuthorizationsRead,
    ...GeneralsSettingAuthorizationsWrite,
    ...ValidationLevelSettingAuthorizationsRead,
    ...ValidationLevelSettingAuthorizationsWrite,
    ...ShareAuthorizationsRead
};

export const support = _support;

export type SupportAuth = keyof typeof _support;
