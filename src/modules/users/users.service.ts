import { listOfUntimelyClientCodesProofTravelAggregation, listOfUntimelyClientCodesTransactionsAggregation } from "modules/reporting";
import { convertParams, extractPaginationData, parseNumberFields } from "common/helpers";
import { CrudService, QueryOptions, QueryProjection } from "common/base";
import { UsersEvent, notificationEmmiter } from "modules/notifications";
import { formatUserFilters, generateUsersExportXlsx } from "./helper";
import { TravelMonthController } from "modules/travel-month";
import { getLdapUser } from "common/helpers/ldap.helpers";
import { CbsController, CbsBankUser } from "modules/cbs";
import { UsersRepository } from "./users.repository";
import { UsersController } from './users.controller';
import { TravelController } from "modules/travel";
import httpContext from 'express-http-context';
import { QueryFilter } from "common/types";
import { config } from "convict-config";
import { isEmpty } from "lodash";
import { User } from "./model";
import { hash } from "bcrypt";
import moment from "moment";
import { OnlinePaymentController } from "modules/online-payment";

type untimelyClientCodes = { formalNoticeClientCodes: string[]; blockedClientCodes: string[]; }

export class UsersService extends CrudService<User> {

    static userRepository: UsersRepository;

    constructor() {
        UsersService.userRepository = new UsersRepository();
        super(UsersService.userRepository);
    }

    async getUsers(filters: any, projection?: QueryProjection) {
        try {
            const authUser = httpContext.get('user');
            if (authUser?.category < 500) { throw new Error('Forbidden'); }

            const filter = formatUserFilters(filters);
            const opts: QueryOptions = { filter };
            (projection) && (opts.projection = projection);
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
            if (authUser && authUser.category < 500) { throw new Error('Forbidden'); }

            const filter: any = { clientCode: createData.clientCode, category: { $in: [100, 200] } };
            if (scope === 'back-office') { filter.userCode = createData.userCode; filter.category = { $nin: [100, 200] } }

            const existingUser = await UsersController.usersService.baseRepository.findOne({ filter });

            if (!isEmpty(existingUser)) { throw new Error('UserAlreadyExist') }
            let user: User = {};

            if (scope === 'back-office') {
                const userLdap: any = await getLdapUser(createData.userCode);
                let userCbs: CbsBankUser | null = null;
                (createData.clientCode) && (userCbs = (await CbsController.cbsService.getUserDataByCode(createData.clientCode, scope))?.client as CbsBankUser);
                user = {
                    ...user, userGesCode: userCbs?.GES_CODE,
                    lname: userLdap.lname, fname: userLdap.fname, fullName: userLdap.fullName,
                    userCode: userLdap?.userCode, email: createData?.email || userLdap?.email || userCbs?.EMAIL, tel: createData?.tel || userLdap?.tel || userCbs?.TEL,
                    category: createData.category, gender: userCbs ? userCbs?.SEXT : '', lang: userCbs && userCbs?.LANG && userCbs?.LANG !== '001' ? 'en' : 'fr',
                    visaOpeCategory: createData.visaOpeCategory, otp2fa: createData.otp2fa, gesCode: userCbs?.CODE_GESTIONNAIRE,
                    age: { label: userCbs?.LIBELLE_AGENCE, code: userCbs?.AGE }, bankUserCode: userCbs?.CODE_UTILISATEUR,
                    bankProfileCode: userCbs?.CODE_PROFIL, bankProfileName: userCbs?.LIBELLE_PROFIL, cbsCategory: userCbs?.TCLI
                };
            }

            if (scope === 'front-office') {
                const { client, accounts } = await CbsController.cbsService.getUserDataByCode(createData.clientCode, scope);
                user = {
                    ...user, userGesCode: client?.GES, cbsCategory: client?.TCLI,
                    lname: client?.NOM, fname: client?.PRE, fullName: client?.NOMREST, email: createData?.email || client?.EMAIL,
                    tel: createData?.tel || client?.TEL, gender: client?.SEXT, lang: client?.LANG && client?.LANG !== '001' ? 'en' : 'fr',
                    category: createData.category, accounts, age: { label: client?.LIBELLE_AGENCE, code: client?.AGE },
                    bankProfileCode: client?.CODE_PROFIL, bankProfileName: client?.LIBELLE_PROFIL,
                };
            }

            user.clientCode = createData.clientCode;
            user.enabled = createData.enabled;
            user.pwdReseted = true;
            if (authUser) user.editors = [{ _id: authUser?._id, date: new Date().valueOf(), fullName: authUser.fullName }];

            const result = (await UsersController.usersService.create(user))?.data;

            // TODO review if this notification works, and create SMS notification 
            if (scope === 'back-office') notificationEmmiter.emit('users', new UsersEvent(user));

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
                fullName: `${authUser?.fullName}` || '',
                date: new Date().valueOf(),
            });

