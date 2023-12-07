import { UsersEvent, notificationEmmiter } from "modules/notifications";
import { formatUserFilters, generateUsersExportXlsx } from "./helper";
import { getLdapUser } from "common/helpers/ldap.helpers";
import { UsersRepository } from "./users.repository";
import { UsersController } from './users.controller';
import { parseNumberFields } from "common/helpers";
import httpContext from 'express-http-context';
import { CrudService } from "common/base";
import { config } from "convict-config";
import { isEmpty } from "lodash";
import { User } from "./model";
import { hash } from "bcrypt";
import moment from "moment";

export class UsersService extends CrudService<User> {

    static userRepository: UsersRepository;

    constructor() {
        UsersService.userRepository = new UsersRepository();
        super(UsersService.userRepository);
    }

    async getUsers(filters: any) {
        try {
            const authUser = httpContext.get('user');
            if (authUser?.category < 500) { return new Error('Forbidden'); }

            const filter = formatUserFilters(filters);
            return await UsersController.usersService.findAll({ filter });
        } catch (error) { throw error; }
    }

    async getUserBy(filters: any) {
        try {
            parseNumberFields(filters);
            const isUserCreation = filters?.isUserCreation;
            const isAdminCreation = filters?.isAdminCreation;
            delete filters.isUserCreation;
            delete filters.isAdminCreation;
            let user = await UsersController.usersService.findOne({ filter: filters, projection: { password: 0, otp: 0 } });
            // if (!user) { return ''; }
            // logger.debug(`user: ${JSON.stringify(user)}`)
            if (!isEmpty(isUserCreation) || !isEmpty(isAdminCreation)) {
                if (!isEmpty(isUserCreation) && Number(user?.category) > 499) {
                    filters.category = { '$nin': [600, 601, 602, 603, 604, 500, 200, 201] };
                }
                if (!isEmpty(isAdminCreation) && Number(user?.category) < 499) {
                    filters.category = { '$in': [600, 601, 602, 603, 604, 500] };
                }
                user = await UsersController.usersService.findOne({ filter: filters, projection: { password: 0, otp: 0 } });
            }
            return user;
        } catch (error) { throw error; }
    }

    async getUserByOperations() {
        try {
            return await UsersController.usersService.findAll({ filter: { category: 100 } });
        } catch (error) { throw error; }
    }

    async createUser(userDatas: User) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }

            const { userCode, category } = userDatas;
            const existingUser = await this.baseRepository.findOne({ filter: { userCode: userCode } });

            if (!isEmpty(existingUser)) { return new Error('UserAllreadyExist') }

            let user: any = await getLdapUser(userCode);

            if (user) {
                user.editors = [];
                // Add user datas
                user.enabled = true;
                user.fullName = user.fullName || `${user.fname} ${user.lname}`;
                user.visaOpecategory = category;
                user.category = 600;
                user.created_at = moment().valueOf();
                user.option = 3;
                user.gender = '';
                user.pwdReseted = true;
                user.editors.push({ _id: `${authUser._id}`, date: moment().valueOf() })

                const result = await UsersController.usersService.create(user);

                notificationEmmiter.emit('users', new UsersEvent({ ...user }));

                return { _id: result };
            }
        } catch (error) { throw error; }
    }

    async verifyLdapUser(filters: any) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }

            const { userCode } = filters;
            const user = await getLdapUser(userCode);

            return { user }
        } catch (error) { throw error; }
    }

    async updateUser(userDatas: User) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); };
            userDatas.editors?.push({
                _id: `${authUser?._id}` || '',
                date: moment()?.valueOf(),
            });

            // userDatas.enabled = !userDatas?.enabled;
            userDatas.fullName = `${userDatas?.fname} ${userDatas?.lname}`;
            userDatas.updated_at = moment().valueOf();

            const result = await UsersController.usersService.update({ _id: userDatas?._id }, userDatas);
            return result;

        } catch (error) { throw error; }
    }


    async generateUsersExportLinks(filters: any) {
        try {
            if (filters.action !== 'generate_link') { return new Error('NoActionProvided') };

            delete filters.action;
            delete filters.ttl;

            const users = await UsersController.usersService.findAll({ filter: filters, projection: { password: 0, otp: 0 } });
            if (isEmpty(users?.data)) { return new Error('usersNotFound'); }

            const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

            const options = { ttl, ...filters };

            const codePath = await UsersController.usersService.generateExportLinks(options, 'users')

            return { link: `${codePath?.xlsxPath}` }

        } catch (error) { throw error; }
    }

    async generateUsersExporData(code: any) {

        const { data }: any = await UsersController.usersService.getDataToExport(code);

        const excelArrayBuffer = await generateUsersExportXlsx(data);
        const buffer = Buffer.from(excelArrayBuffer, 'base64');

        return { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer };
    }

    async ResetPwrd(_id: string) {
        const AuthUser = httpContext.get('user');
        if (AuthUser?.category !== 600) { throw Error('Forbidden'); }

        try {
            const user = await UsersController.usersService.findOne({ filter: { _id } });
            if (!user) throw Error('UserNotFound');
            const passwordClear = '000000'/*getRandomString(6)*/;
            const password = await hash(passwordClear, config.get('saltRounds'));
            await UsersController.usersService.update({ _id }, { password });
            await UsersController.usersService.updateDeleteFeild({ _id }, { pwdReseted: false });
            // TODO send notifications
            await Promise.all([
                // notificationService.sendEmailPwdReseted(user, passwordClear),
                // notificationService.sendPwdResetedSMS(user, passwordClear)
            ]);
            return {};
        } catch (error) { throw(error); }
    }

}

