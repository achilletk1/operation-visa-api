import {
    accountManager, agencyHead, auditor, superAdmin, controller, scrcDepartmentHead, hadOfPersonnelAgency,
    scrcStudyManager, administrator, support, managementCommittee, headOfRegion, personnelManager, parameter,
} from "../profile";
import { UserCategory } from "modules/users/enum";
import { User } from "modules/users";
import { isEmpty } from "lodash";

type Profile = 'administrator' | 'superAdmin' | 'support' | 'managementCommittee' | 'headOfRegion'
    | 'agencyHead' | 'headOfPersonnelAgency' | 'scrcDepartmentHead' | 'personnelManager'
    | 'scrcStudyManager' | 'accountManager' | 'auditor' | 'controller' | 'parameter' | 'default' | 'enterprise';

const {
    CONTROLLER, AUDITOR, ACCOUNT_MANAGER, PERSONNEL_MANAGER, SCRC_STUDY_MANAGEMENT, AGENCY_HEAD, HEAD_OF_PERSONNEL_AGENCY,
    SCRC_DEPARTMENT_HEAD, HEAD_OF_REGION, MANAGEMENT_COMMITTEE, SUPPORT, PARAMETER, ADMIN, SUPER_ADMIN, DEFAULT, ENTERPRISE
} = UserCategory;

export const getUserProfile = (user: User): Profile | null => {
    if (isEmpty(user)) return null;
    user.category = user?.category ?? CONTROLLER;

    if (user?.category >= ADMIN && user?.category < SUPER_ADMIN) return 'administrator';

    switch (user?.category) {
        case SUPER_ADMIN:
            return 'superAdmin';
        case PARAMETER:
            return 'parameter';
        case SUPPORT:
            return 'support';
        case MANAGEMENT_COMMITTEE:
            return 'managementCommittee';
        case HEAD_OF_REGION:
            return 'headOfRegion';
        case SCRC_DEPARTMENT_HEAD:
            return 'scrcDepartmentHead';
        case HEAD_OF_PERSONNEL_AGENCY:
            return 'headOfPersonnelAgency';
        case AGENCY_HEAD:
            return 'agencyHead';
        case SCRC_STUDY_MANAGEMENT:
            return 'scrcStudyManager';
        case PERSONNEL_MANAGER:
            return 'personnelManager';
        case ACCOUNT_MANAGER:
            return 'accountManager';
        case AUDITOR:
            return 'auditor';
        case CONTROLLER:
            return 'controller';
        case ENTERPRISE:
            return 'enterprise';
        case DEFAULT:
            return 'default';
        default:
            return null;
    }
}

export const getAuthorizationsByProfile = (profile: Profile): string[] => {
    const _authorizations = {
        superAdmin: getArrayKey(superAdmin),
        administrator: getArrayKey(administrator),
        parameter: getArrayKey(parameter),
        support: getArrayKey(support),
        managementCommittee: getArrayKey(managementCommittee),
        headOfRegion: getArrayKey(headOfRegion),
        scrcDepartmentHead: getArrayKey(scrcDepartmentHead),
        headOfPersonnelAgency: getArrayKey(hadOfPersonnelAgency),
        agencyHead: getArrayKey(agencyHead),
        scrcStudyManager: getArrayKey(scrcStudyManager),
        personnelManager: getArrayKey(personnelManager),
        accountManager: getArrayKey(accountManager),
        auditor: getArrayKey(auditor),
        controller: getArrayKey(controller),
        default: [],
        enterprise: [],
    };

    return _authorizations[profile]
}

const getArrayKey = (dataArray: any) => Object.entries(dataArray).map(([key]) => { return key; });
