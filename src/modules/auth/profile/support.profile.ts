import {
    ValidationLevelSettingAuthorizationsRead, ValidationLevelSettingAuthorizationsWrite, ShareAuthorizationsRead,
    BackUsersAuthorizationsRead, BackUsersAuthorizationsWrite, GeneralsSettingAuthorizationsWrite, GeneralsSettingAuthorizationsRead,
} from "../enum";

const _support = {
    ...BackUsersAuthorizationsRead,
    ...BackUsersAuthorizationsWrite,
    ...GeneralsSettingAuthorizationsRead,
    ...GeneralsSettingAuthorizationsWrite,
    ...ValidationLevelSettingAuthorizationsRead,
    ...ValidationLevelSettingAuthorizationsWrite,
    ...ShareAuthorizationsRead
};

Object.entries(_support).forEach(([k, v]: any) => {
    (/^[A-Z_-]+$/.test(k)) && (_support[k] = k);
    (/^[A-Z_-]+$/.test(`${v}`)) && (delete _support[k]);
});

export const support = _support;

export type SupportAuth = keyof typeof _support;
