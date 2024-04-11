import {
    ReportingAuthorizationsRead,
} from "../../enum";
import { parameter, support } from ".";

const _administrator = {
    ...support, 
    ...parameter,
    ...ReportingAuthorizationsRead,
};

export const administrator = _administrator;

export type AdministratorAuth = keyof typeof _administrator;
