import {
    FrontUsersAuthorizationsRead, FrontUsersAuthorizationsWrite, ReportingAuthorizationsRead,
} from "../../enum";
import { parameter, support } from ".";

const _administrator = {
    ...support, 
    ...parameter,
    ...FrontUsersAuthorizationsRead,
    ...FrontUsersAuthorizationsWrite,
    ...ReportingAuthorizationsRead,
};

export const administrator = _administrator;

export type AdministratorAuth = keyof typeof _administrator;
