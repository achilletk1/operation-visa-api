import {
    FrontUsersAuthorizationsRead, BackUsersAuthorizationsRead, ManagementCommitteeAuthorizationsWrite, ManagementCommitteeAuthorizationsRead,
    UsersMenuAuthorizationsRead,
} from "../../enum";
import { controller } from "../viewer";

const _managementCommittee = {
    ...controller,
    ...UsersMenuAuthorizationsRead,
    ...FrontUsersAuthorizationsRead,
    ...BackUsersAuthorizationsRead,
    ...ManagementCommitteeAuthorizationsRead,
    ...ManagementCommitteeAuthorizationsWrite,
};

export const managementCommittee = _managementCommittee;

export type ManagementCommitteeAuth = keyof typeof _managementCommittee;
