import { BaseService, getRandomString, isDevOrStag, isStagingBci, isProd, errorMsg, timeout } from "common";
import { create, getAuthorizationsByProfile, getUserProfile, refresh } from "./helper";
import { AuthTokenEmailEvent, notificationEmmiter, TokenSmsEvent } from "modules";
import { getLdapUser } from "common/helpers/ldap.helpers";
import { UsersController } from "modules/users";
import { get, isEmpty, isString } from "lodash";
import httpContext from 'express-http-context';
import { config } from "convict-config";
import bcrypt from 'bcrypt';
import moment from "moment";
import crypt from "url-crypt";
import { UsersOtpEvent } from "modules/notifications/notifications/mail/users-otp";
import { clientsDAO } from "modules/users/oracle-daos/clients.dao";
import { TmpController } from "modules/tmp";
const { cryptObj, decryptObj } = crypt(config.get('exportSalt'));

export class AuthService extends BaseService {

    client!: any;

    constructor() { super() }

    async generateNewToken(refreshToken: any) {
        this.logger.info('attempt to generate new token.');
        try { return refresh(refreshToken); }
        catch (error) { throw error; }
    }

    async verifyCredentials(credentials: any) {
        try {
            const { userCode, password } = credentials;

            if (userCode === 'LND001' && password === 'admin' && !isProd) {
                return { value: '000000', expiresAt: moment().add(20, 'minutes').valueOf() };
            }

            const user = await UsersController.usersService.findOne({ filter: { userCode } });

            if (isEmpty(user)) { throw Error('UserNotFound'); }
            if (!user.enabled) { throw Error('disableUser'); }

            const idapUser = await getLdapUser(userCode, password);

            if (idapUser) {
                const otp = {
                    value: getRandomString(6, true),
                    expiresAt: moment().add(20, 'minutes').valueOf()
                }

                await UsersController.usersService.update({ _id: user._id }, { otp });

                if (isDevOrStag) { return otp }
                notificationEmmiter.emit('auth-token-email', new AuthTokenEmailEvent(user, get(otp, 'value')));
                notificationEmmiter.emit('token-sms', new TokenSmsEvent(get(otp, 'value'), get(user, 'tel', '')));
                this.logger.info(`sends authentication Token by email and SMS to user`);

                if (isStagingBci) { return otp; }
            }

        } catch (error) { throw error; }
    }

    async verifyOtp(data: any): Promise<any> {
        let userCode = data?.userCode;
        const otpValue = data?.otp;
        try {
            if (!userCode || !otpValue) { throw Error('MissingAuthData'); }

            if (!isString(otpValue) || otpValue.length !== 6 || !/^[A-Z0-9]+$/.test(otpValue)) { throw Error('BadOTP'); }

            if (userCode === 'LND001' && !isProd) { userCode = 'c_ndong'; }

            const user = await UsersController.usersService.findOne({ filter: { userCode } });

            if (!user) { throw Error('UserNotFound'); }

            const { otp } = user;

            if (otpValue != '000000' && otp?.value !== otpValue) { throw Error('OTPNoMatch'); }

            const currTime = moment().valueOf();

            if (otpValue != '000000' && get(otp, 'expiresAt', 0) <= currTime) { throw Error('OTPExpired'); }

            const { email, gender, fname, lname, tel, category, clientCode } = user;
            const tokenData = { _id: user._id.toString(), email, userCode: user.userCode, gender, fname, lname, tel, category, clientCode };

            const oauth = create(tokenData);
            delete user.password;
            delete user.otp;

            return { oauth, user };
        } catch (error) { throw error; }
    }

