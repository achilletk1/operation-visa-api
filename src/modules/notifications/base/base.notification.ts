import { BaseWhatsappNotification } from "./base-whatsapp.notification";
import { BaseMailNotification } from "./base-mail.notification";
import { BasePushNotification } from "./base-push.notification";
import { BaseSmsNotification } from "./base-sms.notification";
import { NotificationsType } from "../enum";

export class Notification<T> {

    constructor(protected notificationData: any, protected types: NotificationsType[]) {}

    sendNotifications() {
        const notificationTypes: any = {
            [NotificationsType.MAIL]: BaseMailNotification<T>,
            [NotificationsType.SMS]: BaseSmsNotification<T>,
            [NotificationsType.WHATSAPP]: BaseWhatsappNotification<T>,
            [NotificationsType.PUSH]: BasePushNotification<T>,
        };

        for (const type of this.types) new notificationTypes[type](this.notificationData)
    }

}