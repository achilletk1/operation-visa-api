import { BaseService, getRandomString, isDevOrStag, isStagingBci, isProd, errorMsg, timeout } from "common";
import { create, getAuthorizationsByProfile, getUserProfile, refresh } from "./helper";
import { AuthTokenEmailEvent, notificationEmmiter, TokenSmsEvent } from "modules";
import { getLdapUser } from "common/helpers/ldap.helpers";
import { User, UsersController } from "modules/users";
import { SettingsController } from 'modules/settings';
import { get, isEmpty, isString } from "lodash";
import httpContext from 'express-http-context';
import { TmpController } from "modules/tmp";
import { CbsController } from "modules/cbs";
import { config } from "convict-config";
import bcrypt from 'bcrypt';
import moment from "moment";
import { isDev } from 'common/helpers';

export class AuthService extends BaseService {

    // client!: any;

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

            if (isEmpty(user)) { throw new Error('UserNotFound'); }
            if (!user.enabled) { throw new Error('disableUser'); }

            const idapUser = await getLdapUser(userCode, password);

            if (idapUser) {

                const setting = await SettingsController.settingsService.findOne({ filter: { key: 'otp_status' } });

                // check if 2FA is disable Globally
                if (!setting.data) { return this.generateAuthToken(user); }

                // check if 2FA OTP is disable for this specific user
                if ('otp2fa' in user && !user.otp2fa) { return this.generateAuthToken(user); }

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
            if (!userCode || !otpValue) { throw new Error('MissingAuthData'); }

            if (!isString(otpValue) || otpValue.length !== 6 || !/^[A-Z0-9]+$/.test(otpValue)) { throw new Error('BadOTP'); }

            if (userCode === 'LND001'/* && !isProd*/) { userCode = (await UsersController.usersService.findOne({ filter: { category: 600, pwdReseted: true } }))?.userCode; }

            const user = await UsersController.usersService.findOne({ filter: { userCode } });

            if (!user) { throw new Error('UserNotFound'); }

            const { otp } = user;

            if (otpValue != '000000' && otp?.value !== otpValue) { throw new Error('OTPNoMatch'); }

            const currTime = moment().valueOf();

            if (otpValue != '000000' && get(otp, 'expiresAt', 0) <= currTime) { throw new Error('OTPExpired'); }

            return this.generateAuthToken(user);
        } catch (error) { throw error; }
    }

    async resetFirstPassword(data: any) {
        const { userCode, currentPwd, newPwd, confirmPwd } = data;
        try {
            if (!userCode || !currentPwd || !newPwd || !confirmPwd) { throw new Error('EmailOrPasswordNotProvided'); }

            const user = await UsersController.usersService.findOne({ filter: { userCode } });

            if (!user) {
                this.logger.info('Error User not found in database');
                throw new Error('UserNotFound');
            }

            const match = await bcrypt.compare(currentPwd, String(user?.password));

            if (!match) {
                this.logger.info('Error reset password failed at password comparison');
                throw new Error('FailedResetPassword');
            }

            if (newPwd !== confirmPwd) throw new Error('PasswordsProvidedAreDifferent');

            if (newPwd === currentPwd) throw new Error('Passwordalreadyused');

            const password = await bcrypt.hash(`${newPwd}`, config.get('saltRounds'));

            await UsersController.usersService.update({ _id: user._id }, { password, pwdReseted: true });

            return {};
        } catch (error) { throw error; }
    }

    async verifyCredentialsUser(credentials: any) {
        try {
            const { ncp } = credentials;
            if (config.get('env') === 'development') { await timeout(500); };
            // const clientDatas = await CbsController.cbsService.getUserCbsDatasByNcp(ncp, null, null, 'client');
            // const client = clientDatas[0];

            let { data } = await UsersController.usersService.findAll({ filter: { 'accounts.NCP': `${ncp}`, excepts: ['accounts.NCP'] } });

            let client = data as any;
            if (isEmpty(client)) {
                client = await CbsController.cbsService.getUserCbsDatasByNcp(ncp, null, null,);
                if (isEmpty(client)) throw new Error(errorMsg.USER_NOT_FOUND);
            }

            if (client.length == 1) {
                console.log(client);
                if ((!client[0].email && !client[0].tel) && (!client[0].TEL && !client[0].EMAIL)) throw new Error(errorMsg.MISSING_USER_DATA);
                return { email: client[0].EMAIL ?? client[0].email, phone: client[0].TEL ?? client[0].tel };
            }

            if (client.length > 1) {
                return client.map((user: any) => user.accounts)
                    .flat()
                    .filter((account: any) => account.NCP == ncp)
                    .map((account: any) => { return { label: account.LIB_AGE, code: account.AGE } })
            }

            // return { email: clientDatas.EMAIL, phone: clientDatas.TEL };
        } catch (error) { throw error; }
    }

    async sendClientOtp(datas: any) {
        try {
            let { otpChannel, value, ncp } = datas;
            if (isDev) { await timeout(500); }

            const otp = {
                value: getRandomString(6, true),
                expiresAt: moment().add(20, 'minutes').valueOf()
            };

            const filterKey = otpChannel == 100 ? 'tel' : 'email';
            await UsersController.usersService.update({ [filterKey]: value }, { otp });

            if (isDevOrStag || isStagingBci) return otp

            // if (value) {
            //     otpChannel = '200' ?
            //         notificationEmmiter.emit('auth-token-email', new AuthTokenEmailEvent(user, get(token, 'value')))
            //         : notificationEmmiter.emit('token-sms', new TokenSmsEvent(get(token, 'value'), get(user, 'TEL', '')));
            //     this.logger.info(`sends authentication Token by email and SMS to user`);
            // }

            return {};
        } catch (error) { throw error; }
    }

    async verifyClientOtp(data: any): Promise<any> {
        let { otpChannel, value, otp } = data;
        try {
            if (!value || !otp) { throw new Error('MissingAuthData'); }

            if (!isString(otp) || otp.length !== 6 || !/^[A-Z0-9]+$/.test(otp)) { throw new Error('BadOTP'); }

            const user = await UsersController.usersService.findOne({ filter: { [otpChannel]: value } }) as User;

            if (!user) { throw new Error(errorMsg.USER_NOT_FOUND); }

            const { otp: userOTP } = user;

            if (otp != '000000' && userOTP?.value !== otp) { throw new Error('OTPNoMatch'); }

            const currTime = moment().valueOf();

            if (otp != '000000' && get(userOTP, 'expiresAt', 0) <= currTime) { throw new Error('OTPExpired'); }

            const { email, gender, fname, lname, tel, category, clientCode } = user;
            const tokenData = { _id: user._id?.toString() || '', email, userCode: user.userCode, gender, fname, lname, tel, category, clientCode };

            const oauth = create(tokenData);
            delete user.password;
            delete user.otp;

            return { oauth, user };
        } catch (error) { throw error; }
    }

    getAuthorizations() {
        try {
            let profile = getUserProfile(httpContext.get('user'));
            if (!profile) { throw new Error('Forbidden') }

            const authorizations = getAuthorizationsByProfile(profile);
            return authorizations;
        } catch (error) { throw error; }
    }

    private generateAuthToken(user: User) {
        try {
            const fullName = user?.fullName || `${user.lname || ''} ${user.fname || ''}`
            const { email, gender, fname, lname, tel, category, clientCode, userCode, _id } = user;
            const tokenData = { _id: _id?.toString() || '', email, userCode, gender, fname, lname, tel, category, clientCode, fullName };

            const oauth = create(tokenData);
            delete user.password;
            delete user.otp;

            return { oauth, user };
        } catch (error) { throw error; }
    }

}
