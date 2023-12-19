import { UsersEvent, notificationEmmiter } from "modules/notifications";
import { formatUserFilters, generateUsersExportXlsx } from "./helper";
import { getLdapUser } from "common/helpers/ldap.helpers";
import { UsersRepository } from "./users.repository";
import { UsersController } from './users.controller';
import { parseNumberFields } from "common/helpers";
import httpContext from 'express-http-context';
import { CbsController } from "modules/cbs";
import { BankClient, User } from "./model";
import { CrudService } from "common/base";
import { config } from "convict-config";
import { UserCategory } from "./enum";
import { isEmpty } from "lodash";
import { hash } from "bcrypt";
import moment from "moment";
import { CbsBankUser } from "modules/cbs/model";

export class UsersService extends CrudService<User>  {

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

    async createUser(createData: User, scope: 'back-office' | 'front-office') {
        try {
            const authUser = httpContext.get('user');
            if (authUser && authUser.category < 500) { return new Error('Forbidden'); }

            const filter: any = { clientCode: createData.clientCode };
            if (scope === 'back-office') { filter.userCode = createData.userCode; }

            const existingUser = await UsersController.usersService.baseRepository.findOne({ filter });

            if (!isEmpty(existingUser)) { return new Error('UserAllreadyExist') }
            let user: User = {};

            if (scope === 'back-office') {
                const userLdap: any = await getLdapUser(createData.userCode);
                let userCbs: CbsBankUser[] = [];
                if (createData.clientCode) { userCbs = (await CbsController.cbsService.getUserDataByCode(createData.clientCode, scope))?.client as CbsBankUser[]; }
                user = {
                    ...user,
                    lname: userLdap.lname, fname: userLdap.fname, fullName: userLdap.fullName,
                    userCode: userLdap.userCode, email: userLdap.email, tel: userLdap.tel, category: UserCategory.ADMIN,
                    gender: !isEmpty(userCbs) ? userCbs[0].SEXT : '', lang: !isEmpty(userCbs) && userCbs[0].LANG !== '001' ? 'en' : 'fr',
                    visaOpecategory: createData.visaOpecategory, otp2fa: createData.otp2fa,
                    age: { label: userCbs[0].LIBELLE_AGENCE, code: userCbs[0].AGE }
                };
            }

            if (scope === 'front-office') {
                const { client, accounts } = await CbsController.cbsService.getUserDataByCode(createData.clientCode, scope);
                user = {
                    ...user,
                    lname: client[0].NOM, fname: client[0].PRE, fullName: client[0].NOMREST, email: client[0].EMAIL,
                    tel: client[0].TEL, gender: client[0].SEXT, lang: client[0].LANG !== '001' ? 'en' : 'fr',
                    accounts, category: createData.category
                };
            }

            user.enabled = createData.enabled;
            user.pwdReseted = true;
            if (authUser) user.editors = [{ _id: authUser?._id, date: moment().valueOf(), fullName: authUser.fullName }];

            const result = await UsersController.usersService.create(user);

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
            await UsersController.usersService.update({ _id }, { password });
            await UsersController.usersService.updateDeleteFeild({ _id }, { pwdReseted: false });
            // TODO send notifications
            await Promise.all([
                // notificationService.sendEmailPwdReseted(user, passwordClear),
                // notificationService.sendPwdResetedSMS(user, passwordClear)
            ]);
            return {};
        } catch (error) { throw (error); }
    }

}

