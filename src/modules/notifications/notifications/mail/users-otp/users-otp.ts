import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority, UsersEvent } from "modules/notifications";
import { UsersOtpEvent } from "./users-otp.event";

export class UsersOtpMailNotification extends BaseMailNotification<UsersOtpEvent> {

    constructor(notificationData: UsersOtpEvent) {
        super('users-otp', notificationData, QueuePriority.HIGH);

        this.subject = `OTP de connexion`;
    }
}