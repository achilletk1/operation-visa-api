import { BankAccountManagerController } from "modules/bank-account-manager";
import { UserCategory, UsersController } from "modules/users";
import { QueryFilter } from "common/types";

export async function getAccountManagerOrAgencyHeadCcEmail(userGesCode?: string, ageCode?: string, filter?: QueryFilter): Promise<string> {
    let ccEmail: string = ''; let user;
    try {
        (filter) && (user = await UsersController.usersService.findOne({ filter }));
        userGesCode ??= user?.userGesCode;
        ageCode ??= user?.age?.code;
        ccEmail = (userGesCode?.substring(0, 1) === '9')
            ? (await BankAccountManagerController.bankAccountManagerService.findOne({ filter: { CODE_GES: userGesCode } }))?.EMAIL || ''
            : (await UsersController.usersService.findOne({ filter: { category: UserCategory.AGENCY_HEAD, bankProfileCode: 'R204', 'age.code': ageCode } }))?.email ?? '';
    } catch (error) { }
    return ccEmail;
}
