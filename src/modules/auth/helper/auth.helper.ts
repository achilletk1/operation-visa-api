import { UserCategory } from "modules/users/enum";
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
    const authorizations = {
        admin: [
            'DECLARATIONS', 'NEW_DECLARATION', 'EXPORT', 'FILTER_BY_CLIENTCODE', 'FILTER_BY_STATUS', 'FILTER_BY_NAME',
            'TRAVEL_RECAP', 'OPERATIONS_LIST', 'JUSTIFICATIONS', 'NOTIFICATIONS_LIST', 'VALIDATIONS_HISTORY',
            'PROOF_TRAVEL_EDIT', 'UPLOAD_JUSTIFICATIONS', 'EDITION_MODE', 'SAVE_EDITION', 'VALIDATIONS', 'MONTH_RECAP',
            'MONTH_ECCEED_LIST', 'FILTER_BY_DATES', 'FILTER_BY_ACCOUNT', 'FILTER_BTN', 'EDITIONS_HISTORY', 'OTHER_BTN',
            'EDITOR_HISTORY', 'SIGN_BUTTON', 'SIDE-BAR', 'SHOW_EXCEED_DAYS'
        ],
        client: [
            'DECLARATIONS', 'NEW_DECLARATION', 'FILTER_BY_STATUS', 'TRAVEL_RECAP', 'OPERATIONS_LIST', 'JUSTIFICATIONS',
            'PROOF_TRAVEL_EDIT', 'UPLOAD_JUSTIFICATIONS', 'SAVE_EDITION', 'MONTH_RECAP', 'MONTH_ECCEED_LIST',
            'NEW_CEILLING_INCREASE', 'GET_USER_ID', 'SHOW_EXCEED_DAYS', 'SIGN_BUTTON', 'SIDE-BAR'
        ],
        notCustomer: [
            'FILTER_BY_STATUS', 'TRAVEL_RECAP', 'OPERATIONS_LIST', 'JUSTIFICATIONS', 'PROOF_TRAVEL_EDIT', 'UPLOAD_JUSTIFICATIONS',
            'SAVE_EDITION', 'MONTH_RECAP', 'MONTH_ECCEED_LIST', 'NEW_CEILLING_INCREASE'
        ],
    };

    return authorizations[profile]
}