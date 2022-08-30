import { usersCollection } from '../collections/users.collections';
import * as oauthHelper from './helpers/oauth/oauth.service.helper'
import { notificationService } from './notification.service';
import { commonService } from './common.service';
import { isString, isEmpty, get } from 'lodash';
import { User } from '../models/user';
import { logger } from '../winston';
import { config } from '../config';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';

const classPath = `services.auth`;

export const authService = {

    generateNewToken: async (refreshToken: any) => {
        logger.info('attempt to generate new token.');
        try {
            return oauthHelper.refresh(refreshToken);
        } catch (error) {
            logger.error(`\ngenerateNewToken error. \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    verifyCredentials: async (credentials: any) => {
        try {
            const { userCode, password } = credentials;

            const user = await usersCollection.getUserBy({ userCode });

            if (isEmpty(user)) { return new Error('UserNotFound'); }

            const pwdOk = await bcrypt.compare(password, user.password);

            if (!pwdOk) { return new Error('BadPassword'); }

            if (!user.enabled) { return new Error('disableUser'); }

            const otp = {
                value: commonService.getRandomString(6, true),
                expiresAt: moment().add(20, 'minutes').valueOf()
            }

            await usersCollection.updateUser(user._id, { otp });

            if (['development', 'staging'].includes(config.get('env'))) { return otp }
            logger.info(`sends authentication Token by email and SMS to user`);
            await Promise.all([
                notificationService.sendAuthTokenmail(user, otp),
                notificationService.sendTokenSMS(get(otp, 'value'), get(user, 'tel'))
            ]);
            if (['staging-bci'].includes(config.get('env'))) { return otp; }
        } catch (error) {
            logger.error(`\nError during credentials verification \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    verifyOtp: async (userCode: string, otpValue: string): Promise<any> => {
        try {
            if (!userCode || !otpValue) { return new Error('MissingAuthData'); }

            if (!isString(otpValue) || otpValue.length !== 6 || !/^[A-Z0-9]+$/.test(otpValue)) { return new Error('BadOTP'); }

            const user: User = await usersCollection.getUserBy({ userCode });

            if (!user) { return new Error('UserNotFound'); }

            const { otp } = user;

            if (otp.value !== otpValue) { return new Error('OTPNoMatch'); }

            const currTime = moment().valueOf();

            if (otp.expiresAt <= currTime) { return new Error('OTPExpired'); }            

            const tokenData = {
                _id: user._id.toString(), email: user.email, userCode: user.userCode, gender: user.gender,
                fname: user.fname, lname: user.lname, tel: user.tel, category: user.category, clientCode: user.clientCode
            };

            const oauth = oauthHelper.create(tokenData);
            delete user.password;
            delete user.otp;

            return { oauth, user };
        } catch (error) {
            logger.error(`\nError during OTP authentication verification \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    resetFirstPassword: async (userCode: string, currentPwd: string, newPwd: string, confirmPwd: string) => {
        try {
            if (!userCode || !currentPwd || !newPwd || !confirmPwd) { return new Error('EmailOrPasswordNotProvided'); }

            const user = await usersCollection.getUserByCode(userCode);

            if (!user) {
                logger.info('Error User not found in database');
                return new Error('UserNotFound');
            }

            const match = await bcrypt.compare(currentPwd, user.password);

            if (!match) {
                logger.info('Error reset password failed at password comparison');
                return new Error('FailedResetPassword');
            }

            if (newPwd !== confirmPwd) {
                return new Error('PasswordsProvidedAreDifferent');
            }

            if (newPwd === currentPwd) {
                return new Error('Passwordalreadyused');
            }

            const password = await bcrypt.hash(`${newPwd}`, config.get('saltRounds'));

            await usersCollection.updateUser(user._id, { password, pwdReseted: true });

            return {};
        } catch (error) {
            logger.error(`\nError while updating first password  \n${error.message}\n${error.stack}\n`);
            return error;
        }
    }
}