            // userDatas.enabled = !userDatas?.enabled;
            userDatas.fullName = `${userDatas?.fname} ${userDatas?.lname}`;
            userDatas.updated_at = new Date().valueOf();

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


    async getUsersInDemeureAndToBlock(query: QueryOptions) {
        try {
            const authUser = httpContext.get('user');
            if (authUser?.category < 500) { throw new Error('Forbidden'); }

            query = convertParams(query || {});
            query = extractPaginationData(query || {});

            const inDemeure = query?.filter?.inDemeure; delete query?.filter?.inDemeure;

            const { formalNoticeClientCodes, blockedClientCodes } = await this.getUserInDemeureAndToBlock({});
            const clientCodes = inDemeure ? formalNoticeClientCodes : blockedClientCodes;
            query.filter = query.filter ?? {};
            if (query?.filter?.clientCode) { query.filter['clientCode'] = { $regex: `${query.filter['clientCode']}` } }
            else {
                query.filter['clientCode'] = { $in: [...clientCodes] };
            }
            if (query?.filter?.fullName) { query.filter['fullName'] = { $regex: `${query.filter['fullName']}` }; }

            const users = await UsersController.usersService.findAll({ ...query, projection: { password: 0, otp: 0 } });
            return users

        } catch (error) { throw error; }
    }

    async getUserInDemeureAndToBlock(filter: QueryFilter): Promise<untimelyClientCodes> {

        let blockedClientCodes: string[] = []; const formalNoticeClientCodes: string[] = [];

        // TODO add travel-month in addition of aggregation
        const untimelyProofTravel = await TravelController.travelService.findAllAggregate<untimelyClientCodes>(listOfUntimelyClientCodesProofTravelAggregation(filter));
        blockedClientCodes.push(...(untimelyProofTravel[0]?.blockedClientCodes || []));

        const untimelyClientCodesShortTravel = await TravelController.travelService.findAllAggregate<untimelyClientCodes>(listOfUntimelyClientCodesTransactionsAggregation(filter, blockedClientCodes, 'travel'));
        blockedClientCodes.push(...(untimelyClientCodesShortTravel[0]?.blockedClientCodes || []));

        const untimelyClientCodesOnlinePayment = await OnlinePaymentController.onlinePaymentService.findAllAggregate<untimelyClientCodes>(listOfUntimelyClientCodesTransactionsAggregation(filter, blockedClientCodes, 'online-payment'));
        blockedClientCodes.push(...(untimelyClientCodesOnlinePayment[0]?.blockedClientCodes || []));

        const untimelyClientCodesTravelMonth = await TravelMonthController.travelMonthService.findAllAggregate<untimelyClientCodes>(listOfUntimelyClientCodesTransactionsAggregation(filter, blockedClientCodes, 'travel-month'));
        blockedClientCodes.push(...(untimelyClientCodesTravelMonth[0]?.blockedClientCodes || []));
        // const importations = await ImportsController.importsService.findAllAggregate<untimelyClientCodes>(listOfUntimelyClientCodesImportAggregation(filter));

        const allFormalNoticeClientCodes = [
            ...(untimelyProofTravel[0]?.formalNoticeClientCodes || []), ...(untimelyClientCodesShortTravel[0]?.formalNoticeClientCodes || []),
            ...(untimelyClientCodesOnlinePayment[0]?.formalNoticeClientCodes || []), ...(untimelyClientCodesTravelMonth[0]?.formalNoticeClientCodes || [])
        ];
        formalNoticeClientCodes.push(...new Set(allFormalNoticeClientCodes));

        const allBlockedClientCodes = [...new Set(blockedClientCodes)];
        blockedClientCodes = allBlockedClientCodes;

        return { formalNoticeClientCodes, blockedClientCodes }
    }


}
