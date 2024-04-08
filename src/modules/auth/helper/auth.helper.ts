import { UserCategory } from "modules/users/enum";
import { superAdmin } from "../profile";
import { User } from "modules/users";
import { isEmpty } from "lodash";

type Profile = 'client' | 'admin' | 'notCustomer';

export const getUserProfile = (user: User): Profile | null => {
    if (isEmpty(user)) return 'notCustomer';
    if (user?.category === UserCategory.DEFAULT) return 'client';
    if ((user?.category || 0) >= 500 && (user?.category || 0) <= 700) return 'admin';
    return null

}

export const getAuthorizationsByProfile = (profile: Profile): any => {
    const admin = Object.entries(superAdmin).map(([key]) => { return key; });

    const _authorizations = {
        admin,
        client: [
            'DECLARATIONS', 'NEW_DECLARATION', 'FILTER_BY_STATUS', 'TRAVEL_RECAP', 'OPERATIONS_LIST', 'JUSTIFICATIONS',
            'PROOF_TRAVEL_EDIT', 'UPLOAD_JUSTIFICATIONS', 'SAVE_EDITION', 'MONTH_RECAP', 'MONTH_ECCEED_LIST',
            'NEW_CEILLING_INCREASE', 'GET_USER_ID', 'SHOW_EXCEED_DAYS', 'SIGN_BUTTON', 'SIDE_BAR'
        ],
        notCustomer: [
            'FILTER_BY_STATUS', 'TRAVEL_RECAP', 'OPERATIONS_LIST', 'JUSTIFICATIONS', 'PROOF_TRAVEL_EDIT', 'UPLOAD_JUSTIFICATIONS',
            'SAVE_EDITION', 'MONTH_RECAP', 'MONTH_ECCEED_LIST', 'NEW_CEILLING_INCREASE'
        ],
    };

    return _authorizations[profile]
}















