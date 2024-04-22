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
    if (user?.category === SUPER_ADMIN) return 'superAdmin';
    if (user?.category >= ADMIN && user?.category < SUPER_ADMIN) return 'administrator';
    if (user?.category === PARAMETER) return 'parameter';
    if (user?.category === SUPPORT) return 'support';
    if (user?.category === MANAGEMENT_COMMITTEE) return 'managementCommittee';
    if (user?.category === HEAD_OF_REGION) return 'headOfRegion';
    if (user?.category === SCRC_DEPARTMENT_HEAD) return 'scrcDepartmentHead';
    if (user?.category === HEAD_OF_PERSONNEL_AGENCY) return 'headOfPersonnelAgency';
    if (user?.category === AGENCY_HEAD) return 'agencyHead';
    if (user?.category === SCRC_STUDY_MANAGEMENT) return 'scrcStudyManager';
    if (user?.category === PERSONNEL_MANAGER) return 'personnelManager';
    if (user?.category === ACCOUNT_MANAGER) return 'accountManager';
    if (user?.category === AUDITOR) return 'auditor';
    if (user?.category === CONTROLLER) return 'controller';
    if (user?.category === ENTERPRISE) return 'enterprise';
    if (user?.category === DEFAULT) return 'default';

    return null;
}

export const getAuthorizationsByProfile = (profile: Profile): any => {
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