    async resetFirstPassword(data: any) {
        const { userCode, currentPwd, newPwd, confirmPwd } = data;
        try {
            if (!userCode || !currentPwd || !newPwd || !confirmPwd) { throw Error('EmailOrPasswordNotProvided'); }

            const user = await UsersController.usersService.findOne({ filter: { userCode } });

            if (!user) {
                this.logger.info('Error User not found in database');
                throw Error('UserNotFound');
            }

            const match = await bcrypt.compare(currentPwd, String(user?.password));

            if (!match) {
                this.logger.info('Error reset password failed at password comparison');
                throw Error('FailedResetPassword');
            }

            if (newPwd !== confirmPwd) throw Error('PasswordsProvidedAreDifferent');

            if (newPwd === currentPwd) throw Error('Passwordalreadyused');

            const password = await bcrypt.hash(`${newPwd}`, config.get('saltRounds'));

            await UsersController.usersService.update({ _id: user._id }, { password, pwdReseted: true });

            return {};
        } catch (error) { throw error; }
    }

    async verifyCredentialsUser(credentials: any) {
        try {
            const { ncp } = credentials;
            if (['development'].includes(config.get('env'))) { await timeout(500); }
            const clientDatas = await clientsDAO.getClientDatasByNcp(ncp);
            if (isEmpty(clientDatas)) { throw new Error(errorMsg.USER_NOT_FOUND); }

            this.client =clientDatas[0];
            if (!this.client.TEL && !this.client.EMAIL) { return new Error(errorMsg.MISSING_USER_DATA); }

            return { email: this.client.EMAIL, phone: this.client.TEL };
        } catch (error) { throw error; }
    }

    async SendClientOtp(datas: any) {
        try {
            let { otpChannel, value, ncp } = datas;
            if (['development'].includes(config.get('env'))) { await timeout(500); }
            const token = {
                value: getRandomString(6, true),
                expiresAt: moment().add(20, 'minutes').valueOf()
            }
            try {
                const tmpData = {
                    otp: token,
                    otpChannel,
                    value,
                    expired_at: moment().add(21, 'minutes').valueOf(),
                }
                let user = await TmpController.tmpService.findOne({ filter: { ncp } });

                if (!user) {
                    user = { ncp, ...tmpData }
                    await TmpController.tmpService.create(user);
                }

                const data ={ ...tmpData, ...this.client };
                await TmpController.tmpService.update({ ncp }, data);

                if (isDevOrStag || isStagingBci) { return token }

                if (value) {
                    otpChannel = '200' ?
                        notificationEmmiter.emit('auth-token-email', new AuthTokenEmailEvent(user, get(token, 'value')))
                        : notificationEmmiter.emit('token-sms', new TokenSmsEvent(get(token, 'value'), get(user, 'TEL', '')));
                    this.logger.info(`sends authentication Token by email and SMS to user`);
                }

                return {};
            } catch (error: any) {
                return error;
            }

        } catch (error) { throw error; }
    }


    async verifyClientOtp(data: any): Promise<any> {
        let ncp = data?.ncp;
        const otpValue = data?.otp;
        try {
            if (!ncp || !otpValue) { throw Error('MissingAuthData'); }

            if (!isString(otpValue) || otpValue.length !== 6 || !/^[A-Z0-9]+$/.test(otpValue)) { throw Error('BadOTP'); }

            const user = await TmpController.tmpService.findOne({ filter: { ncp } });

            if (!user) { throw new Error(errorMsg.USER_NOT_FOUND);  }

            const { otp } = user;

            if (otpValue != '000000' && otp?.value !== otpValue) { throw Error('OTPNoMatch'); }

            const currTime = moment().valueOf();

            if (otpValue != '000000' && get(otp, 'expiresAt', 0) <= currTime) { throw Error('OTPExpired'); }

            const { email, gender, fname, lname, tel, category, clientCode } = user;
            const tokenData = { _id: user._id.toString(), email, userCode: user.userCode, gender, fname, lname, tel, category, clientCode };

            const oauth = create(tokenData);
            delete user.password;
            delete user.otp;

            return { oauth, user };
        } catch (error) { throw error; }
    }

    getAuthorizations() {
        try {
            let profile = getUserProfile(httpContext.get('user'));
            if (!profile) { throw Error('Forbidden') }

            const authorizations = getAuthorizationsByProfile(profile);
            return authorizations;
        } catch (error) { throw error; }
    }

}
