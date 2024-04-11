import {
    PersonnelManagerPermissionRead, PersonnelManagerPermissionWrite,
} from "../../enum";
import { accountManager } from ".";

const _personnelManager = {
    ...accountManager,
    ...PersonnelManagerPermissionRead,
    ...PersonnelManagerPermissionWrite,
};

export const personnelManager = _personnelManager;

export type PersonnelManagerAuth = keyof typeof _personnelManager;
