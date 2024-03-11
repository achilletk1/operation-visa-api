import { notificationEmmiter, OnlinePaymentStatusChangedEvent, TokenSmsEvent, TravelStatusChangedEvent, ValidationRequiredEvent, ValidationTokenEvent } from 'modules/notifications';
import { OnlinePaymentController, OnlinePaymentMonth } from "modules/online-payment";
import { OpeVisaStatus, Validator } from "modules/visa-operations";
import { ValidationsRepository } from "./validations.repository";
import { ValidationsController } from "./validations.controller";
import { Travel, TravelController } from 'modules/travel';
import { getRandomString, isProd } from "common/helpers";
import { UsersController } from 'modules/users';
import httpContext from 'express-http-context';
import { CrudService } from "common/base";
import { UserValidator } from "./model";
import { get, isEmpty } from "lodash";
import moment from "moment";

export class ValidationsService extends CrudService<UserValidator> {

    static validationsRepository: ValidationsRepository;

    constructor() {
        ValidationsService.validationsRepository = new ValidationsRepository();
        super(ValidationsService.validationsRepository);
    }

    async getUserValidatorById(userId: string) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { throw new Error('Forbidden'); }
            return await ValidationsController.validationsService.findOne({ filter: { userId } });
        } catch (error) { throw error; }
    }

    async getUserValidators(filter: any) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { throw new Error('Forbidden'); }
            return await ValidationsController.validationsService.findAll({ filter });
        } catch (error) { throw error; }
    }

    async getMaxValidationLevel() {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { throw new Error('Forbidden'); }

            const data: any = await ValidationsService.validationsRepository.getMaxValidationLevel();

            return { level: data[0]?.level || 0 };
        } catch (error) { throw error; }
    }

    async getValidationOtp(userId: string) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { throw new Error('Forbidden'); }

            if (userId !== get(authUser, '_id')) { throw new Error('UserNotMatch'); }
            const otp = {
                value: getRandomString(6, true),
                expiresAt: moment().add(20, 'minutes').valueOf()
            }

            await UsersController.usersService.update({ _id: get(authUser, '_id') }, { otp });

            if (!isProd) { return otp; }

            this.logger.info(`sends validation  Token by email and SMS to user`);
            notificationEmmiter.emit('validation-token-mail', new ValidationTokenEvent(authUser, otp));
            notificationEmmiter.emit('token-sms', new TokenSmsEvent(otp?.value, authUser?.tel));
            // await Promise.all([
            //     // NotificationsController.notificationsService.sendValidationTokenEmail(authUser, otp),
            //     NotificationsController.notificationsService.sendTokenSMS(get(otp, 'value'), get(authUser, 'tel'))
            // ]);
        } catch (error) { throw error; }
    }

    async insertUserValidator(userValidator: UserValidator) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { throw new Error('Forbidden'); }

            const { userId } = userValidator;
            const user = await UsersController.usersService.findOne({ filter: { _id: userId } });

            if (!user) { throw new Error('UserNotFoud') }
            const { data } = await ValidationsController.validationsService.findAll({ filter: { userId } });


            const opts = { filter: { userId: { $ne: userId }, enabled: true }, projection: { _id: 0, level: 1 } };
            const validationsLevelList = (await ValidationsController.validationsService.findAll(opts))?.data;
            const isGapInValidation = this.validationListHasGap(validationsLevelList, Number(userValidator?.level));
            if (isGapInValidation) { throw new Error('ValidationLevelGap'); }

            userValidator.dates = !data ? { created: new Date().valueOf() } : { ...userValidator.dates, updated: new Date().valueOf() };
            const result = isEmpty(data)
                ? await ValidationsController.validationsService.create(userValidator)
                : await ValidationsController.validationsService.update({ _id: data[0]?._id }, { ...userValidator });
            return result
        } catch (error) { throw error; }
    }

    async insertvalidation(id: string, fields: any) {
        try {
            const authUser = httpContext.get('user');
            if (authUser.category < 500) { throw new Error('Forbidden'); }

            const { userId, type, otp, signature, status, rejectReason } = fields;

            if (userId !== get(authUser, '_id')) { throw new Error('UserNotMatch'); }

            let data: Travel | OnlinePaymentMonth | null;

            const user = await UsersController.usersService.findOne({ filter: { _id: userId } });

            if (!otp) { throw new Error('OTPNotFound'); }

            if (otp !== user?.otp?.value) { throw new Error('OTPNoMatch'); }
            let level: number;

            const currTime = new Date().valueOf();

            if (Number(user?.otp?.expiresAt) <= currTime) { throw new Error('OTPExpired'); }

            data = type === 'travel'
                ? await TravelController.travelService.findOne({ filter: { _id: id } })
                : type === 'onlinePayment'
                    ? await OnlinePaymentController.onlinePaymentService.findOne({ filter: { _id: id } })
                    : null;
            if (!data) { throw new Error('DataNotFound'); }

            const userValidator: UserValidator = await ValidationsController.validationsService.findOne({ filter: { userId } });
            level = data?.validationLevel ? data?.validationLevel + 1 : 1;
            if (!userValidator || !userValidator?.enabled || userValidator?.level !== level) { throw new Error('ValidationForbidden') }

            const validator: Validator = {
                _id: userId,
                fullName: `${user.fname} ${user.lname}`,
                userCode: user?.userCode,
                signature,
                date: new Date().valueOf(),
                status,
                level,
                rejectReason
            };

            const otherValidators = await ValidationsController.validationsService.findAll({ filter: { enabled: true, level: { $gt: userValidator.level } } });
            if (isEmpty(otherValidators) || userValidator.fullRights || status === OpeVisaStatus.REJECTED) {
                data.status = status;
                // type === 'travel'
                //     ? await NotificationsController.notificationsService.sendEmailTravelStatusChanged(data as Travel, get(data, 'user.email'))
                //     : type === 'onlinePayment'
                //         ? await NotificationsController.notificationsService.sendEmailOnlinePayementStatusChanged(data as OnlinePaymentMonth, get(data, 'user.email'))
                //         : null;
                type === 'travel'
                    ? notificationEmmiter.emit('travel-status-changed-mail', new TravelStatusChangedEvent(data as Travel, rejectReason))
                    : type === 'onlinePayment'
                        ? notificationEmmiter.emit('online-payment-status-changed-mail', new OnlinePaymentStatusChangedEvent(data as OnlinePaymentMonth, rejectReason))
                        : null;
            }


            data.validators = isEmpty(data.validators) ? [validator] : [...(data?.validators || []), validator];
            data.validationLevel = level;

            const result = type === 'travel'
                ? await TravelController.travelService.updateTravelById(id, { travel: (data as Travel), steps: ['Preuve de voyage'] })
                : type === 'onlinePayment'
                    ? await OnlinePaymentController.onlinePaymentService.updateOnlinePaymentsById(id, data as OnlinePaymentMonth)
                    : null;

            if (!isEmpty(otherValidators) && status === OpeVisaStatus.JUSTIFY) {
                await Promise.all(otherValidators?.data?.filter((otherValidator: UserValidator) => otherValidator.fullRights || otherValidator.level === level + 1).map(async (otherValidator: UserValidator) => {
                    notificationEmmiter.emit('validation-required-mail', new ValidationRequiredEvent(String(data?.user?.fullName), otherValidator.email, otherValidator, type))
                    // await NotificationsController.notificationsService.sendEmailValidationRequired({ _id: id, ...data }, otherValidator.email, otherValidator, type);
                }));
            }

            return result;
        } catch (error) { throw error; }
    }

    private hasGaps(data: number[]) {
        if (!data.includes(1)) { return true }

        if (data == null || data.length === 0) return false;

        if (data[data.length - 1] - data[0] + 1 !== data.length) return true;

        for (let i = 1; i < data.length; i++)
            if (data[i] !== data[i - 1] + 1) return true;

        return false;
    }

    private validationListHasGap(validationLevelList: any[], newLevel: number) {
        validationLevelList = validationLevelList.map(elt => elt.level).sort();
        // insert level to update
        validationLevelList.push(newLevel);

        // remove duplicates levels
        validationLevelList = [...new Set(validationLevelList)];
        // control validation gap
        const isGaps = this.hasGaps(validationLevelList);

        return isGaps;
    }

}