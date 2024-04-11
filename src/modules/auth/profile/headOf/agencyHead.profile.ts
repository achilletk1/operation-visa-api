import {
    BackUsersAuthorizationsRead, 
} from "../../enum";
import { accountManager } from "../accountManager";

const _agencyHead = {
    ...accountManager,
    ...BackUsersAuthorizationsRead,
};

export const agencyHead = _agencyHead;

export type AgencyHeadAuth = keyof typeof _agencyHead;
