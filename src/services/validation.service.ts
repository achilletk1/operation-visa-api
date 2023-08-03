import httpContext from 'express-http-context';
import { logger } from '../winston';
import { get, isEmpty } from 'lodash';
import { Travel } from '../models/travel';
import { travelService } from './travel.service';
import { commonService } from './common.service';
import moment from 'moment';
import { usersCollection } from '../collections/users.collection';
import { notificationService } from './notification.service';
import { config } from '../config';
import { User } from '../models/user';
import { OpeVisaStatus, Validator } from '../models/visa-operations';
import { travelsCollection } from '../collections/travels.collection';
import { ObjectId } from 'mongodb';

export const validationService = {

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

    insertvalidation: async (id: string, fields: any): Promise<any> => {

        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { return new Error('Forbidden'); }

            const { userId, type, otp, signature, status, rejectReason } = fields;

            if (userId !== get(authUser, '_id')) { return new Error('UserNotMatch'); }


            const user = await usersCollection.getUserById(userId) as User;

            if (!otp) { return new Error('OTPNotFound'); }

            if (otp !== user.otp.value) { return new Error('OTPNoMatch'); }
            let level: number;

            const currTime = moment().valueOf();

            if (user.otp.expiresAt <= currTime) { return new Error('OTPExpired'); }
            if (type === 'travel') {
                const travel: Travel = await travelService.getTravelById(id);
                if (!travel) { return new Error('TravelNotFound'); }
                level = travel?.validationLevel ? travel?.validationLevel + 1 : 1;
                if (!user?.visaOpValidation || !user?.visaOpValidation?.enabled || user?.visaOpValidation?.level !== level) { return new Error('ValidationForbidden') }

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


                const otherValidators = await usersCollection.getUsersBy({ category: { $gte: 500 }, 'visaOpValidation.enabled': true, 'visaOpValidation.level': { $gt: user.visaOpValidation.level } });
                if (isEmpty(otherValidators) || user.visaOpValidation.fullRigth || status === OpeVisaStatus.REJECTED) {
                    travel.status = status;
                    //TODO send status changed notification
                }


                travel.validators = isEmpty(travel.validators) ? [validator] : [...travel.validators, validator];
                travel.validationLevel = level;
                await travelsCollection.updateTravelsById(id, travel);

                //TODO send validation notification
                return { id };
            }



        } catch (error) {
            logger.error(`Error while init validation \n${error.message}\n${error.stack}\n`);
            return error;
        }
    },


}
