import {
    accountManager, agencyHead, auditor, superAdmin, controller, scrcDepartmentHead, hadOfPersonnalAgency,
    scrcStudyManager, admin, support, managementCommittee, headOfRegion, personnalManager
} from "../profile";
import { UserCategory } from "modules/users/enum";
import { User } from "modules/users";
import { isEmpty } from "lodash";

type Profile = 'admin' | 'superadmin' | 'support' | 'codir' | 'headOfRegion'
    | 'agencyHead' | 'headOfPersonnalAgency' | 'srcdepartmentHead' | 'personnalManager'
    | 'scrcstudymanagment' | 'accountManager' | 'auditor' | 'controller';

export const getUserProfile = (user: User): Profile | null => {
    if (isEmpty(user)) return null;    
    if (user?.category === UserCategory.SUPER_ADMIN) return 'superadmin';
    if ((user?.category || 0) >= 621 && (user?.category || 0) <= 650) return 'admin';
    if (user?.category === UserCategory.SUPPORT) return 'support';
    if (user?.category === UserCategory.MANAGMENT_COMMITEE) return 'codir';
    if (user?.category === UserCategory.HEAD_OF_REGION) return 'headOfRegion';
    if (user?.category === UserCategory.HEAD_OF_PERSONNAL_AGENCY) return 'headOfPersonnalAgency';
    if (user?.category === UserCategory.SRC_DEPARTMENT_HEAD) return 'srcdepartmentHead';
    if (user?.category === UserCategory.AGENCY_HEAD) return 'agencyHead';
    if (user?.category === UserCategory.PERSONNAL_MANAGER) return 'personnalManager';
    if (user?.category === UserCategory.SCRC_STUDY_MANAGMENT) return 'scrcstudymanagment';
    if (user?.category === UserCategory.ACCOUNT_MANAGER) return 'accountManager';
    if (user?.category === UserCategory.AUDITOR) return 'auditor';
    if (user?.category === UserCategory.CONTROLLER) return 'controller';

    return null

}

export const getAuthorizationsByProfile = (profile: Profile): any => {
    const _authorizations = {
        admin: Object.entries(admin).map(([key]) => { return key; }),
        superadmin: Object.entries(superAdmin).map(([key]) => { return key; }),
        support: Object.entries(support).map(([key]) => { return key; }),
        codir: Object.entries(managementCommittee).map(([key]) => { return key; }),
        headOfRegion: Object.entries(headOfRegion).map(([key]) => { return key; }),
        agencyHead: Object.entries(agencyHead).map(([key]) => { return key; }),
        headOfPersonnalAgency: Object.entries(hadOfPersonnalAgency).map(([key]) => { return key; }),
        srcdepartmentHead: Object.entries(scrcDepartmentHead).map(([key]) => { return key; }),
        personnalManager: Object.entries(personnalManager).map(([key]) => { return key; }),
        scrcstudymanagment: Object.entries(scrcStudyManager).map(([key]) => { return key; }),
        accountManager: Object.entries(accountManager).map(([key]) => { return key; }),
        auditor: Object.entries(auditor).map(([key]) => { return key; }),
        controller: Object.entries(controller).map(([key]) => { return key; }),
    };

    return _authorizations[profile]
}















