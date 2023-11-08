import { BaseService, getRandomString, isDevOrStag, isStagingBci } from "common";
import { UsersController } from "modules/users";
import { get, isEmpty, isString } from "lodash";
import { create, refresh } from "./helper";
import { config } from "convict-config";
import bcrypt from 'bcrypt';
import moment from "moment";

export class AuthService extends BaseService {

    constructor() { super() }

    async generateNewToken(refreshToken: any) {
        this.logger.info('attempt to generate new token.');
        try { return refresh(refreshToken); }
        catch (error) { throw error; }
    }

    async verifyCredentials(credentials: any) {
        try {
            const { userCode, password } = credentials;

            const user = await UsersController.usersService.findOne({ filter: { userCode } });

            if (isEmpty(user)) { throw Error('UserNotFound'); }

            const pwdOk = bcrypt.compare(password, String(user?.password));

            if (!pwdOk) { throw Error('BadPassword'); }

            if (!user.enabled) { throw Error('disableUser'); }

            const otp = {
                value: getRandomString(6, true),
                expiresAt: moment().add(20, 'minutes').valueOf()
            }

            await UsersController.usersService.update({ _id: user._id }, { otp });

            if (isDevOrStag) { return otp }
            this.logger.info(`sends authentication Token by email and SMS to user`);

            if (isStagingBci) { return otp; }
        } catch (error) { throw error; }
    }

    async verifyOtp(data: any): Promise<any> {
        const userCode = data?.userCode;
        const otpValue = data?.otp;
        try {
            if (!userCode || !otpValue) { throw Error('MissingAuthData'); }

            if (!isString(otpValue) || otpValue.length !== 6 || !/^[A-Z0-9]+$/.test(otpValue)) { throw Error('BadOTP'); }

            const user = await UsersController.usersService.findOne({ filter: { userCode } });

            if (!user) { throw Error('UserNotFound'); }

            const { otp } = user;

            if (otp?.value !== otp) { throw Error('OTPNoMatch'); }

            const currTime = moment().valueOf();

            if (get(otp, 'expiresAt', 0) <= currTime) { throw Error('OTPExpired'); }

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

}
