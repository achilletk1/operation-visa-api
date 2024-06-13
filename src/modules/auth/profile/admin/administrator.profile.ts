import {
    FrontUsersAuthorizationsRead, FrontUsersAuthorizationsWrite, ReportingAuthorizationsRead,ReportingBeacAuthorizationsRead,
} from "../../enum";
import { parameter, support } from ".";

const _administrator = {
    ...support, 
    ...parameter,
    ...FrontUsersAuthorizationsRead,
    ...FrontUsersAuthorizationsWrite,
    ...ReportingAuthorizationsRead,
    ...ReportingBeacAuthorizationsRead,
};

export const administrator = _administrator;

export type AdministratorAuth = keyof typeof _administrator;
