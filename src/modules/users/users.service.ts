import { UsersRepository } from "./users.repository";
import { UsersController } from './users.controller';
import { parseNumberFields } from "common/helpers";
import httpContext from 'express-http-context';
import { formatUserFilters } from "./helper";
import { CrudService } from "common/base";
import { isEmpty } from "lodash";
import { User } from "./model";

export class UsersService extends CrudService<User> {

    static userRepository: UsersRepository;

    constructor() {
        UsersService.userRepository = new UsersRepository();
        super(UsersService.userRepository);
    }

    async getUsers(filters: any) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }
            const filter = formatUserFilters(filters);
            return await UsersController.usersService.findAll({ filter, projection: { password: 1, otp: 1 } });
        } catch (error) { throw error; }
    }

    async getUserBy(filters: any) {
        try {
            parseNumberFields(filters);
            const isUserCreation = filters?.isUserCreation;
            const isAdminCreation = filters?.isAdminCreation;
            delete filters.isUserCreation;
            delete filters.isAdminCreation;
            let user = await UsersController.usersService.findOne({ filter: filters, projection: { password: 1, otp: 1 }});
            // if (!user) { return ''; }
            // logger.debug(`user: ${JSON.stringify(user)}`)
            if (!isEmpty(isUserCreation) || !isEmpty(isAdminCreation)) {
                if (!isEmpty(isUserCreation) && Number(user?.category) > 499) {
                    filters.category = { '$nin': [600, 601, 602, 603, 604, 500, 200, 201] };
                }
                if (!isEmpty(isAdminCreation) && Number(user?.category) < 499) {
                    filters.category = { '$in': [600, 601, 602, 603, 604, 500] };
                }
                user = await UsersController.usersService.findOne({ filter: filters, projection: { password: 1, otp: 1 }});
            }
            return user;
        } catch (error) { throw error; }
    }

    async getUserByOperations() {
        try {
            return await UsersController.usersService.findAll({ filter: { category: 100 } });
        } catch (error) { throw error; }
    }

}
