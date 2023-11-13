import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority, UsersEvent } from "modules/notifications";

export class UsersMailNotification extends BaseMailNotification<UsersEvent> {

    constructor(notificationData: UsersEvent) {
        super('users', notificationData, QueuePriority.HIGH);

        this.subject = `Création de l'utilisateur`;
    }
}