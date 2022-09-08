import { usersCollection } from '../collections/users.collections';
import { notificationService } from './notification.service';
import * as httpContext from 'express-http-context';
import { commonService } from './common.service';
import { User } from './../models/user';
import { isEmpty, get } from 'lodash';
import { logger } from '../winston';
import { config } from '../config';
import * as moment from 'moment';
import { hash } from 'bcrypt';

export const usersService = {

    getUsers: async (fields?: any): Promise<any> => {

        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }

            commonService.parseNumberFields(fields);
            const { start, end, provider, ncp, category, status, walletList } = fields;
            let { offset, limit } = fields;
            if (![typeof offset, typeof limit].includes('number')) { offset = undefined, limit = undefined; }

            delete fields.offset;
            delete fields.limit;
            delete fields.start;
            delete fields.end;

            if (category && category === 100499) { fields.category = { '$in': [100, 201] }; }

            const range = (start && end) ? { start: moment(start).startOf('day').valueOf(), end: moment(end).endOf('day').valueOf() } :
                undefined;

            if (walletList) {
                // revoir en combinaison de 3 (ncp, status, provider)

                if (provider) { fields[`${provider}.enable`] = (!status) ? { $exists: true } : status.toLowerCase() === 'true'; }
                if (!provider && status && !ncp) { fields.$or = [{ 'walletAirtel.enable': status.toLowerCase() === 'true' }, { 'walletMTN.enable': status.toLowerCase() === 'true' }, { 'walletGIMAC.enable': status.toLowerCase() === 'true' }] }

                if (provider && ncp) { fields[`${provider}.account.ncp`] = ncp; }
                if (!provider && !status && ncp) { fields.$or = [{ 'walletAirtel.account.ncp': ncp }, { 'walletMTN.account.ncp': ncp }, { 'walletGIMAC.account.ncp': ncp }] }
                if (!provider && status && ncp) {
                    fields.$and = [{ '$or': [{ 'walletAirtel.enable': status.toLowerCase() === 'true' }, { 'walletMTN.enable': status.toLowerCase() === 'true' }, { 'walletGIMAC.enable': status.toLowerCase() === 'true' }] }, { '$or': [{ 'walletAirtel.account.ncp': ncp }, { 'walletMTN.account.ncp': ncp }, { 'walletGIMAC.account.ncp': ncp }] }];
                }
                if (!provider && !status && !ncp) { fields.$or = [{ 'walletAirtel': { $exists: true } }, { 'walletMTN.': { $exists: true } }, { 'walletGIMAC': { $exists: true } }]; }
                fields.category = 100;
                delete fields.walletList;
                delete fields.provider;
                delete fields.status;
                delete fields.ncp;
            }

            // if (provider) { fields[`${provider}.enable`] = [undefined].includes(status) ? true : Boolean(status); }
            // if (status && !provider) { fields.$and = [{ 'walletAirtel.enable': status }, { 'walletMTN.enable': status }, { 'walletGIMAC.enable': status }] }

            // if (ncp && provider) { fields[`${provider}.account.ncp`] = ncp; }
            // if (ncp && !provider) { fields.$or = [{ 'walletAirtel.account.ncp': ncp }, { 'walletMTN.account.ncp': ncp }, { 'walletGIMAC.account.ncp': ncp }] }

            // if (provider) { fields.$or = [{ 'walletAirtel.enable': status }, { 'walletMTN.enable': status }, { 'walletGIMAC.enable': status }] }

            const { data, total } = await usersCollection.getUsers(fields || {}, offset || 1, limit || 40, range);
            return { data, total };

        } catch (error) {
            logger.error(`Error while getting request checkbooks \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    insertUser: async (user: User): Promise<any> => {
        try {
            commonService.parseNumberFields(user);
            const authUser = httpContext.get('user');

            const isAdmin = [500, 600, 601, 602, 603].includes(user?.category);

            if (![500, 600,602,604].includes(authUser?.category)) { return new Error('Forbidden'); }

            if ([500, 600].includes(user?.category) && authUser?.category !== 600) { return new Error('Forbidden'); }

            let userCode: string;
            let _user: any;
            delete user._id;
            if (isAdmin) {
                const existUserCode = await usersCollection.getUserBy({ userCode: user?.userCode });
                if (!isEmpty(existUserCode)) { return new Error('UserCodeAllreadyUsed'); }
            }

            if (![500, 600, 601, 602, 603, 604, 200].includes(user?.category)) {
                do {
                    userCode = `30013${commonService.getRandomString(6, false)}`
                    _user = await usersCollection.getUserBy({ userCode });
                } while (!isEmpty(_user));

                user.userCode = userCode;

                if (user.walletGIMAC) { user.walletGIMAC.tel = user?.userCode; }

                // if (![200].includes(user.category)) {
                //     const existUser = await usersCollection.getUserBy({ clientCode: user?.clientCode });
                //     if (!isEmpty(existUser)) { return new Error('UserAllreadyCreated'); }
                // } 

            }

            const existUserCode = await usersCollection.getUserBy({ userCode: user?.userCode });
            if (!isEmpty(existUserCode)) { return new Error('UserCodeAllreadyUsed'); }

            const password = commonService.getRandomString(6);

            user.password = await hash(password, config.get('saltRounds'));

            const result = await usersCollection.insertUser(user);

            Promise.all([
                // await notificationService.sendWelcomeSMS(user, password, user?.tel),
                await notificationService.sendEmailWelcome(user, password),
            ]);


            const data = { _id: result?.insertedId };

            return data;

        } catch (error) {
            logger.error(`user creation failed \n${error?.name} \n${error?.stack}`);
            return error;
        }
    },

    updateUser: async (id: string, user: User, query?: any): Promise<any> => {

        try {
            const authUser = httpContext.get('user');
            if (![500, 600].includes(authUser?.category)) { return new Error('Forbidden'); }

            if ([500, 600].includes(user?.category) && authUser?.category !== 600) { return new Error('Forbidden'); }

            delete user?.password;
            delete user?.otp;

            await usersCollection.updateUser(id, user);
        } catch (error) {
            logger.error(`update user failed \n${error.name} \n${error.stack}`);
            return error;
        }
    },

    ResetPwrd: async (userId: string, fileds?: any): Promise<any> => {

        const AuthUser = httpContext.get('user');
        if (AuthUser?.category !== 600) { return new Error('Forbidden'); }

        try {
            const user = await usersCollection.getUserById(userId);
            if (!user) { return new Error('UserNotFound') }
            const passwordClear = commonService.getRandomString(6);
            const password = await hash(passwordClear, config.get('saltRounds'));
            await usersCollection.updateUser(userId, { password }, { pwdReseted: false });
            await Promise.all([
                notificationService.sendEmailPwdReseted(user, passwordClear),
                // notificationService.sendPwdResetedSMS(user, passwordClear)
            ]);
            return {};
        } catch (error) {
            logger.error(`reset user password failed \n${error.name} \n${error.stack}`);
            return error;
        }
    },

    getUserById: async (id: string): Promise<User> => {
        const user = await usersCollection.getUserById(id);
        if (!user) { return user; }
        delete user?.password;
        delete user?.otp;
        return user;
    },

    getUserBy: async (filters: any): Promise<any> => {
        commonService.parseNumberFields(filters);
        const isUserCreation = filters?.isUserCreation;
        const isAdminCreation = filters?.isAdminCreation;
        delete filters.isUserCreation;
        delete filters.isAdminCreation;
        try {
            const user = await usersCollection.getUserBy(filters);
            // if (!user) { return ''; }
            // logger.debug(`user: ${JSON.stringify(user)}`)
            if (!isEmpty(isUserCreation) || !isEmpty(isAdminCreation)) {
                if (!isEmpty(isUserCreation) && user?.category > 499) {
                    filters.category = { '$nin': [600, 601, 602, 603, 604, 500, 200, 201] };
                }
                if (!isEmpty(isAdminCreation) && user?.category < 499) {
                    filters.category = { '$in': [600, 601, 602, 603, 604, 500] };
                }
                return await usersCollection.getUserBy(filters);
            }

            if (!user) { return user; }
            delete user.password;
            delete user.otp;
            return user;
        } catch (error) {
            logger.error(`get user by ${filters} failed \n${error.name} \n${error.stack}`);
            return error;
        }
    },

    getUsersBy: async (filters: any): Promise<any> => {
        commonService.parseNumberFields(filters);
        try {
            let users = await usersCollection.getUsersBy(filters);

            if (!users) { return new Error('NotFound'); }

            users = users.map((user: User) => {
                if (!user) { return user; }
                delete user.password;
                delete user.otp;
                return user;
            });
            return users;
        } catch (error) {
            logger.error(`get user by ${filters} ailed \n${error.name} \n${error.stack}`);
            return error;
        }
    },

}
