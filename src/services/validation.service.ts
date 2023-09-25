import httpContext from 'express-http-context';
import { logger } from '../winston';
import { get, isEmpty } from 'lodash';
import { Travel } from '../models/travel';
import { commonService } from './common.service';
import moment from 'moment';
import { usersCollection } from '../collections/users.collection';
import { notificationService } from './notification.service';
import { config } from '../config';
import { User } from '../models/user';
import { OpeVisaStatus, Validator } from '../models/visa-operations';
import { travelsCollection } from '../collections/travels.collection';
import { OnlinePaymentMonth } from '../models/online-payment';
import { onlinePaymentsCollection } from '../collections/online-payments.collection';
import { UserValidator } from '../models/user-validator';
import { validationsCollection } from '../collections/validation.collection';

export const validationService = {

    insertUserValidator: async (userValidator: UserValidator) => {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }

            const { userId } = userValidator;
            const user = await usersCollection.getUserById(userId);

            if (!user) { return new Error('UserNotFoud') }
            const validatorExist = await validationsCollection.getUserValidatorBy({ userId });


            const validationsLevelList = await validationsCollection.getUserLevelListBy(userId);
            const isGapInValidation = validationListHasGap(validationsLevelList, userValidator.level);
            if (isGapInValidation) { return new Error('ValidationLevelGap'); }

            userValidator.dates = !validatorExist ? { created: moment().valueOf() } : { ...userValidator.dates, updated: moment().valueOf() };
            const result = !validatorExist ? await validationsCollection.insertUserValidator(userValidator) : await validationsCollection.updateUserValidatorsById(get(validatorExist, '_id'), { ...userValidator });
            return result;
        } catch (error) {
            logger.error(`Error while getting validation otp \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getUserValidators: async (fields: any): Promise<any> => {

        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }

            commonService.parseNumberFields(fields);
            let { offset, limit, start, end } = fields;
            if (![typeof offset, typeof limit].includes('number')) { offset = undefined, limit = undefined; }

            delete fields.offset;
            delete fields.limit;
            delete fields.start;
            delete fields.end;
            const range = (start && end) ? { start: moment(start).startOf('day').valueOf(), end: moment(end).endOf('day').valueOf() } :
                undefined;

            const { data, total } = await validationsCollection.getUserValidators(fields || {}, offset || 1, limit || 40, range);
            return { data, total };

        } catch (error) {
            logger.error(`Error while getting user validators \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getUserValidatorById: async (userId: string): Promise<any> => {

        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }
            const data = await validationsCollection.getUserValidatorBy({ userId });
            return data;
        } catch (error) {
            logger.error(`Error while getting user validator id \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },
    getValidationOtp: async (userId: string): Promise<any> => {

        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }


            if (userId !== get(authUser, '_id')) { return new Error('UserNotMatch'); }
            const otp = {
                value: commonService.getRandomString(6, true),
                expiresAt: moment().add(20, 'minutes').valueOf()
            }

            await usersCollection.updateUser(get(authUser, '_id'), { otp });
            await Promise.all([
                notificationService.sendValidationTokenEmail(authUser, otp),
                notificationService.sendTokenSMS(get(otp, 'value'), get(authUser, 'tel'))
            ]);

            if (['development', 'staging', 'staging-bci'].includes(config.get('env'))) { return otp }
            logger.info(`sends validation  Token by email and SMS to user`);


        } catch (error) {
            logger.error(`Error while getting validation otp \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    getMaxValidationLevel: async (): Promise<any> => {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }

            const data = await validationsCollection.getMaxValidationLevel();

            return { level: data[0]?.level || 0 };
        } catch (error) {
            logger.error(`Error while getting validation otp \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },

    insertvalidation: async (id: string, fields: any): Promise<any> => {

        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }

            const { userId, type, otp, signature, status, rejectReason } = fields;

            if (userId !== get(authUser, '_id')) { return new Error('UserNotMatch'); }

            let data: Travel | OnlinePaymentMonth;

            const user = await usersCollection.getUserById(userId) as User;

            if (!otp) { return new Error('OTPNotFound'); }

            if (otp !== user.otp.value) { return new Error('OTPNoMatch'); }
            let level: number;

            const currTime = moment().valueOf();

            if (user.otp.expiresAt <= currTime) { return new Error('OTPExpired'); }

            data = type === 'travel' ? await travelsCollection.getTravelById(id) : type === 'onlinePayment' ? await onlinePaymentsCollection.getOnlinePaymentById(id) : null;
            if (!data) { return new Error('DataNotFound'); }

            const userValidator: UserValidator = await validationsCollection.getUserValidatorBy({ userId });
            level = data?.validationLevel ? data?.validationLevel + 1 : 1;
            if (!userValidator || !userValidator?.enabled || userValidator?.level !== level) { return new Error('ValidationForbidden') }

            const validator: Validator = {
                _id: userId,
                fullName: `${user.fname} ${user.lname}`,
                userCode: user?.userCode,
                signature,
                date: moment().valueOf(),
                status,
                level,
                rejectReason
            }

            const otherValidators = await validationsCollection.getUserValidatorsBy({ enabled: true, level: { $gt: userValidator.level } });
            if (isEmpty(otherValidators) || userValidator.fullRights || status === OpeVisaStatus.REJECTED) {
                data.status = status;
                type === 'travel' ? await notificationService.sendEmailTravelStatusChanged(data as Travel, get(data, 'user.email')) : type === 'onlinePayment' ? await notificationService.sendEmailOnlinePayementStatusChanged(data as OnlinePaymentMonth, get(data, 'user.email')) : null;
            }


            data.validators = isEmpty(data.validators) ? [validator] : [...data.validators, validator];
            data.validationLevel = level;

            const result = type === 'travel' ? await travelsCollection.updateTravelsById(id, data) : type === 'onlinePayment' ? await onlinePaymentsCollection.updateOnlinePaymentsById(id, data) : null;

            if (!isEmpty(otherValidators) && status === OpeVisaStatus.JUSTIFY) {
                await Promise.all(otherValidators.filter((otherValidator: UserValidator) => otherValidator.fullRights || otherValidator.level === level + 1).map(async (otherValidator: User) => {
                    await notificationService.sendEmailValidationRequired({ _id: id, ...data }, otherValidator.email, otherValidator, type);
                }));
            }

            return result;



        } catch (error) {
            logger.error(`Error while init validation \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },


}

const hasGaps = (data: number[]) => {
    if (!data.includes(1)) { return true }

    if (data == null || data.length === 0) {
        return false;
    }
    if (data[data.length - 1] - data[0] + 1 !== data.length) {
        return true;
    }
    for (let i = 1; i < data.length; i++) {
        if (data[i] !== data[i - 1] + 1) {
            return true;
        }
    }
    return false;
}

const validationListHasGap = (validationLevelList: any[], newLevel: number) => {
    validationLevelList = validationLevelList.map(elt => elt.level).sort();
    // insert level to update
    validationLevelList.push(newLevel);

    // remove duplicates levels
    validationLevelList = [...new Set(validationLevelList)];
    // control validation gap
    const isGaps = hasGaps(validationLevelList);

    return isGaps;
}
