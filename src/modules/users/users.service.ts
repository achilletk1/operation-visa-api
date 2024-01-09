import { UsersEvent, notificationEmmiter } from "modules/notifications";
import { formatUserFilters, generateUsersExportXlsx } from "./helper";
import { getLdapUser } from "common/helpers/ldap.helpers";
import { UsersRepository } from "./users.repository";
import { UsersController } from './users.controller';
import { CbsController, CbsBankUser } from "modules";
import { parseNumberFields } from "common/helpers";
import httpContext from 'express-http-context';
import { CrudService } from "common/base";
import { config } from "convict-config";
import { UserCategory } from "./enum";
import { isEmpty } from "lodash";
import { User } from "./model";
import { hash } from "bcrypt";
import moment from "moment";

export class UsersService extends CrudService<User>  {

    static userRepository: UsersRepository;

    constructor() {
        UsersService.userRepository = new UsersRepository();
        super(UsersService.userRepository);
    }

    async getUsers(filters: any, projection?: any) {
        try {
            const authUser = httpContext.get('user');
            if (authUser?.category < 500) { return new Error('Forbidden'); }

            const filter = formatUserFilters(filters);
            const opts: any = { filter };
            if (projection) { opts.projection = projection; }
            return await UsersController.usersService.findAll(opts);
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

    async createUser(createData: User, scope: 'back-office' | 'front-office') {
        try {
            const authUser = httpContext.get('user');
            if (authUser && authUser.category < 500) { return new Error('Forbidden'); }

            const filter: any = { clientCode: createData.clientCode, category: { $in: [100, 200] } };
            if (scope === 'back-office') { filter.userCode = createData.userCode; filter.category = { $nin: [100, 200] } }

            const existingUser = await UsersController.usersService.baseRepository.findOne({ filter });

            if (!isEmpty(existingUser)) { return new Error('UserAllreadyExist') }
            let user: User = {};

            if (scope === 'back-office') {
                const userLdap: any = await getLdapUser(createData.userCode);
                let userCbs: CbsBankUser | null = null;
                if (createData.clientCode) { userCbs = (await CbsController.cbsService.getUserDataByCode(createData.clientCode, scope))?.client as CbsBankUser; }
                user = {
                    ...user,
                    lname: userLdap.lname, fname: userLdap.fname, fullName: userLdap.fullName,
                    userCode: userLdap.userCode, email: userLdap.email || userCbs?.EMAIL, tel: userLdap.tel || userCbs?.TEL, category: UserCategory.ADMIN,
                    gender: userCbs ? userCbs?.SEXT : '', lang: userCbs && userCbs?.LANG && userCbs?.LANG !== '001' ? 'en' : 'fr',
                    visaOpecategory: createData.visaOpecategory, otp2fa: createData.otp2fa,
                    age: { label: userCbs?.LIBELLE_AGENCE, code: userCbs?.AGE }
                };
            }

            if (scope === 'front-office') {
                const { client, accounts } = await CbsController.cbsService.getUserDataByCode(createData.clientCode, scope);
                user = {
                    ...user,
                    lname: client?.NOM, fname: client?.PRE, fullName: client?.NOMREST, email: client?.EMAIL,
                    tel: client?.TEL, gender: client?.SEXT, lang: client?.LANG && client?.LANG !== '001' ? 'en' : 'fr',
                    category: createData.category, accounts, age: { label: client?.LIBELLE_AGENCE, code: client?.AGE },
                };
            }

            user.clientCode = createData.clientCode;
            user.enabled = createData.enabled;
            user.pwdReseted = true;
            if (authUser) user.editors = [{ _id: authUser?._id, date: moment().valueOf(), fullName: authUser.fullName }];

            const result = (await UsersController.usersService.create(user))?.data;

            notificationEmmiter.emit('users', new UsersEvent(user));

            return { _id: result };
        } catch (error) { throw error; }
    }

    async verifyLdapUser(filters: any) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }

            const { userCode } = filters;
            const user = await getLdapUser(userCode);

            return { user };
        } catch (error) { throw error; }
    }

    async verifyCbsUser(filters: any) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }

            const { clientCode, scope } = filters;
            const user = (await CbsController.cbsService.getUserDataByCode(clientCode, scope))?.client;

            return { user };
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
        if (AuthUser?.category !== 600) { throw new Error('Forbidden'); }

        try {
            const user = await UsersController.usersService.findOne({ filter: { _id } });
            if (!user) throw new Error('UserNotFound');
            const passwordClear = '000000'/*getRandomString(6)*/;
            const password = await hash(passwordClear, config.get('saltRounds'));
            await UsersController.usersService.update({ _id }, { password }, { pwdReseted: false });
            // TODO send notifications
            await Promise.all([
                // notificationService.sendEmailPwdReseted(user, passwordClear),
                // notificationService.sendPwdResetedSMS(user, passwordClear)
            ]);
            return {};
        } catch (error) { throw (error); }
    }

}

